# 🧠 NeuroCards - Activate Your Memory Muscle

YouTube video : https://youtu.be/JjIqB9FCDt8?si=_7X3-w8EbltheOjB

**NeuroCards** is an AI-powered flashcard application that automatically converts your notes, PDFs, images, and video transcripts into intelligent flashcards and adaptive quizzes using the Hugging Face API.

![NeuroCards Demo](https://via.placeholder.com/800x400/FF6B35/FFFFFF?text=NeuroCards+AI+Flashcards)

## ✨ Features

- 🤖 **AI-Powered Generation**: Automatically create flashcards from any text content
- 📚 **Multi-Format Support**: Text, PDFs, images, and video transcripts (coming soon)
- 🔄 **Spaced Repetition**: Optimize memory retention with intelligent review scheduling
- 📊 **Smart Analytics**: Track your learning progress and performance
- ☁️ **Cloud Storage**: Securely store your decks with MongoDB Atlas
- 🎯 **Interactive Study Mode**: Flip-card interface with immediate feedback
- 📱 **Responsive Design**: Works perfectly on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier)
- Hugging Face account and API token (free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/neurocards.git
   cd neurocards
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your credentials:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/neurocards
   HUGGING_FACE_TOKEN=your_hugging_face_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 15, React, Tailwind CSS, Framer Motion | Modern UI with animations |
| **Backend** | Next.js API Routes, Node.js | Serverless API endpoints |
| **AI** | Hugging Face Inference API | Question-answer generation |
| **Database** | MongoDB Atlas | Cloud storage for decks |
| **Deployment** | Vercel | Serverless hosting |

## 📖 How to Use

### 1. Create Your First Deck
- Navigate to the **Create** page
- Choose your input method:
  - **Text Input**: Paste your study material
  - **File Upload**: Upload text files or PDFs
  - **Video URL**: Add YouTube links (coming soon)

### 2. Generate AI Flashcards
- Click "Generate AI Flashcards"
- Watch as AI analyzes your content and creates question-answer pairs
- Preview and edit the generated cards

### 3. Save and Study
- Save your deck to the cloud
- Use the **Dashboard** to manage your collections
- Enter **Study Mode** for interactive learning

### 4. Track Your Progress
- View detailed analytics on your performance
- Monitor accuracy rates and review counts
- Identify areas that need more focus

## 🧩 Project Structure

```
neurocards/
├── app/
│   ├── api/
│   │   ├── generate-qa/     # AI flashcard generation
│   │   ├── save-deck/       # Deck persistence
│   │   └── load-decks/      # Deck retrieval
│   ├── create/              # Flashcard creation page
│   ├── dashboard/           # User dashboard
│   ├── study/[id]/         # Study mode
│   └── page.js             # Landing page
├── components/
│   ├── FileUpload.js       # Content upload interface
│   ├── FlashcardPreview.js # Card preview and editing
│   ├── StudyCard.js        # Interactive study interface
│   └── ...                 # Other UI components
└── styles/
    └── globals.css         # Global styles
```

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate-qa` | POST | Generate flashcards from text |
| `/api/save-deck` | POST | Save flashcard deck to database |
| `/api/load-decks` | GET | Retrieve user's decks |
| `/api/load-decks?id=` | GET | Get specific deck |
| `/api/load-decks?id=` | DELETE | Delete a deck |

## 🎨 Design Philosophy

NeuroCards follows a modern, clean design inspired by contemporary educational platforms:

- **Orange-to-Pink Gradients**: Energetic and engaging color scheme
- **Card-Based Interface**: Intuitive and familiar interaction patterns
- **Smooth Animations**: Enhanced user experience with Framer Motion
- **Mobile-First**: Responsive design that works on all devices

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository to Vercel**
2. **Add environment variables in Vercel dashboard**
3. **Deploy automatically on every push**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
