function Book(name, author, pages, is_read = false) {
  this.name = name;
  this.author = author;
  this.pages = pages;
  this.is_read = is_read;
}

let sampleBook = {
  name: "The Hill We Climb: An Inaugural Poem for the Country",
  author: "Amanda Gorman",
  pages: 32,
  is_read: false
}

let library = [sampleBook];

let validation = {
  empty: false,
  duplicate: false
};

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  addBookToLibrary();
});

const bookTitleInput = document.querySelector('.name');
bookTitleInput.addEventListener('input', (e) => {
  checkDuplicate(e.target.value);
});

function addBookToLibrary() {
  const bookTitle = document.querySelector('.name');
  const bookAuthor = document.querySelector('.author');
  const bookPages = document.querySelector('.pages');
  const bookIsRead = document.querySelector('.is-read');

  checkIsEmpty([bookTitle.value, bookAuthor.value, bookPages.value]);
  if (validation.empty || validation.duplicate) return;

  const newBook = new Book(bookTitle.value, bookAuthor.value, bookPages.value, bookIsRead.checked);
  library.push(newBook);

  clearFields([bookTitle, bookAuthor, bookPages, bookIsRead]);

  createBooksList();
}

function checkIsEmpty(values) {
  validation.empty = values.some(value => !value);

  const emptyMessage = document.querySelector('.details-modal-content .empty');
  emptyMessage.innerHTML = '';

  validation.empty && (emptyMessage.innerHTML ='Fill all the fields please!');
}

function checkDuplicate(value) {
  validation.duplicate = library.some(book => book.name === value);

  const duplicateMessage = document.querySelector('.details-modal-content .duplicate');
  duplicateMessage.innerHTML = '';

  validation.duplicate && (duplicateMessage.innerHTML = 'Book already exists!');
}

function clearFields(fields) {
  fields.forEach(field => {
    field.value = '';
  });
}

function removeBookFromLibrary() {

}

function markBookAsRead() {

}

function createBookLayout(name, author, pages, is_read) {
  const template = document.querySelector('.bookTemplate');

  const clone = template.content.cloneNode(true);
  const divs = clone.querySelectorAll('div');

  [...divs].map((div) => {
    div.className === "book__name" && (div.textContent = name);
    div.className === "book__author" && (div.textContent = author);
    div.className === "book__pages" && (div.textContent = pages);
    div.className === "book__read" && (div.textContent = is_read);
  });

  return clone;
}

function createBooksList() {
  const main = document.querySelector('main');
  main.innerHTML = '';

  const bookLayoutList = library.map((book) => {
    main.appendChild(createBookLayout(book.name, book.author, book.pages, book.is_read));
  });
}

createBooksList();