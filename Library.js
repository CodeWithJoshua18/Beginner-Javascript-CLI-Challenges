const prompt = require("prompt-sync")({ sigint: true });

// =====Book class=====
class Book {
    constructor(title, author, id) {
        this.title = title;
        this.author = author;
        this.id = id;
        this.is_borrowed = false;
    }

    markAsBorrowed() {
        this.is_borrowed = true;
    }

    markAsReturned() {
        this.is_borrowed = false;
    }
}

// =====User Class=====
class User {
    constructor(name, user_id) {
        this.name = name;
        this.user_id = user_id;
        this.borrowedBooks = [];
    }

    borrowBook(book) {
        if (this.borrowedBooks.length >= 3) {
            console.log("❌ User has already borrowed 3 books.");
            return;
        }

        if (!book.is_borrowed) {
            book.markAsBorrowed();
            this.borrowedBooks.push(book);
            console.log(`✅ Book borrowed: ${book.title}`);
        } else {
            console.log(`❌ Book is already borrowed: ${book.title}`);
        }
    }

    returnBook(book) {
        const index = this.borrowedBooks.indexOf(book);
        if (index !== -1) {
            book.markAsReturned();
            this.borrowedBooks.splice(index, 1);
            console.log(`✅ Book returned: ${book.title}`);
        } else {
            console.log(`❌ You didn't borrow this book: ${book.title}`);
        }
    }

    listBorrowedBooks() {
        if (this.borrowedBooks.length === 0) {
            console.log("📚 No borrowed books.");
        } else {
            console.log("📘 Borrowed books:");
            this.borrowedBooks.forEach(book => {
                console.log(`- ${book.title} by ${book.author}`);
            });
        }
    }
}

// =====Library Class=====
class Library {
    constructor() {
        this.books = [];
        this.users = [];
    }

    addBook(title, author) {
        const id = this.books.length + 1;
        const book = new Book(title, author, id);
        this.books.push(book);
        console.log(`📖 Book added: ${title} by ${author}`);
    }

    addUser(name) {
        const user_id = this.users.length + 1;
        const user = new User(name, user_id);
        this.users.push(user);
        console.log(`👤 User added: ${name}`);
    }

    findBookById(id) {
        return this.books.find(book => book.id == id);
    }

    findUserById(id) {
        return this.users.find(user => user.user_id == id);
    }

    showAvailableBooks() {
        const available = this.books.filter(book => !book.is_borrowed);
        if (available.length === 0) {
            console.log("📕 No available books.");
        } else {
            console.log("📚 Available books:");
            available.forEach(book => {
                console.log(`${book.id}. ${book.title} by ${book.author}`);
            });
        }
    }
}

// =====Main Program=====
const library = new Library();

while (true) {
    console.log("\n=== 📚 Library Management System ===");
    console.log("1. Add book");
    console.log("2. Add user");
    console.log("3. Borrow book");
    console.log("4. Return book");
    console.log("5. List borrowed books");
    console.log("6. Show available books");
    console.log("7. Exit");

    const choice = prompt("Choose an option (1-7): ");

    switch (choice) {
        case "1": // Add book
            const title = prompt("Enter book title: ");
            const author = prompt("Enter book author: ");
            library.addBook(title, author);
            break;

        case "2": // Add user
            const userName = prompt("Enter user name: ");
            library.addUser(userName);
            break;

        case "3": // Borrow book
            const borrowUserId = prompt("Enter your user ID: ");
            const borrowBookId = prompt("Enter book ID to borrow: ");
            const borrower = library.findUserById(borrowUserId);
            const bookToBorrow = library.findBookById(borrowBookId);
            if (borrower && bookToBorrow) {
                borrower.borrowBook(bookToBorrow);
            } else {
                console.log("❌ Invalid user ID or book ID.");
            }
            break;

        case "4": // Return book
            const returnUserId = prompt("Enter your user ID: ");
            const returnBookId = prompt("Enter book ID to return: ");
            const returner = library.findUserById(returnUserId);
            const bookToReturn = library.findBookById(returnBookId);
            if (returner && bookToReturn) {
                returner.returnBook(bookToReturn);
            } else {
                console.log("❌ Invalid user ID or book ID.");
            }
            break;

        case "5": // List borrowed books
            const viewUserId = prompt("Enter your user ID: ");
            const user = library.findUserById(viewUserId);
            if (user) {
                user.listBorrowedBooks();
            } else {
                console.log("❌ User not found.");
            }
            break;

        case "6": // Show available books
            library.showAvailableBooks();
            break;

        case "7":
            console.log("👋 Exiting... Thanks for visiting the library!");
            process.exit(0);

        default:
            console.log("❗ Invalid option.");
    }
}
