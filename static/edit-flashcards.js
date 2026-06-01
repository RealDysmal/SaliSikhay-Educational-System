/**
 * Edit Flashcards Manager
 * Handles creating, updating, and deleting flashcards
 */

let currentQuizId = null;
let currentQuizTitle = '';
let currentFlashcards = [];
let currentUser = null;

// Initialize
async function initEditFlashcards() {
    checkAuth();
    
    // Get user info
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            currentUser = JSON.parse(userStr);
        } catch (e) {
            currentUser = { username: 'User' };
        }
    }

    // Update welcome message
    const welcomeMsg = document.getElementById('welcome-message');
    if (welcomeMsg && currentUser && currentUser.username) {
        welcomeMsg.textContent = `Welcome, ${currentUser.username}!`;
    }

    // Setup event listeners
    document.getElementById('back-btn').addEventListener('click', goBackToDashboard);
    document.getElementById('back-to-dashboard').addEventListener('click', goBackToDashboard);
    document.getElementById('add-flashcard-form').addEventListener('submit', handleAddFlashcard);

    // Get quiz ID from URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    currentQuizId = urlParams.get('quiz_id') || localStorage.getItem('editing_quiz_id');

    if (!currentQuizId) {
        showNotification('No quiz selected for editing', 'error');
        setTimeout(() => goBackToDashboard(), 2000);
        return;
    }

    // Load quiz details and flashcards
    await loadQuizDetails();
    await loadFlashcards();
}

// Load quiz details
async function loadQuizDetails() {
    try {
        const result = await apiCall(`/quiz/${currentQuizId}`);
        
        if (result.quiz) {
            currentQuizTitle = result.quiz.title || 'Quiz';
            document.getElementById('quiz-title').textContent = currentQuizTitle;
        }
    } catch (error) {
        console.error('Error loading quiz details:', error);
    }
}

// Load flashcards
async function loadFlashcards() {
    try {
        const result = await apiCall(`/quiz/${currentQuizId}/questions`);
        
        if (result.questions && Array.isArray(result.questions)) {
            currentFlashcards = result.questions;
            renderFlashcards();
            updateStats();
        } else {
            showEmptyState();
        }
    } catch (error) {
        console.error('Error loading flashcards:', error);
        showNotification('Failed to load flashcards', 'error');
    }
}

// Render flashcards
function renderFlashcards() {
    const container = document.getElementById('flashcards-container');
    
    if (currentFlashcards.length === 0) {
        showEmptyState();
        return;
    }

    container.innerHTML = '';

    currentFlashcards.forEach((card, index) => {
        const cardElement = createFlashcardElement(card, index);
        container.appendChild(cardElement);
    });
}

// Create flashcard element
function createFlashcardElement(card, index) {
    const div = document.createElement('div');
    div.className = 'flashcard-item';
    div.id = `card-${card.id}`;

    // Parse options and find correct answer
    let options = [];
    let correctAnswer = '';
    
    try {
        if (card.options) {
            options = typeof card.options === 'string' ? card.options.split(',').map(o => o.trim()) : card.options;
        }
        if (card.correct_answer_index !== undefined) {
            correctAnswer = options[card.correct_answer_index] || card.correct_answer || '';
        } else {
            correctAnswer = card.correct_answer || '';
        }
    } catch (e) {
        console.error('Error parsing card:', e);
    }

    div.innerHTML = `
        <div class="flashcard-content">
            <div class="card-field">
                <label>Question</label>
                <textarea class="edit-question" data-card-id="${card.id}">${card.question || ''}</textarea>
            </div>
            
            <div class="card-field">
                <label>Answer</label>
                <textarea class="edit-answer" data-card-id="${card.id}">${correctAnswer || ''}</textarea>
            </div>

            <div class="card-field">
                <label>Options (comma-separated)</label>
                <textarea class="edit-options" data-card-id="${card.id}">${options.join(', ') || ''}</textarea>
            </div>

            <div class="card-field">
                <label>Correct Option #</label>
                <input type="number" class="edit-correct-option" data-card-id="${card.id}" min="1" max="4" value="${(card.correct_answer_index || 0) + 1}" />
            </div>
        </div>

        <div class="card-actions">
            <button class="action-btn save-btn" onclick="updateFlashcard(${card.id}, this)">
                💾 Save
            </button>
            <button class="action-btn delete-btn" onclick="deleteFlashcard(${card.id}, this)">
                🗑️ Delete
            </button>
        </div>
    `;

    return div;
}

