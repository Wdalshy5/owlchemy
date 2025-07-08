function toggleSubtopics(id) {
  const element = document.getElementById(id);
  element.classList.toggle('hidden');
}

document.addEventListener("DOMContentLoaded", () => {
  const roadmap = document.getElementById("roadmap");
  const chapters = [
    {
      id: "chapter1",
      title: "1. Molecular Biology Basics",
      topics: ["DNA & RNA Structure", "DNA Replication", "Transcription & Translation"]
    },
    {
      id: "chapter2",
      title: "2. Proteins & Enzymes",
      topics: ["Amino Acid Structure", "Protein Folding", "Enzyme Kinetics"]
    },
    {
      id: "chapter3",
      title: "3. Bioenergetics & Metabolism",
      topics: ["ATP & Energy", "Carbohydrate Metabolism", "Lipid Metabolism", "Amino Acid Metabolism"]
    },
    {
      id: "chapter4",
      title: "4. Cell Signaling & Hormones",
      topics: ["Signal Transduction Pathways", "Hormonal Regulation"]
    },
    {
      id: "chapter5",
      title: "5. Nutrition & Clinical Biochemistry",
      topics: ["Vitamins & Cofactors", "Biochemical Deficiencies", "Inborn Errors of Metabolism"]
    }
  ];

  roadmap.innerHTML = chapters.map(chap => `
    <div class="bg-white rounded-xl shadow p-4">
      <button class="w-full text-left font-semibold text-blue-700" onclick="toggleSubtopics('${chap.id}')">${chap.title}</button>
      <ul id="${chap.id}" class="mt-2 hidden space-y-1 text-sm">
        ${chap.topics.map(t => `<li><a href="#" class="text-blue-600 hover:underline">${t}</a></li>`).join('')}
      </ul>
    </div>
  `).join('');
});
