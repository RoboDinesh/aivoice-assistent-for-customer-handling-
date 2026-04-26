# Sudur Pickles | Kannada Voice AI Assistant 🥒🎧

A high-end, responsive voice agent designed to help small businesses handle customer inquiries using natural language. This project specifically caters to a traditional pickle shop (Sudur Pickles), allowing customers to ask about varieties, prices, and delivery in **Kannada**.

## ✨ Features
- **Native Kannada Support**: Recognizes Kannada (`kn-IN`) speech and responds with a natural Kannada voice.
- **Gemini AI Integration**: Uses Google's `gemini-1.5-flash` model for intelligent, context-aware conversations.
- **Instant Local Matching**: Answers common questions (like price and types) instantly using a local knowledge base.
- **Premium "Voice Orb" UI**: A beautiful, glassmorphic web interface with pulsing animations that react to voice states.
- **Hybrid Brain**: Combines fast local rules with advanced AI backup for maximum reliability.

## 🚀 Tech Stack
- **Frontend**: HTML5, Vanilla CSS3 (Glassmorphism), JavaScript (ES6+).
- **Speech**: Web Speech API (SpeechRecognition & SpeechSynthesis).
- **AI Engine**: Google Generative AI (Gemini API).

## 🛠️ How to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/RoboDinesh/aivoice-assistent-for-customer-handling-.git
   cd aivoice-assistent-for-customer-handling-
   ```

2. **Start a local server**:
   Since browsers block microphone features on local files, you must run this through a server:
   ```bash
   npx http-server
   ```

3. **Access the App**:
   Open your browser and navigate to `http://127.0.0.1:8080`.

## 📝 Customization
You can easily adapt this for any other small business by updating the constants in `app.js`.

---
Built with ❤️ by [RoboDinesh](https://github.com/RoboDinesh)
