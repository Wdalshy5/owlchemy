$(document).ready(function () {
  let currentQuestions = [];
  let currentIndex = 0;
  let isLoading = false;
  let selectedAnswers = {};

  // Load mcqs.json metadata
  $.getJSON("json/mcqs.json", function (data) {
    const $chapterSelect = $("#mcq-chapter-select");
    const $lessonSelect = $("#mcq-lesson-select");
    const $batchSelect = $("#mcq-batch-select");

    // Populate chapter dropdown
    $chapterSelect.empty().append('<option disabled selected>Select Chapter</option>');
    for (let chapter in data.chapters) {
      $chapterSelect.append(
        $("<option>").val(chapter).text(data.chapters[chapter].title)
      );
    }

    // Chapter selection → populate lessons
    $chapterSelect.on("change", function () {
      const selectedChapter = $(this).val();
      const lessons = data.chapters[selectedChapter].lessons;
      $lessonSelect.empty().append('<option disabled selected>Select Lesson</option>');
      $lessonSelect.prop("disabled", false);
      $batchSelect.empty().append('<option disabled selected>Select Batch</option>');
      $batchSelect.prop("disabled", true);

      for (let lesson in lessons) {
        $lessonSelect.append(
          $("<option>").val(lesson).text(lessons[lesson].title)
        );
      }
    });

    // Lesson selection → populate batches
    $lessonSelect.on("change", function () {
      const selectedChapter = $chapterSelect.val();
      const selectedLesson = $(this).val();
      const batches = data.chapters[selectedChapter].lessons[selectedLesson].batches;
      $batchSelect.empty().append('<option disabled selected>Select Batch</option>');
      $batchSelect.prop("disabled", false);

      batches.forEach((batch) => {
        $batchSelect.append($("<option>").val(batch).text(batch));
      });
    });

    // Load MCQs from batch file
    $batchSelect.on("change", function () {
      const chapter = $chapterSelect.val();
      const lesson = $lessonSelect.val();
      const batch = $(this).val();
      
      if (!chapter || !lesson || !batch) return;
      
      isLoading = true;
      selectedAnswers = {};
      $("#question-container").addClass("hidden");
      $("#loading-spinner").removeClass("hidden");

      $.getJSON(`json/mcqs-chapters/${chapter}/${lesson}/${batch}.json`)
        .done(function (questionsData) {
          currentQuestions = Array.isArray(questionsData) ? questionsData : [];
          currentIndex = 0;
          if (currentQuestions.length > 0) {
            renderQuestion();
            $("#question-container").removeClass("hidden");
          } else {
            showError("No questions found in this batch");
          }
        })
        .fail(function (jqxhr, textStatus, error) {
          showError(`Failed to load questions: ${error}`);
          console.error("Error loading questions:", textStatus, error);
        })
        .always(function() {
          isLoading = false;
          $("#loading-spinner").addClass("hidden");
        });
    });

    // Navigation buttons
    $("#next-question").on("click", function () {
      if (!isLoading && currentQuestions.length > 0 && currentIndex < currentQuestions.length - 1) {
        saveCurrentAnswer();
        currentIndex++;
        renderQuestion();
      }
    });

    $("#prev-question").on("click", function () {
      if (!isLoading && currentQuestions.length > 0 && currentIndex > 0) {
        saveCurrentAnswer();
        currentIndex--;
        renderQuestion();
      }
    });

    function saveCurrentAnswer() {
      const selectedOption = $("input[name='current-question']:checked").val();
      if (selectedOption !== undefined) {
        selectedAnswers[currentIndex] = selectedOption;
      }
    }

    function renderQuestion() {
      if (!currentQuestions || currentQuestions.length === 0) {
        $("#question-text").html("<em>No questions available</em>");
        $("#options-container").empty();
        return;
      }

      const question = currentQuestions[currentIndex];
      $("#question-text").html(`<strong>${currentIndex + 1}.</strong> ${question.question}`);
      
      const $optionsContainer = $("#options-container").empty();
      
      question.options.forEach((option, index) => {
        const isChecked = selectedAnswers[currentIndex] === option;
        const $option = $(`
          <div class="option flex items-center mb-2 p-2 rounded hover:bg-gray-50">
            <input type="radio" name="current-question" id="opt-${currentIndex}-${index}" 
                   value="${option}" ${isChecked ? 'checked' : ''} class="mr-2">
            <label for="opt-${currentIndex}-${index}" class="cursor-pointer">${option}</label>
          </div>
        `);
        
        $optionsContainer.append($option);
      });

      // Check answer when option is selected
      $("input[name='current-question']").on("change", function() {
        const selectedValue = $(this).val();
        const isCorrect = selectedValue === question.answer;
        
        $(this).closest(".option")
          .removeClass("bg-red-100 bg-green-100 border-red-400 border-green-400")
          .addClass(isCorrect ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400");
        
        if (isCorrect) {
          $(this).next("label").append(` <span class="text-green-600">✓ Correct</span>`);
        } else {
          $(this).next("label").append(` <span class="text-red-600">✗ Correct answer: ${question.answer}</span>`);
        }
      });

      $("#question-counter").text(`Question ${currentIndex + 1} of ${currentQuestions.length}`);
      $("input[name='current-question']").prop("disabled", false);
    }

    function showError(message) {
      const $error = $("#mcq-error");
      $error.html(`<strong>Error:</strong> ${message}`).removeClass("hidden");
      setTimeout(() => $error.addClass("hidden"), 5000);
    }
  }).fail(function(jqxhr, textStatus, error) {
    showError("Failed to load MCQ structure. Please try again later.");
    console.error("Error loading MCQ metadata:", textStatus, error);
  });
});

// Global function to load MCQs
window.loadLessonMCQs = function(chapterSlug, lessonSlug, batchNumber) {
  try {
    // Scroll to section
    document.getElementById("mcqs-section").scrollIntoView({ behavior: 'smooth' });
    
    // Set dropdowns
    $("#mcq-chapter-select").val(chapterSlug).trigger('change');
    
    setTimeout(() => {
      if ($("#mcq-lesson-select option[value='" + lessonSlug + "']").length) {
        $("#mcq-lesson-select").val(lessonSlug).trigger('change');
        
        setTimeout(() => {
          const batchValue = "batch" + batchNumber;
          if ($("#mcq-batch-select option[value='" + batchValue + "']").length) {
            $("#mcq-batch-select").val(batchValue).trigger('change');
          } else {
            showError("Question batch not found");
          }
        }, 300);
      } else {
        showError("Lesson not found in MCQs");
      }
    }, 300);
  } catch (err) {
    console.error("Error in loadLessonMCQs:", err);
    showError("Failed to load questions");
  }
};