/**
 * Voice Control with AI Integration for Flashcard Management
 * Allows users to create, edit, and manage flashcards via voice commands
 * Commands: "Create flashcard...", "Edit flashcard...", "Delete flashcard...", "Show my flashcards"
 */

class VoiceAIController {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.synth = window.speechSynthesis;
        this.currentTranscript = '';
        this.currentQuizId = null;
        this.setupSpeechRecognition();
    }

    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.error('Speech Recognition not supported in this browser');
            this.showVoiceStatus('Voice not supported', 'error');
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.language = 'en-US';

        this.setupListeners();
    }

    initializeVoiceButton() {
        // Create voice control button if it doesn't exist
        let voiceBtn = document.getElementById('voice-control-btn');
        if (!voiceBtn) {
            const nav = document.querySelector('.navbar');
            if (nav) {
                voiceBtn = document.createElement('button');
                voiceBtn.id = 'voice-control-btn';
                voiceBtn.className = 'voice-btn';
                voiceBtn.innerHTML = '🎤 Voice Command';
                voiceBtn.style.marginRight = '10px';
                nav.appendChild(voiceBtn);
                voiceBtn.addEventListener('click', () => this.toggleVoiceControl());
            }
        }
    }

    setupListeners() {
        if (!this.recognition) return;

        this.recognition.onstart = () => {
            this.isListening = true;
            this.showVoiceStatus('listening');
            this.updateTranscript('🎤 Listening... Speak a command');
            console.log('Voice recognition started');
        };

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            this.currentTranscript = finalTranscript || interimTranscript;
            this.updateTranscript(this.currentTranscript);

            if (finalTranscript) {
                console.log('Final transcript:', finalTranscript);
                this.processVoiceCommand(finalTranscript);
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
            
            let errorMessage = 'Error: ';
            
            switch(event.error) {
                case 'network':
                    errorMessage += 'Network error - check internet connection';
                    break;
                case 'audio':
                    errorMessage += 'Audio error - check microphone';
                    break;
                case 'not-allowed':
                    errorMessage += 'Microphone permission denied - allow in browser settings';
                    break;
                case 'no-speech':
                    errorMessage += 'No speech detected - try again';
                    break;
                default:
                    errorMessage += event.error;
            }
            
            this.showVoiceStatus('error');
            this.updateTranscript(errorMessage);
            this.speak(errorMessage);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            if (!this.currentTranscript) {
                this.showVoiceStatus('idle');
            }
            console.log('Voice recognition ended');
        };
    }

    toggleVoiceControl() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        if (!this.recognition) {
            console.error('Speech Recognition not initialized');
            return;
        }
        try {
            this.recognition.start();
            this.isListening = true;
        } catch (error) {
            console.error('Error starting recognition:', error);
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.abort();
            this.isListening = false;
            this.showVoiceStatus('idle');
        }
    }

    speak(text, callback = null) {
        return new Promise((resolve) => {
            if (!this.synth) {
                resolve();
                return;
            }

            this.synth.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = 1;

            const finishHandler = () => {
                if (callback) callback();
                resolve();
            };

            utterance.onend = finishHandler;
            utterance.onerror = finishHandler;

            this.synth.speak(utterance);
        });
    }

    showVoiceStatus(status) {
        const badge = document.querySelector('.voice-status-badge');
        if (!badge) return;

        badge.className = 'voice-status-badge ' + status;

        const statusTexts = {
            'idle': '🎤 Ready',
            'listening': '🎧 Listening...',
            'processing': '⚙️ Processing...',
            'creating': '⚙️ Creating...',
            'success': '✓ Success!',
            'error': '✗ Error'
        };

        badge.textContent = statusTexts[status] || status;
    }

    updateTranscript(text) {
        const transcript = document.querySelector('.voice-transcript');
        if (transcript) {
            transcript.textContent = text;
            transcript.scrollTop = transcript.scrollHeight;
        }
    }

    async confirmAndCreateQuiz(topic, numQuestions, originalCommand) {
        this.showVoiceStatus('creating');
        
        const confirmMessage = `Creating a ${numQuestions} question quiz about ${topic}`;
        console.log('Confirmation:', confirmMessage);
        this.updateTranscript(confirmMessage);
        
        await this.speak(confirmMessage);
        await this.createQuiz(topic, numQuestions);
    }

    processVoiceCommand(transcript) {
        if (!transcript) return;

        const command = transcript.toLowerCase().trim();
        console.log('🎤 Processing voice command:', command);
        this.showVoiceStatus('processing');

        // Quiz creation commands - with correct operator precedence
        if ((command.includes('make') || command.includes('create')) && command.includes('quiz')) {
            this.handleQuizCreation(command);
        }
        // Flashcard creation commands
        else if (command.includes('create') && command.includes('flashcard')) {
            this.speak('Flashcard creation feature is available in the edit flashcards page');
            this.updateTranscript('Navigate to edit flashcards to create new cards');
            this.showVoiceStatus('idle');
        }
        // Edit flashcard command
        else if (command.includes('edit') && command.includes('flashcard')) {
            this.speak('Redirecting to flashcard editor');
            this.updateTranscript('Opening flashcard editor...');
            this.showVoiceStatus('success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        }
        // Show flashcards command
        else if (command.includes('show') && command.includes('flashcard')) {
            this.speak('Showing all your flashcards and quizzes');
            this.updateTranscript('Displaying quizzes...');
            this.showVoiceStatus('idle');
        }
        // Delete command
        else if (command.includes('delete')) {
            this.speak('Please use the delete button on the quiz card to safely remove a quiz');
            this.updateTranscript('Use the trash icon button to delete quizzes');
            this.showVoiceStatus('idle');
        }
        else {
            const response = 'I understood: "' + transcript + '". Try saying "Make a quiz about Python" or "Show my flashcards"';
            this.speak(response);
            this.updateTranscript(response);
            this.showVoiceStatus('idle');
        }
    }

    handleQuizCreation(command) {
        console.log('handleQuizCreation - Raw command:', command);

        // Extract number of questions (if specified)
        let numQuestions = 10; // default
        const numberMatch = command.match(/\b(\d+)\s+question/i);
        if (numberMatch) {
            numQuestions = Math.min(Math.max(parseInt(numberMatch[1]), 1), 20); // 1-20 questions
        } else {
            // Fall back to any standalone number in the command
            const anyNumber = command.match(/\b(\d+)\b/);
            if (anyNumber) {
                numQuestions = Math.min(Math.max(parseInt(anyNumber[1]), 1), 20);
            }
        }

        // Extract topic using a single targeted regex:
        // Matches "about <topic>" or "on <topic>" after stripping the quiz/number preamble.
        // e.g. "make a 5 question quiz about Python" → "Python"
        //      "create a quiz on history"            → "history"
        let topic = null;

        const topicMatch = command.match(/(?:quiz\s+(?:about|on)|(?:about|on)\s+(?:a\s+)?quiz)\s+(.+)/i)
            || command.match(/(?:about|on)\s+(.+)/i);

        if (topicMatch) {
            topic = topicMatch[1]
                .replace(/\b\d+\s+questions?\b/gi, '') // strip "5 questions" fragments
                .trim();
        }

        // Validate: reject undefined, empty string, or the literal string "undefined"
        if (!topic || typeof topic !== 'string' || topic.toLowerCase() === 'undefined' || topic === '') {
            topic = 'general knowledge';
        }

        console.log('handleQuizCreation - Extracted topic:', topic, '| Questions:', numQuestions);
        this.confirmAndCreateQuiz(topic, numQuestions, command);
    }

    async createQuiz(topic, numQuestions) {
        if (typeof apiCall !== 'function') {
            console.error('apiCall function not found');
            this.showVoiceStatus('error');
            this.speak('Error: API not available');
            return;
        }

        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.error('No auth token found');
            this.showVoiceStatus('error');
            this.speak('Error: Not logged in. Please log in first.');
            this.updateTranscript('Error: Not logged in');
            return;
        }

        try {
            console.log('🎤 Voice Control: Making API call to /quiz/create-from-topic');
            console.log('Topic:', topic, 'Questions:', numQuestions);
            
            const response = await apiCall('/quiz/create-from-topic', 'POST', {
                topic: topic,
                num_questions: numQuestions
            });

            console.log('🎤 API Response:', response);

            if (response.error) {
                throw new Error(response.error);
            }

            const quizId = response.quiz?.id || response.quiz_id;
            if (!quizId) {
                console.warn('No quiz id in response:', response);
                throw new Error('No quiz created');
            }

            const attemptResult = await apiCall(`/quiz/attempt/start/${quizId}`, 'POST');
            if (attemptResult.error || !attemptResult.attempt) {
                console.warn('Unable to start quiz attempt automatically:', attemptResult);
                throw new Error(attemptResult.error || 'Quiz created but could not start attempt');
            }

            localStorage.setItem('current_quiz_id', quizId);
            localStorage.setItem('current_attempt', JSON.stringify(attemptResult.attempt));

            console.log('✅ Quiz created and attempt started:', response, attemptResult);
            this.showVoiceStatus('success');
            this.speak(`Quiz created and ready. Starting your ${numQuestions} question quiz about ${topic}`);
            this.updateTranscript(`✓ Quiz created and attempt started`);
            
            setTimeout(() => {
                window.location.href = 'quiz.html';
            }, 1500);
        } catch (error) {
            console.error('❌ Quiz creation error:', error.message, error);
            this.showVoiceStatus('error');
            
            let errorMsg = error.message;
            if (errorMsg.includes('Network')) {
                errorMsg = 'Network error. Check console for details.';
            }
            
            this.speak(`Error: ${errorMsg}`);
            this.updateTranscript(`Error: ${errorMsg}`);
        }
    }
}


