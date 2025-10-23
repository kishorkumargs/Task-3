const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;
const { v4: uuidv4 } = require('uuid');


app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());

let books = [
    { id: uuidv4(), title: 'Atomic habits', author: 'James Clear' },
    { id: uuidv4(), title: 'The Alchemist', author: 'Paulo Coelho' },
    { id: uuidv4(), title: 'The Power of Habit', author: 'Charles Duhigg' }
];

// Get all books
app.get('/books', async (req, res) => {
    res.json(books);
});

// Add a new book
app.post('/books', (req, res) => {
    if (!req.body.title || !req.body.author) {
        return res.status(400).json({ error: 'Title and author are required' });
    }
    const newBook = {
        id: uuidv4(),
        title: req.body.title,
        author: req.body.author
    }; 
    books.push(newBook);
    console.log(`Book added: ${newBook.title} by ${newBook.author}`);
    res.status(201).json(newBook);
});

// Update a book
app.put('/books/:id', (req, res) => {
    const bookId = req.params.id; // UUID (string)
    const { title, author } = req.body; // Extract directly from body

    const book = books.find(b => b.id === bookId);

    if (!book) {
        console.log(`Book with id ${bookId} not found`);
        return res.status(404).json({ error: 'Book not found' });
    }

    // Update fields 
    book.title = title || book.title;
    book.author = author || book.author;

    console.log(`Book updated: ${book.title} by ${book.author}`);
    res.json(book);
});

// Delete a book
app.delete('/books/:id', (req, res) => {
    const bookId = req.params.id; // ✅ treat as string
    const beforeCount = books.length;
    books = books.filter(b => b.id !== bookId);

    if (books.length === beforeCount) {
        return res.status(404).json({ error: 'Book not found' });
    }

    console.log(`Book with id ${bookId} deleted`);
    res.status(204).send();
});

// Serve the HTML file
app.get('/', (req, res) => {    
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});