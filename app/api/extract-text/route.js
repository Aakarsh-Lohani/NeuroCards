import { NextResponse } from 'next/server';
import Tesseract from 'tesseract.js';

// AI-powered text cleanup and enhancement
async function enhanceExtractedText(rawText, fileType) {
  try {
    // If the text is already clean and readable, return as is
    if (rawText.length > 100 && rawText.match(/[.!?]\s/g) && rawText.split(' ').length > 20) {
      return rawText;
    }

    // Use Hugging Face API for text enhancement if available
    if (process.env.HUGGING_FACE_TOKEN) {
      try {
        const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-cnn', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: `Clean up and format this extracted ${fileType} text, removing any artifacts and making it readable: ${rawText.substring(0, 1000)}`,
            parameters: {
              max_length: 500,
              min_length: 50,
              do_sample: false
            }
          })
        });

        if (response.ok) {
          const result = await response.json();
          if (result && result[0] && result[0].summary_text) {
            return result[0].summary_text;
          }
        }
      } catch (error) {
        console.log('AI enhancement failed, using raw text:', error.message);
      }
    }

    // Fallback: Basic text cleanup
    return rawText
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/([.!?])\s*([A-Z])/g, '$1 $2') // Fix sentence spacing
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add spaces between camelCase
      .trim();

  } catch (error) {
    console.log('Text enhancement failed:', error.message);
    return rawText;
  }
}

// Simple PDF text extraction using built-in browser APIs  
async function extractPdfText(buffer) {
  try {
    // Method 1: Look for text in PDF streams
    const text = buffer.toString('binary');
    let extractedText = '';
    
    // Look for text between BT (Begin Text) and ET (End Text) operators
    const textBlocks = text.match(/BT\s+[\s\S]*?ET/g);
    if (textBlocks) {
      textBlocks.forEach(block => {
        // Extract text from parentheses (simple text strings)
        const textStrings = block.match(/\((.*?)\)/g);
        if (textStrings) {
          textStrings.forEach(str => {
            const cleanText = str.replace(/[()]/g, '').trim();
            if (cleanText.length > 1 && !cleanText.match(/^[0-9\s]+$/)) {
              extractedText += cleanText + ' ';
            }
          });
        }
        
        // Extract text from Tj operators
        const tjMatches = block.match(/\((.*?)\)\s*Tj/g);
        if (tjMatches) {
          tjMatches.forEach(match => {
            const textContent = match.match(/\((.*?)\)/);
            if (textContent && textContent[1]) {
              extractedText += textContent[1] + ' ';
            }
          });
        }
      });
    }
    
    // Method 2: If no structured text found, try binary parsing
    if (extractedText.trim().length < 20) {
      const binaryText = buffer.toString('utf8', 0, Math.min(buffer.length, 50000));
      
      // Remove PDF structure and extract readable text
      const lines = binaryText.split(/[\r\n]+/);
      const meaningfulLines = [];
      
      lines.forEach(line => {
        const cleaned = line
          .replace(/[^\x20-\x7E]/g, ' ') // Replace non-printable with spaces
          .replace(/\s+/g, ' ')
          .trim();
        
        // Keep lines that look like readable text
        if (cleaned.length > 10 && 
            !cleaned.match(/^[0-9\.\s]+$/) &&
            !cleaned.includes('obj') &&
            !cleaned.includes('endobj') &&
            !cleaned.includes('stream') &&
            !cleaned.includes('>>') &&
            cleaned.match(/[a-zA-Z]/)) {
          meaningfulLines.push(cleaned);
        }
      });
      
      extractedText = meaningfulLines.join(' ');
    }
    
    // Clean up the extracted text
    extractedText = extractedText
      .replace(/\s+/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .trim();
    
    if (extractedText.length < 50) {
      throw new Error('PDF appears to be image-based or encrypted. Please try converting it to text first.');
    }
    
    return extractedText;
    
  } catch (error) {
    throw new Error(`PDF text extraction failed: ${error.message}. Try using an OCR-compatible PDF or convert to plain text.`);
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const fileType = formData.get('fileType');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    let extractedText = '';
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    switch (fileType) {
      case 'pdf':
        try {
          extractedText = await extractPdfText(buffer);
        } catch (error) {
          console.error('PDF parsing error:', error);
          return NextResponse.json(
            { error: 'Failed to parse PDF. Please try converting it to text first or use a different PDF.' },
            { status: 400 }
          );
        }
        break;

      case 'image':
        try {
          const { data: { text } } = await Tesseract.recognize(buffer, 'eng', {
            logger: m => console.log(m)
          });
          extractedText = text;
        } catch (error) {
          console.error('OCR error:', error);
          return NextResponse.json(
            { error: 'Failed to extract text from image. Please ensure the image contains readable text.' },
            { status: 400 }
          );
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Unsupported file type' },
          { status: 400 }
        );
    }

    if (!extractedText || extractedText.trim().length < 10) {
      return NextResponse.json(
        { error: 'No readable text found in the file. Please try a different file.' },
        { status: 400 }
      );
    }

    // Enhance the extracted text using AI
    const enhancedText = await enhanceExtractedText(extractedText, fileType);

    return NextResponse.json({
      success: true,
      text: enhancedText.trim(),
      rawText: extractedText.trim(), // Include raw text for debugging
      message: `Successfully extracted and enhanced ${enhancedText.length} characters from ${fileType.toUpperCase()}`
    });

  } catch (error) {
    console.error('File processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process file. Please try again.' },
      { status: 500 }
    );
  }
}
