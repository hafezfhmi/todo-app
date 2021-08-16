// For drag and drop, try to use this library
// https://interactjs.io/

// get circle button
let btn = document.getElementsByClassName('list__circle');

// use spread operator and forEach to apply onclick event targeting this (current) element
[...btn].forEach((curr) => {
  curr.onclick = function () {
    this.classList.toggle('list__circle--active');
  };
});
