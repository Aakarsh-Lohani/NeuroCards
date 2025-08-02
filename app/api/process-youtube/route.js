import { NextResponse } from 'next/server';

// Simple YouTube transcript extraction
async function getYouTubeTranscript(videoUrl) {
  try {
    // Extract video ID from URL
    const videoIdMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    if (!videoIdMatch) {
      throw new Error('Invalid YouTube URL');
    }
    
    const videoId = videoIdMatch[1];
    console.log('Processing video ID:', videoId);
    
    // Try multiple approaches to get transcript
    const transcriptSources = [
      `https://www.youtube.com/api/timedtext?lang=en&v=${videoId}`,
      `https://www.youtube.com/api/timedtext?lang=auto&v=${videoId}`,
      `https://www.youtube.com/api/timedtext?v=${videoId}`,
    ];
    
    for (const transcriptUrl of transcriptSources) {
      try {
        console.log('Trying transcript URL:', transcriptUrl);
        const response = await fetch(transcriptUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        if (response.ok) {
          const xmlText = await response.text();
          console.log('Response received, parsing XML...');
          
          // Parse XML to extract text
          const textMatches = xmlText.match(/<text[^>]*>(.*?)<\/text>/g);
          if (textMatches && textMatches.length > 0) {
            const transcript = textMatches
              .map(match => {
                // Remove HTML tags and decode entities
                return match
                  .replace(/<[^>]*>/g, '')
                  .replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&quot;/g, '"')
                  .replace(/&#39;/g, "'")
                  .replace(/&apos;/g, "'");
              })
              .join(' ')
              .trim();
            
            if (transcript && transcript.length > 50) {
              console.log('Transcript extracted successfully, length:', transcript.length);
              return transcript;
            }
          }
        }
      } catch (error) {
        console.log('Failed with URL:', transcriptUrl, error.message);
        continue;
      }
    }
    
    throw new Error('YouTube transcript not available for this video. The video may not have captions enabled or may be private.');
  } catch (error) {
    throw error;
  }
}

export async function POST(request) {
  try {
    const { videoUrl } = await request.json();
    
    if (!videoUrl) {
      return NextResponse.json(
        { error: 'Video URL is required' },
        { status: 400 }
      );
    }

    // Validate YouTube URL
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
    if (!youtubeRegex.test(videoUrl)) {
      return NextResponse.json(
        { error: 'Please provide a valid YouTube URL' },
        { status: 400 }
      );
    }

    console.log('Processing YouTube video:', videoUrl);

    const transcript = await getYouTubeTranscript(videoUrl);
    
    if (!transcript || transcript.length < 50) {
      return NextResponse.json(
        { error: 'No transcript available or transcript too short. Please ensure the video has captions enabled.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      text: transcript,
      message: `Successfully extracted transcript (${transcript.length} characters)`,
      source: 'YouTube Video Transcript'
    });

  } catch (error) {
    console.error('YouTube processing error:', error);
    
    // Provide helpful error messages
    let errorMessage = 'Failed to process YouTube video.';
    if (error.message.includes('Invalid YouTube URL')) {
      errorMessage = 'Please provide a valid YouTube URL (youtube.com/watch?v=... or youtu.be/...)';
    } else if (error.message.includes('Transcript not available')) {
      errorMessage = 'This video does not have captions available. Please try a different video or manually input the content.';
    } else if (error.message.includes('No transcript text found')) {
      errorMessage = 'Could not extract transcript from this video. The video may not have proper captions.';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}
