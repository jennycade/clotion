import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import LiveBlock from './LiveBlock';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test("Renders an empty paragraph at first", () => {
  act(() => {
    render(<LiveBlock />, container);
  });
  expect(container.firstChild.tagName).toBe('P');
  expect(container.firstChild.textContent).toBe('');
});

// Type '# ' --> converts to <h1></h1>