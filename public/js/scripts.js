const bookList = document.getElementById('bookList');
const bookForm = document.getElementById('addBookForm');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');

let editMode = false;
let editBookId = null;

// Load all books on page load
async function loadBooks() {
    const res = await fetch('/books');
    const books = await res.json();
    renderBooks(books);
}

// Display books in the list
function renderBooks(books) {
    bookList.innerHTML = '';
    books.forEach(book => {
        const li = document.createElement('li');
        li.classList.add('book-item');
        li.innerHTML = `
            <span><strong>${book.title}</strong> by ${book.author}</span>
            <div class="actions">
                <button class="edit" onclick="editBook('${book.id}', '${book.title}', '${book.author}')">Edit</button>
                <button onclick="deleteBook('${book.id}')">Delete</button>
            </div>
        `;
        bookList.appendChild(li);
    });
}

// Add or Update a book
bookForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const author = authorInput.value.trim();

    if (!title || !author) return alert('Please fill out both fields.');

    if (editMode) {
        await fetch(`/books/${editBookId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author })
        });
        editMode = false;
        editBookId = null;
    } else {
        await fetch('/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author })
        });
    }

    bookForm.reset();
    loadBooks();
});

// Edit a book
async function editBook(id, title, author) {
    titleInput.value = title;
    authorInput.value = author;
    editMode = true;
    editBookId = id;
    bookForm.querySelector('button[type="submit"]').textContent = 'Update Book';
    await fetch(`/books/${id}`, { method: 'PUT' });
}

// Delete a book
async function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) return;

    await fetch(`/books/${id}`, { method: 'DELETE' });
    loadBooks();
}

// Initial load
loadBooks();