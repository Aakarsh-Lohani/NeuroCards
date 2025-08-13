import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Gemini-powered OCR extraction for PDFs and other documents
async function extractTextWithGemini(buffer, mimeType) {
  if (!GEMINI_API_KEY) {
    console.error('Gemini API key is not configured.');
    return null; 
  }

  // Use the specified gemini-2.0-flash model
  const model = 'gemini-2.0-flash';
  console.log(`Trying text extraction with Gemini model: ${model}...`);

  try {
    const base64File = buffer.toString('base64');
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: "Extract all text from this document. If the document contains images, perform OCR on them to extract the text." },
              { inline_data: { mime_type: mimeType, data: base64File } }
            ]
          }]
        })
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gemini API request failed with status ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (content) {
      console.log('Successfully extracted text with Gemini.');
      return content;
    } else {
      console.warn('Gemini response did not contain extractable text.');
      return null;
    }
  } catch (error) {
    console.error('Gemini extraction failed:', error.message);
    return null;
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    let extractedText = '';
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (file.type === 'application/pdf') {
      // Use Gemini exclusively for PDFs
      extractedText = await extractTextWithGemini(buffer, file.type);
      if (!extractedText) {
         throw new Error('Failed to extract text from PDF using Gemini. The document might be empty or corrupted.');
      }
    } else if (file.type === 'text/plain') {
      extractedText = buffer.toString('utf8');
    } else {
      // You could add more Gemini-supported types here, like images
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
    }

    if (!extractedText || extractedText.trim().length < 10) {
      return NextResponse.json(
        { error: 'No readable text was found in the file. Please try a different file.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      text: extractedText.trim(),
    });

  } catch (error) {
    console.error('File processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process file. Please try again.' },
      { status: 500 }
    );
  }
}

