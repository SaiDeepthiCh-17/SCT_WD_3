
// Quiz data with different question types
        const quizData = [{
                type: 'multiple-choice',
                question: 'Which HTML tag is used to create a hyperlink?',
                options: ['<link>', '<a>', '<href>', '<url>'],
                correct: [1],
                explanation: 'The <a> tag is used to create hyperlinks in HTML.'
            },
            {
                type: 'fill-blank',
                question: 'Complete the CSS property: "___-family" is used to specify the font of text.',
                correct: ['font'],
                explanation: 'The font-family property specifies the font for an element.'
            },
            {
                type: 'multi-select',
                question: 'Which of the following are valid CSS display values?',
                options: ['block', 'inline', 'flex', 'solid'],
                correct: [0, 1, 2],
                explanation: 'block, inline, and flex are valid CSS display values. "solid" is a border style.'
            },
            {
                type: 'multiple-choice',
                question: 'What does DOM stand for in JavaScript?',
                options: ['Document Object Model', 'Data Object Management', 'Dynamic Object Method', 'Digital Object Model'],
                correct: [0],
                explanation: 'DOM stands for Document Object Model.'
            },
            {
                type: 'fill-blank',
                question: 'In JavaScript, ___ is used to declare a variable that cannot be reassigned.',
                correct: ['const'],
                explanation: 'The const keyword declares a variable that cannot be reassigned.'
            },
            {
                type: 'multiple-choice',
                question: 'Which CSS property is used to change the background color?',
                options: ['color', 'background-color', 'bg-color', 'background'],
                correct: [1],
                explanation: 'The background-color property sets the background color of an element.'
            },
            {
                type: 'multi-select',
                question: 'Which of these are JavaScript data types?',
                options: ['string', 'boolean', 'integer', 'undefined'],
                correct: [0, 1, 3],
                explanation: 'string, boolean, and undefined are JavaScript data types. JavaScript uses "number" not "integer".'
            },
            {
                type: 'multiple-choice',
                question: 'What is the correct HTML tag for the largest heading?',
                options: ['<h6>', '<h1>', '<heading>', '<head>'],
                correct: [1],
                explanation: '<h1> is the largest heading tag in HTML.'
            },
            {
                type: 'fill-blank',
                question: 'The CSS property ___-content is used in flexbox to align items along the main axis.',
                correct: ['justify'],
                explanation: 'justify-content aligns flex items along the main axis.'
            },
            {
                type: 'multiple-choice',
                question: 'Which method is used to add an element to the end of an array in JavaScript?',
                options: ['push()', 'add()', 'append()', 'insert()'],
                correct: [0],
                explanation: 'The push() method adds elements to the end of an array.'
            }
        ];

        let currentQuestionIndex = 0;
        let userAnswers = [];
        let score = 0;

        function startQuiz() {
            document.getElementById('welcome-screen').classList.add('hidden');
            document.getElementById('quiz-screen').classList.remove('hidden');

            // Initialize user answers array
            userAnswers = new Array(quizData.length).fill(null);

            loadQuestion();
        }

        function loadQuestion() {
            const question = quizData[currentQuestionIndex];
            const questionText = document.getElementById('question-text');
            const optionsContainer = document.getElementById('options-container');
            const questionType = document.getElementById('question-type');
            const currentQuestionSpan = document.getElementById('current-question');
            const progressFill = document.getElementById('progress-fill');

            // Update question counter and progress
            currentQuestionSpan.textContent = currentQuestionIndex + 1;
            const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
            progressFill.style.width = progress + '%';

            // Update question type display
            questionType.textContent = question.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
            questionType.className = 'question-type ' + question.type;

            // Set question text
            questionText.textContent = question.question;

            // Clear previous options
            optionsContainer.innerHTML = '';

            if (question.type === 'fill-blank') {
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'fill-blank-input';
                input.placeholder = 'Type your answer here...';
                input.value = userAnswers[currentQuestionIndex] || '';
                input.addEventListener('input', (e) => {
                    userAnswers[currentQuestionIndex] = e.target.value.trim().toLowerCase();
                });
                optionsContainer.appendChild(input);
            } else {
                question.options.forEach((option, index) => {
                    const optionDiv = document.createElement('div');
                    optionDiv.className = 'option';

                    const input = document.createElement('input');
                    input.type = question.type === 'multi-select' ? 'checkbox' : 'radio';
                    input.name = 'question';
                    input.value = index;
                    input.id = `option-${index}`;
                    input.style.marginRight = '10px';

                    // Restore previous answer
                    if (userAnswers[currentQuestionIndex]) {
                        if (question.type === 'multi-select') {
                            input.checked = userAnswers[currentQuestionIndex].includes(index);
                        } else {
                            input.checked = userAnswers[currentQuestionIndex][0] === index;
                        }
                        if (input.checked) {
                            optionDiv.classList.add('selected');
                        }
                    }

                    const label = document.createElement('label');
                    label.htmlFor = `option-${index}`;
                    label.textContent = option;

                    optionDiv.appendChild(input);
                    optionDiv.appendChild(label);

                    optionDiv.addEventListener('click', () => {
                        if (question.type === 'multi-select') {
                            input.checked = !input.checked;
                            optionDiv.classList.toggle('selected');

                            // Update user answers for multi-select
                            if (!userAnswers[currentQuestionIndex]) {
                                userAnswers[currentQuestionIndex] = [];
                            }
                            if (input.checked) {
                                userAnswers[currentQuestionIndex].push(index);
                            } else {
                                userAnswers[currentQuestionIndex] = userAnswers[currentQuestionIndex].filter(i => i !== index);
                            }
                        } else {
                            // Single select - clear other selections
                            document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
                            document.querySelectorAll('input[name="question"]').forEach(inp => inp.checked = false);

                            input.checked = true;
                            optionDiv.classList.add('selected');
                            userAnswers[currentQuestionIndex] = [index];
                        }
                    });

                    optionsContainer.appendChild(optionDiv);
                });
            }

            // Update navigation buttons
            document.getElementById('prev-btn').disabled = currentQuestionIndex === 0;
            document.getElementById('next-btn').textContent = currentQuestionIndex === quizData.length - 1 ? 'Finish Quiz' : 'Next';
        }

        function nextQuestion() {
            if (currentQuestionIndex < quizData.length - 1) {
                currentQuestionIndex++;
                loadQuestion();
            } else {
                finishQuiz();
            }
        }

        function previousQuestion() {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                loadQuestion();
            }
        }

        function finishQuiz() {
            calculateScore();
            showResults();
            createConfetti();
        }

        function calculateScore() {
            score = 0;
            userAnswers.forEach((answer, index) => {
                const question = quizData[index];
                if (question.type === 'fill-blank') {
                    if (answer && question.correct.some(correct => correct.toLowerCase() === answer.toLowerCase())) {
                        score++;
                    }
                } else if (question.type === 'multi-select') {
                    if (answer && answer.length === question.correct.length &&
                        answer.every(ans => question.correct.includes(ans))) {
                        score++;
                    }
                } else {
                    if (answer && answer[0] === question.correct[0]) {
                        score++;
                    }
                }
            });
        }

        function showResults() {
            document.getElementById('quiz-screen').classList.add('hidden');
            document.getElementById('results-screen').classList.remove('hidden');

            const percentage = Math.round((score / quizData.length) * 100);
            document.getElementById('final-score').textContent = percentage + '%';
            document.getElementById('correct-count').textContent = score;
            document.getElementById('incorrect-count').textContent = quizData.length - score;
            document.getElementById('total-count').textContent = quizData.length;
        }

        function createConfetti() {
            const colors = ['#f56565', '#48bb78', '#ed8936', '#667eea', '#9f7aea'];
            const confettiCount = 50;

            for (let i = 0; i < confettiCount; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + 'vw';
                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
                    document.body.appendChild(confetti);

                    setTimeout(() => {
                        confetti.remove();
                    }, 5000);
                }, i * 100);
            }
        }

        function restartQuiz() {
            currentQuestionIndex = 0;
            userAnswers = [];
            score = 0;

            document.getElementById('results-screen').classList.add('hidden');
            document.getElementById('welcome-screen').classList.remove('hidden');
        }