// Show empty state
function showEmptyState() {
    const container = document.getElementById('flashcards-container');
    container.innerHTML = `
        <div class="empty-state">
            <p style="font-size: 24px;">📭</p>
            <p>No flashcards yet</p>
            <p style="font-size: 14px; color: #a855f7;">Add your first flashcard below to get started!</p>
        </div>
    `;
}

// Update flashcard
async function updateFlashcard(cardId, button) {
    const cardDiv = document.getElementById(`card-${cardId}`);
    if (!cardDiv) return;

    const question = cardDiv.querySelector('.edit-question').value.trim();
    const answer = cardDiv.querySelector('.edit-answer').value.trim();
    const optionsText = cardDiv.querySelector('.edit-options').value.trim();
    const correctOptionIndex = parseInt(cardDiv.querySelector('.edit-correct-option').value) - 1;

    if (!question || !answer || !optionsText) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    const options = optionsText.split(',').map(o => o.trim()).filter(o => o);
    if (options.length < 2) {
        showNotification('Please provide at least 2 options', 'error');
        return;
    }

    if (correctOptionIndex < 0 || correctOptionIndex >= options.length) {
        showNotification('Correct option must be between 1 and ' + options.length, 'error');
        return;
    }

    button.disabled = true;
    button.textContent = '⏳ Saving...';

    try {
        const result = await apiCall(`/quiz/question/${cardId}`, 'PUT', {
            question: question,
            correct_answer: answer,
            options: options,
            correct_answer_index: correctOptionIndex
        });

        if (result.success || result.question) {
            showNotification('✓ Flashcard updated successfully!', 'success');
            await loadFlashcards();
        } else {
            showNotification(result.error || 'Failed to update flashcard', 'error');
        }
    } catch (error) {
        console.error('Error updating flashcard:', error);
        showNotification('Error: ' + error.message, 'error');
    } finally {
        button.disabled = false;
        button.textContent = '💾 Save';
    }
}

// Delete flashcard
async function deleteFlashcard(cardId, button) {
    if (!confirm('Are you sure you want to delete this flashcard?')) {
        return;
    }

    button.disabled = true;
    button.textContent = '⏳ Deleting...';

    try {
        const result = await apiCall(`/quiz/question/${cardId}`, 'DELETE');

        if (result.success || result.message) {
            showNotification('✓ Flashcard deleted!', 'success');
            await loadFlashcards();
        } else {
            showNotification(result.error || 'Failed to delete flashcard', 'error');
        }
    } catch (error) {
        console.error('Error deleting flashcard:', error);
        showNotification('Error: ' + error.message, 'error');
    } finally {
        button.disabled = false;
        button.textContent = '🗑️ Delete';
    }
}

// Handle add flashcard
async function handleAddFlashcard(e) {
    e.preventDefault();

    const question = document.getElementById('new-question').value.trim();
    const answer = document.getElementById('new-answer').value.trim();
    const optionsText = document.getElementById('new-options').value.trim();
    const correctOptionIndex = parseInt(document.getElementById('new-correct-option').value) - 1;

    if (!question || !answer || !optionsText) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    const options = optionsText.split(',').map(o => o.trim()).filter(o => o);
    if (options.length < 2) {
        showNotification('Please provide at least 2 options', 'error');
        return;
    }

    if (correctOptionIndex < 0 || correctOptionIndex >= options.length) {
        showNotification('Correct option must be between 1 and ' + options.length, 'error');
        return;
    }

    const submitBtn = document.querySelector('#add-flashcard-form button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Adding...';

    try {
        const result = await apiCall(`/quiz/${currentQuizId}/question`, 'POST', {
            question: question,
            correct_answer: answer,
            options: options,
            correct_answer_index: correctOptionIndex
        });

        if (result.question || result.success) {
            showNotification('✓ Flashcard added successfully!', 'success');
            document.getElementById('add-flashcard-form').reset();
            await loadFlashcards();
        } else {
            showNotification(result.error || 'Failed to add flashcard', 'error');
        }
    } catch (error) {
        console.error('Error adding flashcard:', error);
        showNotification('Error: ' + error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '✨ Add Flashcard';
    }
}

// Update stats
function updateStats() {
    document.getElementById('total-cards').textContent = currentFlashcards.length;
}

// Go back to dashboard
function goBackToDashboard() {
    localStorage.removeItem('editing_quiz_id');
    window.location.href = '/static/dashboard.html';
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initEditFlashcards);
