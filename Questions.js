const prompt = require('prompt-sync')();
import { readFileSync, existsSync, writeFileSync } from 'fs';

//  Load questions
function loadQuestions() {
    try {
        const dat = readFileSync('Questions.json', 'utf8');
        const questions = JSON.parse(data);
    } catch (e) {
        console.error('Error reading file:', e);
        return [];
    }
}

// Get random questions
function getRandomQuestions() {
    if (numQuestions > questions.length) {
        numQuestions = questions.length;
    }
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numQuestions);
}

// save score to file
function saveScore(username, score, total, percentage) {
    const record = {
        username,
        score,
        total,
        percentage,
        time: new Date().toISOString()
    };

    const filePath = 'scores.json';
    let scores = [];

    // Check if the file exists and read it
    if (existsSync(filePath)) {
        try {
            const data = readFileSync(filePath, 'utf8');
            scores = JSON.parse(data);
        } catch (e) {
            console.error('Error reading file:', e);
        }
    }

    // Add new score to the array
    scores.push(record);
    writeFileSync(filePath, JSON.stringify(scores, null, 2));
    console.log("Score saved to 'scores.json'");
}

// show leaderboard
function showLeaderBoard(limit = 5) {
    const filePath = 'scores.json';

    if (!existsSync(filepath)) {
        console.log("\nNo scores available yet.");
        return;
    }

    const data = readFileSync(filePath, 'utf8');
    let scores;
    try { 
        scores = JSON.parse(data);
    } catch (e) {
        console.log("Error reading leaderboard:", e);
        return;
    }

    // sort scores by percentage
    scores.sort((a, b) => b.percentage - a.percentage);

    console.log("\nLeaderboard:");
    console.log("--------------------------------------------------");
    console.log("Rank | Name  | Score | %");
    console.log("--------------------------------------------------");

    scores.slice(0, limit).forEach((entry, index) => {
        console.log(
            `${index + 1}`.padEnd(5) + " | " +
            `${entry.username}`.padEnd(10) + " | " +
            `${entry.score}/${entry.total}`.padEnd(6) + " | " +
            `${entry.percentage}%`
        );
    });

    console.log("----------------------------------\n");
}


// Main quiz function
const takeQuiz = () => {
    const username = prompt("Enter your name: ");

    const startQuiz = prompt("Do you want to attempt the quiz? (yes/no): ").toLowerCase();
    if (startQuiz === 'no' || startQuiz === 'n') {
        console.log("Exiting the quiz. Goodbye!");
        return;
    } else if (startQuiz !== 'yes' && startQuiz !== 'y') {
        console.log("Invalid input. Exiting.");
        return;
    }

    const questions = loadQuestions();

    if (questions.length === 0) {
        console.log("No questions available.");
        return;
    }

    const numQuestions = parseInt(prompt(`How many questions would you like to attempt? (1-${questions.length}): `));
    if (isNaN(numQuestions) || numQuestions < 1) {
        console.log("Invalid number. Exiting.");
        return;
    }

    const randomQuestions = getRandomQuestions(questions, numQuestions);
    console.log("\nStarting the quiz... You have 15 seconds per question.\n");

    let score = 0;

    for (const question of randomQuestions) {
        console.log(`\n${question.question}`);
        question.options.forEach((option, index) => {
            console.log(`${index + 1}. ${option}`);
        });

        const startTime = Date.now();
        const answer = prompt("Your answer (enter the option number): ");
        const elapsed = (Date.now() - startTime) / 1000;

        if (elapsed > 15) {
            console.log("⏰ Time's up! No answer recorded.");
            console.log(`Correct answer was: ${question.correctAnswer}`);
            continue;
        }

        const selectedOption = question.options[parseInt(answer) - 1];
        if (selectedOption === question.correctAnswer) {
            score++;
            console.log("✅ Correct!");
        } else {
            console.log(`❌ Wrong! The correct answer is: ${question.correctAnswer}`);
        }
    }

    const percentage = ((score / randomQuestions.length) * 100).toFixed(2);
    console.log(`\n🎯 ${username}, your final score is ${score}/${randomQuestions.length} (${percentage}%)`);

    saveScore(username, score, randomQuestions.length, percentage);

    // Ask if user wants to view leaderboard
    const seeLeaderboard = prompt("Would you like to view the leaderboard? (yes/no): ").toLowerCase();
    if (seeLeaderboard === 'yes' || seeLeaderboard === 'y') {
        showLeaderboard();
    } else {
        console.log("Thanks for playing! 👋");
    }
};

takeQuiz();
