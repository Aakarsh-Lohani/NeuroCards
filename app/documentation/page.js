import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TechStack = [
    { name: 'Next.js', desc: 'React framework for production' },
    { name: 'React', desc: 'UI library for building components' },
    { name: 'Tailwind CSS', desc: 'Utility-first CSS framework' },
    { name: 'Node.js', desc: 'backend runtime to handle API routes, server-side logic, and calls to AI services Hugging Face and Gemini.' },
    { name: 'Framer Motion', desc: 'Animation library for React' },
    { name: 'MongoDB', desc: 'NoSQL database for storing decks' },
    { name: 'Gemini API', desc: 'For AI-powered text extraction and Q&A generation' },
    { name: 'Hugging Face', desc: 'Fallback AI models for Q&A generation' },
    { name: 'Vercel', desc: 'Platform for deployment and hosting' },
];

const FeatureDetails = [
    {
        title: 'Text Input',
        icon: '📝',
        desc: 'Directly paste your notes, articles, or any text into the text area. The AI will read the content and generate relevant question-and-answer pairs for your flashcards.',
        steps: [
            'Select the "Text Input" tab.',
            'Optionally, provide a title for your deck.',
            'Paste your content into the text area.',
            'Click "Generate AI Flashcards" and preview your new deck.',
            'Save the deck to your dashboard.'
        ]
    },
    {
        title: 'File Upload (PDF/TXT)',
        icon: '📄',
        desc: 'Upload your study materials directly. The application supports both plain text (.txt) files and PDF (.pdf) documents, using advanced AI to extract text even from scanned PDFs.',
        steps: [
            'Select the "File Upload" tab.',
            'Click "Choose File" or drag and drop your file.',
            'The file name will be used as the default deck title.',
            'The AI will process the file to extract text.',
            'Flashcards will be generated automatically for you to preview and save.'
        ]
    },
    {
        title: 'YouTube Video URL',
        icon: '🎥',
        desc: 'Provide a link to any YouTube video with captions. NeuroCards will automatically fetch the transcript and create a flashcard deck based on the video\'s content.',
        steps: [
            'Select the "Video URL" tab.',
            'Paste the YouTube video URL into the input field.',
            'Click "Process YouTube Video".',
            'The AI will generate flashcards from the transcript.',
            'Preview and save your new deck.'
        ]
    }
];

const Workflows = [
    {
        title: 'Text Input Workflow',
        steps: [
            'User provides raw text and clicks "Generate".',
            'The text is sent to the `/api/generate-qa` endpoint.',
            '**Gemini API** performs a content moderation check.',
            'If the content is safe, the **Gemini API** generates question-and-answer pairs.',
            'The generated flashcards are returned to the frontend for preview.',
            'User saves the deck, which is stored in **MongoDB**.'
        ]
    },
    {
        title: 'File Upload Workflow',
        steps: [
            'User uploads a `.txt` or `.pdf` file.',
            'The file is sent to the `/api/extract-text` endpoint.',
            'For PDFs, the **Gemini Vision API** extracts the text. For `.txt` files, text is read directly.',
            'The extracted text is returned to the frontend.',
            'The frontend then sends this text to the `/api/generate-qa` endpoint.',
            'The process continues like the Text Input Workflow (moderation, Q&A generation, etc.).'
        ]
    },
    {
        title: 'YouTube Video Workflow',
        steps: [
            'User provides a YouTube URL and clicks "Process".',
            'The URL is sent to the `/api/process-youtube` endpoint.',
            'The **Gladia API** is used to fetch the video transcript.',
            'The transcript is then passed to the Q&A generation service.',
            '**Gemini API** performs a content moderation check on the transcript.',
            'If safe, the **Gemini API** generates question-and-answer pairs.',
            'The complete flashcard deck is returned to the frontend for preview.',
            'User saves the deck to **MongoDB**.'
        ]
    }
];


export default function DocumentationPage() {
    return (
        <div className="bg-white min-h-screen">
            <Navbar />
            <main className="pt-24 pb-20">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                            NeuroCards <span className="text-orange-500">Documentation</span>
                        </h1>
                        <p className="text-xl text-gray-600">
                            Everything you need to know about NeuroCards.
                        </p>
                    </div>

                    {/* Features Section */}
                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8">How to Use NeuroCards</h2>
                        <div className="space-y-8">
                            {FeatureDetails.map((feature, index) => (
                                <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                    <div className="flex items-center mb-4">
                                        <span className="text-3xl mr-4">{feature.icon}</span>
                                        <h3 className="text-2xl font-semibold text-gray-900">{feature.title}</h3>
                                    </div>
                                    <p className="text-gray-700 mb-4">{feature.desc}</p>
                                    <ol className="list-decimal list-inside space-y-2 text-gray-600">
                                        {feature.steps.map((step, i) => <li key={i}>{step}</li>)}
                                    </ol>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Workflow Section */}

                    <section className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8">Application Workflow</h2>
                        <div className="space-y-12">
                            {Workflows.map((workflow, index) => (
                                <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">{workflow.title}</h3>
                                    <div className="flex flex-col space-y-6 relative">
                                        {workflow.steps.map((step, i) => {
                                            // Replace **text** with <strong>text</strong> for Tailwind bold
                                            const formattedStep = step.replace(
                                                /\*\*(.*?)\*\*/g,
                                                (_, p1) => `<strong class="font-bold text-gray-900">${p1}</strong>`
                                            );

                                            return (
                                                <div key={i} className="flex items-start">
                                                    {/* Step circle */}
                                                    <div className="flex-shrink-0 h-8 w-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold mt-1">
                                                        {i + 1}
                                                    </div>
                                                    {/* Step text */}
                                                    <p
                                                        className="ml-4 text-gray-700"
                                                        dangerouslySetInnerHTML={{ __html: formattedStep }}
                                                    ></p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>



                    {/* Tech Stack Section */}
                    <section>
                        <h2 className="text-3xl font-bold text-gray-800 mb-8">Technology Stack</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {TechStack.map((tech, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-xl text-center border border-gray-200">
                                    <p className="font-semibold text-gray-800">{tech.name}</p>
                                    <p className="text-sm text-gray-600">{tech.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}