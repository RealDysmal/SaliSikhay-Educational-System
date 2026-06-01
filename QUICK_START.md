# Quick Start Guide: Voice Control & Flashcard Editor

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Microphone connected and enabled
- Internet connection
- Logged in to SaliSikhayAI

---

## 🎤 Using Voice Control

### Step 1: Access Voice Control
1. Go to Dashboard
2. Look for **🎤 Voice Command** button in top navbar
3. Or use the floating mic button in bottom-right corner

### Step 2: Activate Microphone
1. Click the microphone button
2. Grant microphone permission when prompted
3. Button should show "🎧 Listening..." status

### Step 3: Speak Your Command
Say one of these commands clearly:

**For Quiz Creation**:
- "Make a 10 question quiz about Python"
- "Create a 5 question quiz on history"
- "Generate quiz about photosynthesis"

**For Flashcard Management**:
- "Edit flashcard"
- "Create flashcard"
- "Show my flashcards"

### Step 4: Confirm Action
- System will repeat what it understood
- Quiz will be created or interface will open
- Follow on-screen instructions

---

## 📚 Using Flashcard Editor

### Access the Editor

**Method 1: From Dashboard**
1. Find a quiz card
2. Click ✏️ **Edit** button
3. Editor opens with all flashcards

**Method 2: Via Voice**
1. Say "Edit flashcard"
2. Automatically redirected to editor

### Editing Flashcards

#### View Existing Cards
- All flashcards shown in list
- Each card displays: Question, Answer, Options

#### Modify a Card
1. Click on any field (Question, Answer, Options, etc.)
2. Update the text
3. Click 💾 **Save** to update
4. Notification confirms save

#### Delete a Card
1. Find the card you want to remove
2. Click 🗑️ **Delete**
3. Confirm deletion in popup
4. Card is removed

#### Add New Card
1. Scroll to "Add New Flashcard" section
2. Fill in all fields:
   - **Question**: Main question text
   - **Answer**: Correct answer
   - **Options**: Separate by commas (e.g., "A, B, C, D")
   - **Correct Option**: Number 1-4
3. Click ✨ **Add Flashcard**
4. New card added to list

### Example: Adding a New Flashcard

```
Question: What is photosynthesis?
Answer: The process by which plants convert light into chemical energy
Options: Respiration, Photosynthesis, Fermentation, Decomposition
Correct Option: 2
```

---

## ✨ Tips & Tricks

### Voice Control Tips
- Speak clearly and in English
- Use natural language (not robotic)
- Be specific about number of questions
- Say "about" before topic: "Quiz about biology"
- Listen to confirmations

### Flashcard Tips
- Keep questions concise but clear
- Provide 2-4 multiple choice options
- Make only one answer correct
- Use consistent formatting
- Review answers for accuracy
- Edit before sharing with others

### Workflow Tips
1. **Create via voice**, then edit manually
2. **Fix generated content** in editor
3. **Add missing concepts** as new flashcards
4. **Remove duplicates** to keep quiz focused

---

## 🆘 Troubleshooting

### Voice Not Working

**Microphone button doesn't appear?**
- Refresh the page
- Check browser console for errors
- Ensure you're logged in

**"Microphone permission denied"?**
- Go to browser settings
- Allow microphone for this site
- Reload the page

**"No speech detected"?**
- Check microphone is not muted
- Speak louder/clearer
- Get microphone closer
- Ensure no background noise

**"Network error"?**
- Check internet connection
- Try refreshing page
- Try different browser
- Check browser console

### Flashcard Editor Issues

**Can't edit cards?**
- Ensure all fields are filled
- Check for special characters
- Try refreshing page
- Check internet connection

**Cards not saving?**
- Check you're logged in
- Look for error notifications
- Check internet connection
- Try saving again

**Can't load flashcards?**
- Ensure quiz exists
- Check you have permission
- Refresh page
- Check browser console

---

## 🎯 Common Tasks

### Task: Create and Edit a Quiz

1. **Create Quiz via Voice**
   ```
   Click 🎤 → Say "Make a 10 question quiz about Python"
   ```

2. **Review Generated Content**
   - Quiz automatically starts
   - Take quiz to see questions

3. **Edit Questions**
   - Back to dashboard
   - Click ✏️ Edit on the quiz
   - Modify any flashcards

4. **Add Missing Content**
   - Scroll to "Add New Flashcard"
   - Fill in new questions
   - Click Add

### Task: Fix Generated Answers

1. Find quiz on dashboard
2. Click ✏️ Edit
3. Find incorrect card
4. Click in Answer field
5. Edit the answer
6. Click 💾 Save
7. Notification confirms update

### Task: Delete Quiz

1. Find quiz card
2. Click 🗑️ button
3. Confirm deletion
4. Quiz removed from dashboard

---

## 📊 Understanding the Interface

### Dashboard
```
┌─ Navbar ──────────────────┐
│ Logo  [🎤 Voice] [Logout] │
└────────────────────────────┘

┌─ Quiz Generator ──────────┐
│ Input Topic              │
│ Select # Questions       │
│ [Generate Quiz]          │
└────────────────────────────┘

┌─ Quiz Card ───────────────┐
│ 🤖 AI | Quiz Title        │
│ 📊 10 Questions           │
│ Date Created              │
│                           │
│ [Start] [✏️ Edit] [🗑️]    │
└────────────────────────────┘
```

### Flashcard Editor
```
┌─ Header ──────────────┐
│ Edit Flashcards [←]   │
└───────────────────────┘

┌─ Stats ───────────────┐
│ Total Cards: 10       │
│ Quiz: Python Basics   │
└───────────────────────┘

┌─ Existing Cards ──────┐
│ [Card 1] [💾] [🗑️]    │
│ [Card 2] [💾] [🗑️]    │
│ ...                   │
└───────────────────────┘

┌─ Add New Card ────────┐
│ Question: ________    │
│ Answer: __________    │
│ Options: __________   │
│ [✨ Add]              │
└───────────────────────┘
```

---

## ✅ What's Included

### Voice Control Features
- ✅ Speech recognition
- ✅ Audio feedback
- ✅ Command parsing
- ✅ Error handling
- ✅ Real-time status

### Flashcard Editor Features
- ✅ View all cards
- ✅ Edit questions/answers
- ✅ Add new cards
- ✅ Delete cards
- ✅ Save confirmation
- ✅ Form validation

### Integration Features
- ✅ Dashboard integration
- ✅ Voice-to-editor redirect
- ✅ Authentication
- ✅ Real-time updates
- ✅ Error notifications

---

## 🔐 Security Notes

- Your microphone input is only used for speech recognition
- Data is encrypted in transit
- Authentication required for all features
- Commands are verified before execution
- No voice data is stored

---

## 📞 Need Help?

1. **Check the documentation**: `VOICE_CONTROL_GUIDE.md`
2. **Review implementation notes**: `IMPLEMENTATION_NOTES.md`
3. **Check browser console**: Press F12 for details
4. **Try troubleshooting section** above

---

## 🎉 You're Ready!

Start using voice control and the flashcard editor to create and manage your quizzes more efficiently!

**Happy Learning! 📖**

