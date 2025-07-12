// main.js

let chaptersData = [];
let currentLessonData = null;

// Load chapters.json
fetch('json/chapters.json')
  .then(response => response.json())
  .then(data => {
    chaptersData = data;
    renderRoadmap(data);
    populateChapterDropdown(data);
  });

function renderRoadmap(chapters) {
  const roadmap = document.getElementById("roadmap");
  roadmap.innerHTML = "";

  chapters.forEach(chapter => {
    const div = document.createElement("div");
    div.className = "bg-white rounded-xl shadow p-4";

    const btn = document.createElement("button");
    btn.textContent = chapter.title;
    btn.className = "w-full text-left font-semibold text-blue-700";

    const ul = document.createElement("ul");
    ul.className = "mt-2 space-y-1 text-sm";

    chapter.topics.forEach(topic => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.textContent = topic;
      a.href = "#";
      a.className = "text-blue-600 hover:underline";
      a.onclick = () => showLessonSection(chapter.id, topic);
      li.appendChild(a);
      ul.appendChild(li);
    });

    div.appendChild(btn);
    div.appendChild(ul);
    roadmap.appendChild(div);
  });
}

function showLessonSection(chapterId, topicName) {
  document.getElementById("roadmap-section").classList.add("hidden");
  document.getElementById("lesson-section").classList.remove("hidden");
  loadLesson(chapterId, topicName);
}

function populateChapterDropdown(chapters) {
  const chapterSelect = document.getElementById("chapter-select");
  chapterSelect.innerHTML = "";

  chapters.forEach(chap => {
    const option = document.createElement("option");
    option.value = chap.id;
    option.textContent = chap.title;
    chapterSelect.appendChild(option);
  });

  chapterSelect.addEventListener("change", e => {
    populateTopicDropdown(parseInt(e.target.value));
  });
}

function populateTopicDropdown(chapterId, selected = null) {
  const topicSelect = document.getElementById("topic-select");
  topicSelect.innerHTML = "";

  const chapter = chaptersData.find(c => c.id === parseInt(chapterId));
  chapter.topics.forEach(topic => {
    const option = document.createElement("option");
    option.value = topic;
    option.textContent = topic;
    topicSelect.appendChild(option);
  });

  if (selected) topicSelect.value = selected;
  topicSelect.addEventListener("change", e => {
    loadLesson(chapterId, e.target.value);
  });
}

function loadLesson(chapterId, topicName) {
  const lessonPath = `json/chapters/${chapterId}/${topicName}.json`;
  fetch(lessonPath)
    .then(res => res.json())
    .then(data => {
      currentLessonData = data;
      renderLessonContent(data);
    })
    .catch(() => {
      document.getElementById("lesson-content").innerHTML =
        `<p class='text-red-600'>Lesson content could not be loaded.</p>`;
    });
}

function renderLessonContent(lessonData) {
  const container = document.getElementById("lesson-content");
  container.innerHTML = '';

  // Create lesson header
  const header = document.createElement('div');
  header.className = 'mb-6';
  header.innerHTML = `
    <h2 class="text-2xl font-bold text-blue-800 mb-2">${lessonData.title}</h2>
    <div class="bg-blue-50 p-4 rounded-lg">
      <h3 class="font-semibold mb-2">Learning Objectives:</h3>
      <ul class="list-disc pl-6">${lessonData.objectives.map(obj => `<li>${obj}</li>`).join('')}</ul>
    </div>
  `;
  container.appendChild(header);

  // Create section navigation
  const sectionNav = document.createElement('div');
  sectionNav.className = 'flex mb-6 border-b border-gray-200';

  // Create content area
  const contentArea = document.createElement('div');
  contentArea.className = 'lesson-section-content bg-white p-6 rounded-b-lg shadow';

  // Check if lesson has sections or is in old format
  if (lessonData.sections) {
    // New format with sections
    Object.keys(lessonData.sections).forEach((sectionKey, index) => {
      const section = lessonData.sections[sectionKey];
      
      // Create nav button
      const navButton = document.createElement('button');
      navButton.textContent = section.title;
      navButton.className = 'px-4 py-2 font-medium text-gray-600 hover:text-blue-700 focus:outline-none';
      navButton.dataset.section = sectionKey;
      
      // Set first section as active by default
      if (index === 0) {
        navButton.classList.add('text-blue-700', 'border-b-2', 'border-blue-700');
        contentArea.innerHTML = section.content;
      }
      
      navButton.addEventListener('click', () => {
        // Update active tab
        sectionNav.querySelectorAll('button').forEach(btn => {
          btn.classList.remove('text-blue-700', 'border-b-2', 'border-blue-700');
        });
        navButton.classList.add('text-blue-700', 'border-b-2', 'border-blue-700');
        
        // Update content
        contentArea.innerHTML = lessonData.sections[sectionKey].content;
      });
      
      sectionNav.appendChild(navButton);
    });
  } else {
    // Old format - single content
    contentArea.innerHTML = lessonData.content || '<p>No content available for this lesson.</p>';
  }

  container.appendChild(sectionNav);
  container.appendChild(contentArea);
}

// Back Button
document.getElementById("back-button").addEventListener("click", () => {
  document.getElementById("lesson-section").classList.add("hidden");
  document.getElementById("roadmap-section").classList.remove("hidden");
});