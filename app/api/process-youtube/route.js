import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { videoUrl } = await request.json();
    if (!videoUrl) {
      return NextResponse.json({ error: "Video URL is required" }, { status: 400 });
    }

    // Step 1: Start transcription
    const initiation = await fetch("https://api.gladia.io/v2/pre-recorded", {
      method: "POST",
      headers: {
        "x-gladia-key": process.env.GLADIA_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ audio_url: videoUrl }),
    });

    const initData = await initiation.json();
    if (!initiation.ok) {
      return NextResponse.json({ error: "Initiation failed", details: initData }, { status: 500 });
    }

    const jobId = initData.id;
    const resultUrl = initData.result_url;
    if (!jobId || !resultUrl) {
      return NextResponse.json({ error: "Invalid Gladia response", details: initData }, { status: 500 });
    }

    // Step 2: Poll for completion (max 12 attempts, 5s apart)
    let resultData;
    for (let i = 0; i < 12; i++) {
      await new Promise((r) => setTimeout(r, 5000));
      const res = await fetch(resultUrl, {
        headers: { "x-gladia-key": process.env.GLADIA_API_KEY },
      });
      resultData = await res.json();
      if (res.ok && resultData.status === "done") {
        break;
      }
    }

    if (!resultData || resultData.status !== "done") {
      console.error("Polling failed or transcription not completed", resultData);
      return NextResponse.json({ error: "Transcription not completed in time", details: resultData }, { status: 500 });
    }

    const transcript = resultData.result?.transcription?.full_transcript;
    
    if (!transcript) {
      console.error("No transcription available", resultData);
      return NextResponse.json({ error: "No transcription available", raw: resultData }, { status: 500 });
    }
    console.log(transcript)

    // Step 3: Forward to your flashcard API
    const flashcardApiUrl = new URL("/api/generate-qa", request.url).toString();
    const flashResponse = await fetch(flashcardApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: transcript }),
    });

    if (!flashResponse.ok) {
      const flashError = await flashResponse.json();
      return NextResponse.json({ error: "Flashcard generation failed", details: flashError }, { status: 500 });
    }

    const flashcards = await flashResponse.json();

    return NextResponse.json({
      success: true,
      transcription: transcript,
      flashcards,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unexpected server error", details: err.message }, { status: 500 });
  }
}
