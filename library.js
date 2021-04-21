function Book(name, author, pages, is_read = false) {
  this.name = name;
  this.author = author;
  this.pages = pages;
  this.is_read = is_read;
}

let lastBookId = 1;

const sampleBook = new Book("The Hill We Climb: An Inaugural Poem for the Country", "Amanda Gorman", 32, false);

let library = [sampleBook];

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
  checkDuplicate(e.target.value);
});

// event listener for delete book
// event is created on parent element while book elements are created dynamically
// placing an event directly on dynamically created element does not run
// event delegation
const bookContainer = document.querySelector('main');
bookContainer.addEventListener('click', (e) => {
  removeBookFromLibrary(e);
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

  const emptyMessage = document.querySelector('.empty');
  emptyMessage.innerHTML = '';

  validation.empty && (emptyMessage.innerHTML = 'Fill all the fields please!');
}

function checkDuplicate(value) {
  validation.duplicate = library.some(book => book.name === value);

  const duplicateMessage = document.querySelector('.duplicate');
  duplicateMessage.innerHTML = '';

  validation.duplicate && (duplicateMessage.innerHTML = 'Book already exists!');
}

function clearFields(fields) {
  fields.forEach(field => {
    if (field.type === 'text') {
      field.value = '';
    } else field.checked = false;
  });
}

function removeBookFromLibrary(e) {
  if (e.target && e.target.className === 'book__delete') {
    const index = library.map(book => book.name).indexOf(e.target.parentElement.children[0].textContent);
    index > -1 && library.splice(index, 1);

    createBooksList();
  };
}

function markBookAsRead() {

}

function createBookLayout(name, author, pages, is_read, lastBookId) {
  const template = document.querySelector('.bookTemplate');

  const clone = template.content.cloneNode(true);
  const elements = clone.querySelectorAll('.book__content > *');

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

  return clone;
}

function createBooksList() {
  const main = document.querySelector('main');
  main.innerHTML = '';

  library.map((book) => {
    main.appendChild(createBookLayout(book.name, book.author, book.pages, book.is_read, lastBookId));
    lastBookId++;
  });

  const newBook = document.querySelector('details.new-book').cloneNode(true);
  newBook.classList.remove('new-book');
  main.appendChild(newBook);
}

