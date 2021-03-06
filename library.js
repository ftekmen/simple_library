function Book(name, author, pages, is_read = false) {
  this.name = name;
  this.author = author;
  this.pages = pages;
  this.is_read = is_read;
}

let lastBookId = 1;

const sampleBook1 = new Book("The Hill We Climb: An Inaugural Poem for the Country", "Amanda Gorman", 32, true);
const sampleBook2 = new Book("Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones", "James Clear", 320, false);
const sampleBook3 = new Book("The Good Sister: A Novel", "Sally Hepworth", 313, false);


let library = localStorage.getItem('library') ? JSON.parse(localStorage.getItem('library')) : [sampleBook1, sampleBook2, sampleBook3];

const validation = {
  empty: false,
  duplicate: false
};

createBooksList();

// event listener for form submit
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  addBookToLibrary();
});

// event listener for instant book title check
const bookTitleInput = document.querySelector('.name');
bookTitleInput.addEventListener('input', (e) => {
  validate('duplicate', e.target.value);
});

// event listener for delete book
// event is created on parent element while book elements are created dynamically
// placing an event directly on dynamically created element does not run
// event delegation
const bookContainer = document.querySelector('main');
bookContainer.addEventListener('click', (e) => {
  if (e.target && e.target.className === 'book__delete') {
    removeBookFromLibrary(e);
  } else if (e.target && e.target.className === 'readCbx') {
    markBookAsRead(e);
  }
});

function addBookToLibrary() {
  const bookTitle = document.querySelector('.name');
  const bookAuthor = document.querySelector('.author');
  const bookPages = document.querySelector('.pages');
  const bookIsRead = document.querySelector('.readCbx');

  validate('empty', [bookTitle.value, bookAuthor.value, bookPages.value]);
  if (validation.empty || validation.duplicate) return;

  const newBook = new Book(bookTitle.value, bookAuthor.value, bookPages.value, bookIsRead.checked);
  library.push(newBook);
  localStorage.setItem('library', JSON.stringify(library));

  clearFields([bookTitle, bookAuthor, bookPages, bookIsRead]);

  createBooksList();
}

function validate(type, data) {
  const message = document.querySelector(`.${type}`);
  message.innerHTML = '';

  if (type === 'duplicate') {
    validation.duplicate = library.some(book => book.name === data);
    validation.duplicate && (message.innerHTML = 'Book already exists!');
  } else if (type === 'empty') {
    validation.empty = data.some(value => !value);
    validation.empty && (message.innerHTML = 'Fill all the fields please!');
  }
}

function clearFields(fields) {
  fields.forEach(field => {
    if (field.type === 'text' || field.type === 'number') {
      field.value = '';
    } else field.checked = false;
  });
}

function removeBookFromLibrary(e) {
  const index = library.map(book => book.name).indexOf(e.target.parentElement.children[0].textContent);
  index > -1 && library.splice(index, 1);
  localStorage.setItem('library', JSON.stringify(library));

  createBooksList();
}

function markBookAsRead(e) {
  const index = library.map(book => book.name).indexOf(e.target.closest('.book').querySelector('.book__name').textContent);
  index > -1 && (library[index].is_read = e.target.closest('.book').querySelector('.readCbx').checked);
  localStorage.setItem('library', JSON.stringify(library));
}

function createBookLayout(name, author, pages, is_read, lastBookId) {
  const bookTemplate = document.querySelector('.bookTemplate');

  const book = bookTemplate.content.cloneNode(true);
  const elements = book.querySelectorAll('.book__content > *');

  [...elements].map((element) => {
    element.className === "book__name" && (element.textContent = name);
    element.className === "book__author" && (element.firstChild.textContent = author);
    element.className === "book__pages" && (element.textContent = pages + ' pages');

    if (element.className === "book__read") {
      let input = element.querySelector('input');
      input.setAttribute('id', `readCbx${lastBookId}`);
      element.querySelector('label').setAttribute('for', `readCbx${lastBookId}`);
      input.checked = is_read;
    }
  });

  return book;
}

function createBooksList() {
  const main = document.querySelector('main');
  main.innerHTML = '';

  console.log(!localStorage.getItem('library'));
  !localStorage.getItem('library') && localStorage.setItem('library', JSON.stringify(library));
  const localStorageLibrary = JSON.parse(localStorage.getItem('library'));

  localStorageLibrary.map((book) => {
    main.appendChild(createBookLayout(book.name, book.author, book.pages, book.is_read, lastBookId));
    lastBookId++;
  });
}

