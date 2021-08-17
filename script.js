// For drag and drop, try to use this library
// https://interactjs.io/
// https://github.com/SortableJS/Sortable

// =================================
// Global variables

let myStorage = window.localStorage;
let myStorageKey = 'todoList';
let list = [];
let filter = 'all';

// =================================
// add list button functionality

// ---------------------------------
// toggle completed state
function toggleComplete(currId) {
  list.forEach((curr) => {
    if (curr.id == currId) {
      curr.completed == true
        ? (curr.completed = false)
        : (curr.completed = true);
    }
  });

  save();
}

function addListEvent() {
  // =================================
  // check button functionality

  let btn = document.getElementsByClassName('list__item');

  // use spread operator and forEach to apply onclick event targeting this (current) element
  [...btn].forEach((curr) => {
    curr.onclick = function () {
      curr.children[0].classList.toggle('list__circle--active');
      curr.children[1].classList.toggle('list__desc--line-through');

      let listId = curr.children[1].id;
      toggleComplete(listId);
    };
  });

  // =================================
  // delete button functionality

  let del = document.getElementsByClassName('list__cross');

  [...del].forEach((curr) => {
    let listId = curr.previousElementSibling.id;
    curr.onclick = function () {
      list = list.filter((curr) => curr.id != listId);
      this.parentElement.remove();
      save();
    };
  });
}

// ===============================
// Remove current filter button

function removeFilterState() {
  let button = document.getElementsByClassName('filter__btn--dark')[0];
  if (button == null) {
    return;
  }
  button.classList.remove('filter__btn--dark');
}

// ===============================
// Current filter button

function currentFilter(filter) {
  if (filter == 'all') {
    removeFilterState();
    document.getElementById('all').classList.add('filter__btn--dark');
  }
  if (filter == 'active') {
    removeFilterState();
    document.getElementById('active').classList.add('filter__btn--dark');
  }
  if (filter == 'completed') {
    removeFilterState();
    document.getElementById('completed').classList.add('filter__btn--dark');
  }
}

// ===============================
// Added filter button event to change filter

(function filterEvent() {
  document.getElementById('all').addEventListener('click', () => {
    filter = 'all';
    renderList();
  });
  document.getElementById('active').addEventListener('click', () => {
    filter = 'active';
    renderList();
  });
  document.getElementById('completed').addEventListener('click', () => {
    filter = 'completed';
    renderList();
  });
})();

// ===============================
// Load list from local storage
function load() {
  // get JSON object that we store from local storage
  let myListStore = myStorage.getItem(myStorageKey);
  // turn it into normal object
  myListStore = JSON.parse(myListStore);

  if (myListStore == null) {
    list = [];
    return;
  } else if (filter == 'all') {
    list = myListStore;
  } else if (filter == 'active') {
    list = myListStore.filter((curr) => curr.completed == false);
  } else if (filter == 'completed') {
    list = myListStore.filter((curr) => curr.completed == true);
  }
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
    let currList = currTemplate.querySelector('.list__desc');
    currList.innerText = curr.name;
    // give it id to identify it during deletion process
    currList.id = curr.id;
    document
      .getElementsByClassName('list__container')[0]
      .appendChild(currTemplate);
  });

  // highlight filter button
  currentFilter(filter);

  // add event
  addListEvent();
}

// ===============================
// Save list to local storage

function save() {
  // we turn our list to JSON object
  let myListStore = JSON.stringify(list);
  // store the JSON object into local storage with its key
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
