/**
 * Voice Agent for Sudur Pickles | Kannada Version (ಕನ್ನಡ)
 */

const API_KEY = "AIzaSyCiDcqvl7kkBrz3PMkYtkUCRgTbQHBJzr8";

// 1. KANNADA KNOWLEDGE BASE (INSTANT)
const KNOWLEDGE_BASE = {
    "greetings": {
        "patterns": ["ನಮಸ್ಕಾರ", "ಹಲೋ", "ಹಾಯ್", "ಹೆಲೋ"],
        "responses": ["ನಮಸ್ಕಾರ! ಸುದೂರು ಉಪ್ಪಿನಕಾಯಿ ಅಂಗಡಿಗೆ ಸ್ವಾಗತ. ನಾವು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?"]
    },
    "varieties": {
        "patterns": ["ಯಾವ", "ಉಪ್ಪಿನಕಾಯಿ", "ಐಟಂ", "ಲಿಸ್ಟ್"],
        "responses": ["ನಮ್ಮಲ್ಲಿ ಮಾವಿನಕಾಯಿ, ನಿಂಬೆಹಣ್ಣು, ಬೆಳ್ಳುಳ್ಳಿ, ಅಮಟೆಕಾಯಿ ಮತ್ತು ಶುಂಠಿ ಉಪ್ಪಿನಕಾಯಿಗಳು ಲಭ್ಯವಿದೆ."]
    },
    "price": {
        "patterns": ["ಬೆಲೆ", "ರೇಟು", "ಎಷ್ಟು", "ದುಡ್ಡು"],
        "responses": ["ಉಪ್ಪಿನಕಾಯಿ ಬೆಲೆ 150 ರೂಪಾಯಿಯಿಂದ ಪ್ರಾರಂಭವಾಗುತ್ತದೆ. ಸ್ಪೆಷಲ್ ಮಾವಿನಕಾಯಿ ಉಪ್ಪಿನಕಾಯಿ 250 ರೂಪಾಯಿ."]
    },
    "delivery": {
        "patterns": ["ಡೆಲಿವರಿ", "ಕಳುಹಿಸಿಕೊಡಿ", "ಹೋಮ್ ಡೆಲಿವರಿ"],
        "responses": ["ನಾವು ಬೆಂಗಳೂರಿನಲ್ಲಿ ಹೋಮ್ ಡೆಲಿವರಿ ನೀಡುತ್ತೇವೆ ಮತ್ತು ಭಾರತದಾದ್ಯಂತ ಕೊರಿಯರ್ ಮೂಲಕ ಕಳುಹಿಸುತ್ತೇವೆ."]
    }
};

class VoiceAgent {
    constructor() {
        this.statusEl = document.getElementById('status');
        this.transcriptEl = document.getElementById('transcript');
        this.container = document.querySelector('.container');
        this.startBtn = document.getElementById('start-btn');
        this.autoBtn = document.getElementById('auto-btn');

        this.isListening = false;
        this.isSpeaking = false;
        this.autoListen = false;
        
        this.initAI();
        this.initSpeech();
        this.attachEvents();
    }

    async initAI() {
        try {
            const { GoogleGenerativeAI } = await import("https://esm.run/@google/generative-ai");
            const genAI = new GoogleGenerativeAI(API_KEY);
            this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            this.chat = this.model.startChat({
                history: [
                    { 
                        role: "user", 
                        parts: [{ text: "You are the Kannada Voice Assistant for 'Sudur Pickles'. Always respond in Kannada (ಕನ್ನಡ). Keep answers very short (1 sentence)." }] 
                    },
                    { role: "model", parts: [{ text: "ಸರಿ, ನಾನು ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡುತ್ತೇನೆ." }] }
                ],
            });
        } catch(e) { console.warn("AI Load Failed"); }
    }

    initSpeech() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'kn-IN'; // Kannada Language
        this.recognition.continuous = false; // Stopped for better control
        this.recognition.interimResults = false;

        this.recognition.onstart = () => { 
            this.isListening = true; 
            this.updateUI(); 
        };

        this.recognition.onend = () => { 
            this.isListening = false; 
            this.updateUI(); 
            // If user clicked but no speech was found, we give feedback
        };

        this.recognition.onresult = async (event) => {
            console.log("Recognition Success:", event.results);
            const text = event.results[0][0].transcript;
            console.log("Transcript Received:", text);
            this.transcriptEl.innerText = `You said: "${text}"`;
            this.handleInput(text);
        };

        this.recognition.onerror = (e) => {
            console.error("Recognition Error:", e.error);
            this.statusEl.innerText = "Mic Error: " + e.error;
        };
    }

    attachEvents() {
        this.startBtn.onclick = () => this.toggle();
        document.getElementById('orb-trigger').onclick = () => this.toggle();
        this.autoBtn.onclick = () => {
            this.autoListen = !this.autoListen;
            this.autoBtn.innerText = `Auto: ${this.autoListen ? 'ON' : 'OFF'}`;
            this.autoBtn.classList.toggle('active');
        };
    }

    toggle() {
        if (this.isListening) {
            this.recognition.stop();
        } else {
            window.speechSynthesis.cancel();
            this.isSpeaking = false;
            try { this.recognition.start(); } catch(e) {}
        }
    }

    updateUI() {
        this.container.classList.toggle('listening', this.isListening);
        this.statusEl.innerText = this.isListening ? "Listening..." : (this.isSpeaking ? "Speaking..." : "Ready");
    }

    async handleInput(input) {
        console.log("Processing input:", input);
        if (!input) return;

        // 1. Kannada Local Check (Fast)
        for (const key in KNOWLEDGE_BASE) {
            if (KNOWLEDGE_BASE[key].patterns.some(p => input.includes(p))) {
                console.log("Local match found:", key);
                this.speak(KNOWLEDGE_BASE[key].responses[0]);
                return;
            }
        }

        // 2. AI Backup (Kannada)
        if (this.chat) {
            console.log("Sending to AI...");
            this.statusEl.innerText = "Thinking...";
            try {
                const result = await this.chat.sendMessage(input);
                const reply = await result.response.text();
                console.log("AI Response:", reply);
                this.speak(reply);
            } catch(e) { 
                console.error("AI Error:", e);
                this.speak("ಕ್ಷಮಿಸಿ, ಸಂಪರ್ಕದ ತೊಂದರೆ ಇದೆ. ಇನ್ನೊಮ್ಮೆ ಹೇಳಿ?"); 
            }
        } else {
            console.warn("AI not initialized yet.");
            this.speak("ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ಇನ್ನೊಮ್ಮೆ ಹೇಳುತ್ತೀರಾ?");
        }
    }

    speak(text) {
        this.isSpeaking = true;
        this.updateUI();
        this.transcriptEl.innerText = "Agent: " + text;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'kn-IN'; // Ensure it speaks in Kannada
        
        const voices = window.speechSynthesis.getVoices();
        // Look for any Kannada voice (usually 'Google ಕನ್ನಡ')
        const knVoice = voices.find(v => v.lang === 'kn-IN');
        if (knVoice) utterance.voice = knVoice;
        
        utterance.rate = 1.0;
        utterance.onend = () => {
            this.isSpeaking = false;
            this.updateUI();
            if (this.autoListen) setTimeout(() => this.recognition.start(), 1000);
        };
        window.speechSynthesis.speak(utterance);
    }
}

window.onload = () => new VoiceAgent();
