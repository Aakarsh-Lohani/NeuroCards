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
# Or deploy manually
npm run build
vercel --prod
```

### Other Platforms

The app can be deployed on any platform supporting Next.js applications:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 **Email**: support@neurocards.app
- 💬 **Discord**: [Join our community](https://discord.gg/neurocards)
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/neurocards/issues)
- 📖 **Documentation**: [docs.neurocards.app](https://docs.neurocards.app)

## 🙏 Acknowledgments

- **Hugging Face** for providing free AI inference APIs
- **MongoDB Atlas** for reliable cloud database hosting
- **Vercel** for seamless deployment and hosting
- **Open Source Community** for the amazing tools and libraries

---

<div align="center">
  <p>Made with ❤️ for learners everywhere</p>
  <p>
    <a href="#-neurocards---activate-your-memory-muscle">⬆️ Back to Top</a>
  </p>
</div>
