import dedent from "dedent";

export const USING_THE_DOM = {
  title: "Using the DOM",
  description: `This example shows how to manipulate the DOM from the
  playground. It doesn't use any Decimals and will be replaced with another
  example that does.`,
  text: dedent`
  // Make sure to click "Toggle DOM" above
  // to see the results here!

  let a = document.createElement("div");
  a.style.backgroundColor = "seagreen";
  a.style.height = "100px";
  a.style.width = "50%";
  a.style.float = "left";
  document.querySelector("body").append(a);

  let b = document.createElement("div");
  b.style.backgroundColor = "teal";
  b.style.height = "100px";
  b.style.width = "50%";
  b.style.float = "right";
  document.querySelector("body").append(b);
  `,
};
