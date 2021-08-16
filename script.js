// For drag and drop, try to use this library
// https://interactjs.io/

// get circle button
let btn = document.getElementsByClassName('list__item');

// use spread operator and forEach to apply onclick event targeting this (current) element
[...btn].forEach((curr) => {
  curr.onclick = function () {
    this.children[0].classList.toggle('list__circle--active');
    this.children[1].classList.toggle('list__desc--line-through');
  };
});

let del = document.getElementsByClassName('list__cross');

[...del].forEach((curr) => {
  curr.onclick = function () {
    this.parentElement.remove();
  };
});
