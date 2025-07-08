// main.js

let chaptersData = [];

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

  document.getElementById("chapter-select").value = chapterId;
  populateTopicDropdown(chapterId, topicName);
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
      const container = document.getElementById("lesson-content");
      container.innerHTML = `<h3 class='text-lg font-semibold mb-2'>${data.title}</h3>` +
                            `<ul class='mb-2 list-disc pl-6'>${data.objectives.map(obj => `<li>${obj}</li>`).join('')}</ul>` +
                            `<div>${data.content}</div>`;
    })
    .catch(() => {
      document.getElementById("lesson-content").innerHTML =
        `<p class='text-red-600'>Lesson content could not be loaded.</p>`;
    });
}

// Back Button
document.getElementById("back-button").addEventListener("click", () => {
  document.getElementById("lesson-section").classList.add("hidden");
  document.getElementById("roadmap-section").classList.remove("hidden");
});
