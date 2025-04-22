const prompt = require("prompt-sync")({ sigint: true });

//  character sets
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const symbols = "!@#$%^&*()_+[]{}|;:,.<>?/";

//  character pool: Include everything by default
const characterPool = lowercase + uppercase + numbers + symbols;

// Step 1: Ask user for password length
const length = parseInt(prompt("Enter password length: "));

// Step 2: Generate the password
let password = "";
for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characterPool.length);
    password += characterPool[randomIndex];
}

// Step 3: Output the password
console.log(`\n🔐 Generated Password: ${password}`);
