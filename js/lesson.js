document.addEventListener('DOMContentLoaded', function() {
  // Enzyme Database
  const enzymeData = {
    'salivary-amylase': {
      name: 'Salivary α-amylase',
      details: 'Initiates starch digestion in mouth (pH 6.6-7.0). Inactivated by stomach acid.',
      inhibitors: 'Acidic pH < 4.0'
    },
    'hexokinase': {
      name: 'Hexokinase',
      details: 'Phosphorylates glucose in step 1 of glycolysis. Inhibited by G6P.',
      tissues: 'All tissues (except liver/pancreas)'
    },
    'pfk1': {
      name: 'Phosphofructokinase-1 (PFK-1)',
      details: 'Rate-limiting step. Activated by F2,6-BP; inhibited by ATP/citrate.',
      clinical: 'Deficiency causes Tarui disease (GSD VII)'
    }
    // Add more enzymes as needed
  };

  // Clinical Conditions Database
  const clinicalData = {
    'lactose-intolerance': {
      name: 'Lactose Intolerance',
      symptoms: 'Bloating, diarrhea 30min-2hr after dairy',
      management: 'Lactase supplements, dairy avoidance'
    },
    'hemolytic-anemia': {
      name: 'Pyruvate Kinase Deficiency',
      labs: '↑ Bilirubin, ↓ haptoglobin, spherocytes on smear',
      treatment: 'Folate, possible splenectomy'
    }
  };

  // 1. Enzyme Tooltips
  document.querySelectorAll('.enzyme-tag').forEach(tag => {
    tag.addEventListener('click', function() {
      const enzymeId = this.dataset.enzyme;
      const enzyme = enzymeData[enzymeId];
      
      const tooltip = document.createElement('div');
      tooltip.className = 'enzyme-tooltip';
      tooltip.innerHTML = `
        <h4>${enzyme.name}</h4>
        <p>${enzyme.details}</p>
        ${enzyme.inhibitors ? `<p><strong>Inhibitors:</strong> ${enzyme.inhibitors}</p>` : ''}
        ${enzyme.tissues ? `<p><strong>Tissues:</strong> ${enzyme.tissues}</p>` : ''}
        ${enzyme.clinical ? `<p class="clinical-note">${enzyme.clinical}</p>` : ''}
      `;
      
      document.body.appendChild(tooltip);
      positionTooltip(this, tooltip);
      
      setTimeout(() => {
        tooltip.classList.add('fade-out');
        tooltip.addEventListener('transitionend', () => tooltip.remove());
      }, 3000);
    });
  });

  // 2. Quiz System
  document.querySelectorAll('.quiz-option').forEach(option => {
    option.addEventListener('click', function() {
      const quizBox = this.closest('.interactive-quiz');
      const feedback = quizBox.querySelector('.quiz-feedback');
      
      // Reset all options
      quizBox.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('correct', 'incorrect');
      });
      
      // Validate answer
      if (this.dataset.correct === 'true') {
        this.classList.add('correct');
        feedback.textContent = 'Correct! ' + getQuizFeedback(quizBox.dataset.quiz);
        feedback.style.color = '#38a169';
      } else {
        this.classList.add('incorrect');
        feedback.textContent = 'Incorrect. ' + getQuizFeedback(quizBox.dataset.quiz);
        feedback.style.color = '#e53e3e';
      }
      
      feedback.classList.remove('hidden');
    });
  });

  // 3. Clinical Case Toggles
  document.querySelectorAll('.case-button').forEach(button => {
    button.addEventListener('click', function() {
      const caseDetails = this.nextElementSibling;
      caseDetails.classList.toggle('hidden');
      this.textContent = caseDetails.classList.contains('hidden') ? 
        'Reveal Diagnosis' : 'Hide Diagnosis';
    });
  });

  // 4. ATP Calculator
  document.querySelector('.calc-button').addEventListener('click', function() {
    const isAerobic = document.querySelector('input[name="conditions"]:checked').value === 'aerobic';
    const resultDiv = document.querySelector('.calc-result');
    
    resultDiv.innerHTML = isAerobic ? 
      '<strong>7 ATP</strong> (2 substrate-level + 5 from NADH oxidation)' :
      '<strong>2 ATP</strong> (substrate-level only, NADH recycled to lactate)';
    
    resultDiv.classList.remove('hidden');
  });

  // Helper Functions
  function positionTooltip(element, tooltip) {
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + window.scrollX}px`;
    tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
  }

  function getQuizFeedback(quizId) {
    const feedbacks = {
      'absorption-mechanisms': 'SGLT-1 is the sodium-glucose symporter in intestinal epithelium.',
      // Add more quiz feedback as needed
    };
    return feedbacks[quizId] || 'Review the related pathway.';
  }
});