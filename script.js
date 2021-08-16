// For drag and drop, try to use this library
// https://interactjs.io/
// https://github.com/SortableJS/Sortable

// =================================
// Global variables

let myStorage = window.localStorage;
let myStorageKey = 'todoList';
let list = [];

// =================================
// add list button functionality

function addListEvent() {
  // =================================
  // check button functionality

  let btn = document.getElementsByClassName('list__item');

  // use spread operator and forEach to apply onclick event targeting this (current) element
  [...btn].forEach((curr) => {
    curr.onclick = function () {
      this.children[0].classList.toggle('list__circle--active');
      this.children[1].classList.toggle('list__desc--line-through');
    };
  });

  // =================================
  // delete button functionality

  let del = document.getElementsByClassName('list__cross');

  [...del].forEach((curr) => {
    curr.onclick = function () {
      this.parentElement.remove();
    };
  });
}

// ===============================
// Load list from local storage
function load() {
  let myListStore = myStorage.getItem(myStorageKey);
  myListStore = JSON.parse(myListStore);
  list = myListStore;
}

// ===============================
// render list functionality

let template = document.getElementsByTagName('template')[0];

function renderList() {
  // clear element inside list__container whenever we run renderList
  document.getElementsByClassName('list__container')[0].innerHTML = '';

  // load list from local storage
  load();

  list.forEach((curr) => {
    // .content copy the template element content and cloneNode clone the element
    let currTemplate = template.content.cloneNode(true);
    currTemplate.querySelector('.list__desc').innerText = curr.name;
    document
      .getElementsByClassName('list__container')[0]
      .appendChild(currTemplate);
  });
  // add event
  addListEvent();
}

// ===============================
// Save list to local storage

function save() {
  let myListStore = JSON.stringify(list);
  myStorage.setItem(myStorageKey, myListStore);
}

// ===============================
// Submit list functionality

let form = document.getElementsByClassName('form')[0];

form.addEventListener('submit', (event) => {
  event.preventDefault();

  let input = document.getElementsByClassName('form__input')[0];
  let currItem = {};

  currItem.id = Date.now().toString();
  currItem.name = input.value;
  currItem.completed = false;

  list.push(currItem);
  input.value = '';

  save();
  renderList();
});

// ===============================
// Initial render

renderList();
