export const USING_THE_DOM = {
  title: "Using the DOM",
  text: `
  let a = document.createElement("div");
  a.style.backgroundColor = 'seagreen';
  a.style.height = '100px';
  a.style.width = '50%';
  a.style.float = 'left';
  document.querySelector('body').append(a);

  let b = document.createElement("div");
  b.style.backgroundColor = 'teal';
  b.style.height = '100px';
  b.style.width = '50%';
  b.style.float = 'right';
  document.querySelector('body').append(b);  `
}
