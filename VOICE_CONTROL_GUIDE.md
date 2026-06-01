# Voice Control & Flashcard Editor Features

## Overview
This document describes the new voice control system with AI integration and the flashcard editor interface for managing quizzes.

## 🎤 Voice Control System

### Features
- **Voice-Activated Commands**: Click the microphone button to activate voice recognition
- **Multiple Command Types**:
  - Create quizzes: "Make a 10 question quiz about [topic]"
  - Create flashcards: "Create flashcard question [Q] answer [A]"
  - Edit flashcards: "Edit flashcard"
  - Delete flashcards: "Delete flashcard"
  - Show flashcards: "Show my flashcards"

### How It Works

1. **Start Listening**: Click the 🎤 microphone button in the navbar or the floating voice panel
2. **Speak Command**: Say your command clearly
3. **AI Processing**: The system processes your voice input
4. **Confirmation**: Audio confirmation of what was understood
5. **Action**: The appropriate action is taken

### Voice Button Locations

**Navbar Voice Button** (Main Control):
- Located in the top navigation bar
- Click to start/stop listening
- Shows current status and transcribed text

**Floating Voice Panel** (Fallback):
- Fixed position in bottom-right corner
- Shows microphone button with status badge
- Displays real-time transcript

### Status Indicators

- 🎤 **Ready**: Waiting for voice input
- 🎧 **Listening**: Actively recording audio
- ⚙️ **Processing**: Analyzing voice command
- ✓ **Success**: Command executed successfully
- ✗ **Error**: Something went wrong

### Browser Compatibility

The voice control system requires:
- Chrome 25+, Firefox 25+, Safari 14.1+, Edge 79+
- **Microphone Permission**: Must be granted when prompted
- **Internet Connection**: Required for speech recognition API

### Troubleshooting

**"Microphone permission denied"**
- Check browser permissions for the microphone
- Reload the page and grant permission

**"No speech detected"**
- Ensure microphone is not muted
- Speak louder or closer to microphone
- Check microphone hardware

**"Network error"**
- Verify internet connection is stable
- Check browser console for detailed errors

---

## 📚 Flashcard Editor

### Features
- **View All Flashcards**: See complete list of flashcards in a quiz
- **Edit Flashcards**: Modify question, answer, and options
- **Add Flashcards**: Create new flashcards directly
- **Delete Flashcards**: Remove unwanted flashcards
- **Statistics**: Track total number of cards in quiz

### How to Access

1. **From Dashboard**:
   - Click the ✏️ **Edit** button on any quiz card
   - Opens the flashcard editor for that quiz

2. **Via Voice Command**:
   - Say "Edit flashcard"
   - Automatically redirects to editor

### Editor Interface

#### Existing Flashcards Section
Displays all current flashcards with:
- **Question**: The prompt or question
- **Answer**: The correct answer
- **Options**: Multiple choice options (comma-separated)
- **Correct Option**: Which option number is correct (1-4)

**Actions**:
- 💾 **Save**: Update the flashcard
- 🗑️ **Delete**: Remove the flashcard

#### Add New Flashcard Section
Create new flashcards with:
- **Question/Prompt**: Main question text
- **Answer**: Correct answer
- **Options**: 2-4 possible answers (comma-separated)
- **Correct Option**: Which option is correct

**Example**:
```
Question: What is the capital of France?
Answer: Paris
Options: London, Paris, Berlin, Madrid
Correct Option: 2 (Paris is option 2)
```

### Flashcard Format

Each flashcard requires:
1. **Question**: The prompt or question
2. **Answer**: The correct response
3. **Options**: Multiple choice answers separated by commas
4. **Correct Index**: Which option number (1-4) is correct

### Tips

- Use clear, concise questions and answers
- Provide 3-4 options for multiple choice
- Ensure only one correct option
- Use commas to separate options
- Edit regularly to keep content fresh

### Navigation

- **Back Button**: Returns to dashboard (top right)
- **Dashboard Link**: Quick return from navbar
- **Stats Bar**: Shows quiz title and total cards

---

## 🔄 Workflow Examples

### Create a Quiz with Voice
```
1. Click microphone in navbar
2. Say: "Make a 10 question quiz about photosynthesis"
3. AI generates quiz
4. Quiz starts automatically
```

