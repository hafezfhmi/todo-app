// For drag and drop, try to use this library
// https://interactjs.io/
// https://github.com/SortableJS/Sortable

// =================================
// Global variables

let myStorage = window.localStorage;
let myStorageKey = 'todoList';
let list = [];
let filter = 'all';
let sortItem;

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
  renderList();
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

      let listId = curr.getAttribute('data-id');
      toggleComplete(listId);
    };
  });

  // =================================
  // delete button functionality

  let del = document.getElementsByClassName('list__cross');

  [...del].forEach((curr) => {
    let listId = curr.parentElement.getAttribute('data-id');
    curr.onclick = function () {
      list = list.filter((curr) => curr.id != listId);
      save();
      renderList();
    };
  });
}

// ===============================
// Remove current filter button

function removeFilterState() {
  let button = document.getElementsByClassName('filter__btn--current')[0];
  if (button == null) {
    return;
  }
  button.classList.remove('filter__btn--current');
}

// ===============================
// Current filter button

function currentFilter(filter) {
  if (filter == 'all') {
    removeFilterState();
    document.getElementById('all').classList.add('filter__btn--current');
  }
  if (filter == 'active') {
    removeFilterState();
    document.getElementById('active').classList.add('filter__btn--current');
  }
  if (filter == 'completed') {
    removeFilterState();
    document.getElementById('completed').classList.add('filter__btn--current');
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
  }

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
    let listItem = currTemplate.querySelector('.list__item');

    // give it id to identify it during deletion process
    listItem.setAttribute('data-id', curr.id);
    let currCircle = currTemplate.querySelector('.list__circle');
    let currList = currTemplate.querySelector('.list__desc');
    currList.innerText = curr.name;

    if (filter == 'all') {
      if (curr.completed == true) {
        currCircle.classList.add('list__circle--active');
        currList.classList.add('list__desc--line-through');
      }

      document
        .getElementsByClassName('list__container')[0]
        .appendChild(currTemplate);
    } else if (filter == 'active' && curr.completed == false) {
      document
        .getElementsByClassName('list__container')[0]
        .appendChild(currTemplate);
    } else if (filter == 'completed' && curr.completed == true) {
      currCircle.classList.add('list__circle--active');
      currList.classList.add('list__desc--line-through');

      document
        .getElementsByClassName('list__container')[0]
        .appendChild(currTemplate);
    }
  });

  checkEmptyList();

  calculateRemaining();

  // highlight filter button
  currentFilter(filter);

  // add event
  addListEvent();

  // add sorting functionality
  sortable();
}

// ===============================
// Check if list is empty
function checkEmptyList() {
  let listAmount = document.getElementsByClassName('list__item')[0];
  // console.log(listAmount);
  if (listAmount == undefined) {
    let emptyTemplate = document.createElement('div');
    emptyTemplate.classList.add('list__item--empty');
    emptyTemplate.innerText = '0 items available';

    document
      .getElementsByClassName('list__container')[0]
      .appendChild(emptyTemplate);
  }
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

  // return if there's no valid character
  if (/\w/.test(input.value) == false || input.value == '') {
    return;
  }

  let currItem = {};

  currItem.id = Date.now().toString();
  currItem.name = input.value;
  currItem.completed = false;

  list.push(currItem);
  input.value = '';

  save();

  //render new input
  if (filter == 'all' || filter == 'active') {
    //remove empty placeholder
    let emptyPlaceholder =
      document.getElementsByClassName('list__item--empty')[0];
    if (emptyPlaceholder != undefined) {
      emptyPlaceholder.remove();
    }

    let currTemplate = template.content.cloneNode(true);
    let currList = currTemplate.querySelector('.list__desc');
    let listItem = currTemplate.querySelector('.list__item');

    // give it id to identify it during deletion process
    listItem.setAttribute('data-id', currItem.id);
    currList.innerText = currItem.name;
    // give it id to identify it during deletion process
    currList.id = currItem.id;

    document
      .getElementsByClassName('list__container')[0]
      .appendChild(currTemplate);

    addListEvent();
    sortItem.save();
  }
});

// ===============================
// Show how many items left

function calculateRemaining() {
  let itemLeft = 0;

  list.forEach((curr) => {
    if (curr.completed == false) {
      itemLeft++;
    }
  });

  document.getElementsByClassName(
    'filter__btn--side'
  )[0].innerText = `${itemLeft} items left`;
}

(function clearCompleted() {
  let clear = document.getElementsByClassName('filter__btn--side')[1];
  clear.onclick = function () {
    list = list.filter((curr) => curr.completed == false);
    save();
    renderList();
  };
})();

// ===============================
// Initial render

renderList();

// ===============================
// ===============================
// ===============================
// ===============================
// ===============================
// ===============================
// Toggle dark/light mode functionality
let DLbutton = document.getElementsByClassName('todo__button')[0];

DLbutton.onclick = () => {
  let mode = DLbutton.getAttribute('data-mode');

  // Button animation
  DLbutton.style.transform = 'scale(0.6)';
  DLbutton.style.opacity = '0.5';

  setTimeout(() => {
    DLbutton.style.transform = 'scale(1)';
    DLbutton.style.opacity = '1';

    // Change mode functionality
    if (mode == 'night') {
      DLbutton.setAttribute('data-mode', 'light');
      DLbutton.src = 'img/icon-moon.svg';

      document.body.classList.remove('dark');
    } else {
      DLbutton.setAttribute('data-mode', 'night');
      DLbutton.src = 'img/icon-sun.svg';

      document.body.classList.add('dark');
    }
  }, 100);
};

// ===============================
// ===============================
// ===============================
// ===============================
// ===============================
// ===============================
// Sortable

function sortable() {
  if (sortItem != undefined) {
    sortItem.destroy();
    console.log('Sortitem destroyed');
  }
  const container = document.getElementsByClassName('list__container')[0];
  sortItem = Sortable.create(container, {
    group: 'sortable',
    animation: 250,
    store: {
      get: function (sortable) {
        var order = localStorage.getItem(sortable.options.group.name);
        return order ? order.split('|') : [];
      },

      set: function (sortable) {
        var order = sortable.toArray();
        localStorage.setItem(sortable.options.group.name, order.join('|'));
      },
    },
  });
}
