// js/quiz-navigation.js
let currentQuestions = [];
let currentQuestionIndex = 0;
let currentBatchInfo = {
  chapterId: '',
  lessonId: '',
  batchId: ''
};

// Initialize quiz navigation
document.addEventListener("DOMContentLoaded", () => {
  // Add navigation controls to the question container
  const questionContainer = document.getElementById("question-container");
  if (questionContainer) {
    const navControls = document.createElement("div");
    navControls.className = "flex justify-between items-center mt-6";
    navControls.innerHTML = `
      <button id="prev-question" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50" disabled>
        ← Previous
      </button>
      <span id="question-counter" class="text-sm font-medium text-gray-600">
        Question 0 of 0
      </span>
      <button id="next-question" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50" disabled>
        Next →
      </button>
    `;
    questionContainer.appendChild(navControls);

    // Add event listeners for navigation
    document.getElementById("prev-question").addEventListener("click", goToPreviousQuestion);
    document.getElementById("next-question").addEventListener("click", goToNextQuestion);
  }
});

// Update the loadBatch function in mcqs.js to use this navigation
function setupQuizNavigation(questions, chapterId, lessonId, batchId) {
  currentQuestions = questions;
  currentQuestionIndex = 0;
  currentBatchInfo = { chapterId, lessonId, batchId };
  
  updateNavigationControls();
  displayCurrentQuestion();
}

function updateNavigationControls() {
  const prevButton = document.getElementById("prev-question");
  const nextButton = document.getElementById("next-question");
  const counter = document.getElementById("question-counter");

  if (currentQuestions.length > 0) {
    counter.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;
    
    // Enable/disable previous button
    prevButton.disabled = currentQuestionIndex === 0;
    
    // Enable/disable next button
    nextButton.disabled = currentQuestionIndex === currentQuestions.length - 1;
  } else {
    counter.textContent = "No questions available";
    prevButton.disabled = true;
    nextButton.disabled = true;
  }
}

function displayCurrentQuestion() {
  if (currentQuestions.length === 0) return;

  const question = currentQuestions[currentQuestionIndex];
  const questionText = document.getElementById("question-text");
  const optionsContainer = document.getElementById("options-container");

  // Display question
  questionText.textContent = question.question;
  optionsContainer.innerHTML = "";

  // Create options
  question.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "block w-full px-4 py-2 bg-blue-100 rounded hover:bg-blue-200 transition mb-2";

    btn.onclick = () => {
      // Highlight selected answer
      if (opt === question.answer) {
        btn.classList.remove("bg-blue-100", "hover:bg-blue-200");
        btn.classList.add("bg-green-300");
      } else {
        btn.classList.remove("bg-blue-100", "hover:bg-blue-200");
        btn.classList.add("bg-red-300");
        
        // Also highlight correct answer
        const correctBtn = [...optionsContainer.children].find(
          child => child.textContent === question.answer
        );
        if (correctBtn) {
          correctBtn.classList.remove("bg-blue-100", "hover:bg-blue-200");
          correctBtn.classList.add("bg-green-300");
        }
      }

      // Disable all options after selection
      const allOptions = optionsContainer.querySelectorAll("button");
      allOptions.forEach(option => {
        option.disabled = true;
      });

      // Enable next button if not last question
      if (currentQuestionIndex < currentQuestions.length - 1) {
        document.getElementById("next-question").disabled = false;
      }
    };

    optionsContainer.appendChild(btn);
  });

  updateNavigationControls();
}

function goToPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayCurrentQuestion();
  }
}

function goToNextQuestion() {
  if (currentQuestionIndex < currentQuestions.length - 1) {
    currentQuestionIndex++;
    displayCurrentQuestion();
  }
}

// Make these functions available to mcqs.js
window.quizNavigation = {
  setupQuizNavigation,
  displayCurrentQuestion
};