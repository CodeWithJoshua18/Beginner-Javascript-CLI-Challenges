const prompt = require('prompt-sync')({ sigint: true });

// === Bank Account Class
class BankAcccount{
    constructor(holderName, accountNumber, password) {
        this.holderName = holderName;
        this.accountNumber = accountNumber;
        this.password = password;
        this.balance = 0;
    }

    deposit(amount) {
        if (amount <= 0) {
            console.log("Invalid deposit amount");
            return;
        }
        this.balance += amount;
        console.log(`Deposited: $${amount}. New balance: $${this.balance}`);
    }

    withdraw(amount) {
        if (amount <= 0) {
            console.log("Invalid withdrawal amount");
            return;
        } else if (amount > this.balance) {
            console.log("Insufficient funds");
            return;
        } else {
            this.balance -= amount;
            console.log(`Withdrawn: $${amount}. New balance: $${this.balance}`);
        }
    }

    transfer(targetAccount, amount) {
        if (amount <= 0) {
            console.log("Invalid transfer amount");
            return;
        } else if (amount > this.balance) {
            console.log("Insufficient funds");
            return;
        } else {
            this.balance -= amount;
            targetAccount.balance += amount;
            console.log(`Transferred: $${amount} to account ${targetAccount.accountNumber}. New balance: $${this.balance}`);
        }
    }

    checkBalance() {
        console.log(`Current balance: $${this.balance}`);
    }

    aunthenticste(password) {
        if (password === this.password) {
            console.log("Authentication successful");
            return true;
        }
        console.log("Authentication failed");
    }
}

// ========== Account Storage========
const accounts = new Map();

function findAccount() {
    const accountNumber = prompt("Enter your account number:");
    const password = prompt("Enter your password:");
    const account = accounts.get(accountNumber);

    if (!account || !account.aunthenticste(password)) {
        console.log("Account not found or authentication failed.");
        return null;
    }
    return account;
}

// ========== Main Menu ==========

while (true) {
    console.log("\n Welcome To LogicVault Bank! \n");
    console.log("1. Create Account");
    console.log("2. Deposit");
    console.log("3. Withdraw");
    console.log("4. Transfer");
    console.log("5. Check Balance");
    console.log("6. Exit");

    const choice = prompt("Choose an option (1 - 6): ");

    switch (choice) {
        case "1": // Create Account
            const name = prompt("Enter your name: ");
            const accountNumber = prompt("Enter your account number: ");
            const password = prompt("Enter your password: ");
            if (accounts.has(accountNumber)) {
                console.log("Account number already exists.");
            } else {
                accounts.set(accountNumber, new BankAcccount(name, accountNumber, password));
                console.log("Account created successfully.");
            }
            break;

        case "2": // Deposit
            const depositAccount = findAccount();
            if (depositAccount) {
                const depositAmount = parseFloat(prompt("Enter amount to deposit: "));
                depositAccount.deposit(depositAmount);
            }
            break;

        case "3": // Withdraw
            const withdrawAccount = findAccount();
            if (withdrawAccount) {
                const withdrawAmount = parseFloat(prompt("Enter amount to withdraw: "));
                withdrawAccount.withdraw(withdrawAmount);
            }
            break;

        case "4": // Transfer
            const senderAccount = findAccount();
            if (senderAccount) {
                const targetAccountNumber = prompt("Enter target account number: ");
                const targetAccount = accounts.get(targetAccountNumber);
                if (!targetAccount) {
                    console.log("Target account not found.");
                } else {
                    const transferAmount = parseFloat(prompt("Enter amount to transfer: "));
                    senderAccount.transfer(targetAccount, transferAmount);
                }
            }
            break;

        case "5": // Check Balance
            const balanceAccount = findAccount();
            if (balanceAccount) {
                balanceAccount.checkBalance();
            }
            break;

        case "6": // Exit
            console.log("Thank you for using LogicVault Bank. Goodbye!");
            process.exit(0);

        default:
            console.log("Invalid choice. Please select a valid option.");
    }
}