// Global instance
let voiceAIController = null;

// Create UI
function createVoiceControlUI() {
    if (document.getElementById('voice-control-container')) {
        return;
    }

    const container = document.createElement('div');
    container.id = 'voice-control-container';

    const panel = document.createElement('div');
    panel.className = 'voice-control-panel';

    const micBtn = document.createElement('button');
    micBtn.className = 'voice-mic-btn';
    micBtn.innerHTML = '🎤';
    micBtn.title = 'Voice Control - Say: "Create flashcard" or "Make a quiz about..."';
    micBtn.onclick = () => {
        if (voiceAIController) {
            voiceAIController.toggleVoiceControl();
        }
    };

    const info = document.createElement('div');
    info.className = 'voice-info';

    const badge = document.createElement('div');
    badge.className = 'voice-status-badge idle';
    badge.textContent = '🎤 Ready';

    const transcript = document.createElement('div');
    transcript.className = 'voice-transcript';
    transcript.textContent = 'Click mic to start speaking commands';

    info.appendChild(badge);
    info.appendChild(transcript);

    panel.appendChild(micBtn);
    panel.appendChild(info);
    container.appendChild(panel);

    document.body.appendChild(container);
}

// Initialize
function initVoiceAIController() {
    if (typeof apiCall !== 'function') {
        console.warn('apiCall not ready, deferring voice control init');
        return;
    }

    createVoiceControlUI();
    voiceAIController = new VoiceAIController();
    
    console.log('✅ Voice AI Controller initialized');
}

// Auto-initialize on dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (typeof apiCall === 'function') {
        initVoiceAIController();
    } else {
        const checkInterval = setInterval(() => {
            if (typeof apiCall === 'function') {
                clearInterval(checkInterval);
                initVoiceAIController();
            }
        }, 100);
        
        setTimeout(() => clearInterval(checkInterval), 5000);
    }
});

// Export for console testing
window.testVoiceCommand = function(command) {
    if (!voiceAIController) {
        console.error('Voice AI Controller not initialized');
        return;
    }
    console.log('Testing command:', command);
    voiceAIController.processVoiceCommand(command);
};