### Edit Flashcards Manually
```
1. Go to Dashboard
2. Find quiz card
3. Click ✏️ Edit button
4. Modify existing cards
5. Add new cards as needed
6. All changes auto-save
```

### Create & Edit Workflow
```
1. Create quiz with voice or text
2. Review generated flashcards
3. Click Edit to fine-tune content
4. Add missing concepts
5. Remove duplicates
6. Save and study
```

---

## 📁 File Structure

### New Files Added

**Frontend (Client-Side)**:
- `static/voice-control.js` - Voice recognition and AI command processing
- `static/edit-flashcards.html` - Flashcard editor UI
- `static/edit-flashcards.js` - Flashcard editor logic

**Styles**:
- `static/style.css` - Updated with new button and voice UI styles

### Modified Files

- `static/dashboard.html` - Added voice control script tag
- `static/dashboard.js` - Added edit button and navigation logic
- `static/voice-control.js` - Complete rewrite for AI integration

---

## 🔧 Technical Details

### Voice Recognition API
Uses Web Speech API:
- `SpeechRecognition` - Converts audio to text
- `SpeechSynthesis` - Text-to-speech for confirmations
- Language: English (US) by default

### Speech Recognition Setup
```javascript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
recognition.continuous = false;
recognition.interimResults = true;
recognition.language = 'en-US';
```

### AI Command Processing
Voice commands are parsed to extract:
- **Intent**: Create quiz, edit, delete, etc.
- **Topic**: Subject matter for quiz
- **Quantity**: Number of questions
- **Details**: Question/answer content

### API Endpoints Used

**Quiz Management**:
- `POST /api/quiz/create-from-topic` - Create quiz via voice
- `GET /api/quiz/{id}` - Get quiz details
- `GET /api/quiz/{id}/questions` - Get all flashcards

**Flashcard Management**:
- `POST /api/quiz/{id}/question` - Add new flashcard
- `PUT /api/quiz/question/{id}` - Update flashcard
- `DELETE /api/quiz/question/{id}` - Delete flashcard

---

## 🎨 Styling

### Voice Control Colors
- Primary: Purple (#7e22ce)
- Light: Lighter Purple (#a855f7)
- Secondary: Light Purple (#e9d5ff)

### Button Styles
- **Voice Btn**: Purple gradient background, white text
- **Edit Btn**: Yellow/amber for distinction
- **Delete Btn**: Red for danger action

### Animations
- Status badge: Blinking for listening
- Spinner: Rotating for processing
- Slide-in: Notification animations

---

## 📝 Voice Command Reference

### Quiz Commands
| Command | Example | Result |
|---------|---------|--------|
| Create Quiz | "Make a 10 question quiz about biology" | Generates and starts quiz |
| Create Quiz | "Create a 5 question quiz on history" | Generates quiz with 5 questions |

### Flashcard Commands
| Command | Example | Result |
|---------|---------|--------|
| Create Card | "Create flashcard question what is DNA answer deoxyribonucleic acid" | Adds new card |
| Edit Cards | "Edit flashcard" | Redirects to editor |
| Delete Card | "Delete flashcard" | Shows deletion interface |
| Show Cards | "Show my flashcards" | Displays all cards |

---

## ⚙️ Configuration

### Voice Language
To change voice language, edit `voice-control.js`:
```javascript
this.recognition.language = 'es-ES'; // Spanish
this.recognition.language = 'fr-FR'; // French
this.recognition.language = 'de-DE'; // German
```

### Voice Settings
```javascript
utterance.rate = 1;      // Speed (0.1 - 10)
utterance.pitch = 1;     // Pitch (0 - 2)
utterance.volume = 1;    // Volume (0 - 1)
```

---

## 🐛 Known Limitations

1. **Web Speech API**: Not all browsers fully support it
2. **Microphone Required**: Must have working microphone
3. **Language**: Currently English only (configurable)
4. **Network**: Requires internet for speech recognition
5. **Privacy**: Audio sent to browser's speech recognition service

---

## 🔐 Privacy & Security

- Voice data is processed by browser speech recognition API
- Microphone permission required and requested by browser
- All data is encrypted in transit
- Commands are parsed client-side when possible
- No voice recordings are stored on server

---

## 📞 Support

For issues or questions:
1. Check browser console for error messages
2. Verify microphone is working
3. Test in a different browser
4. Check internet connection
5. Review troubleshooting section above

