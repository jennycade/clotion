import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { Simulate } from 'react-dom/test-utils';

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
    render(<LiveBlock textContent='' />, container);
  });
  expect(container.firstChild.tagName).toBe('P');
  expect(container.firstChild.textContent).toBe('');
});

test("Renders paragraph with text at first", () => {
  act(() => {
    render(<LiveBlock textContent='Paragraph' />, container);
  });
  expect(container.firstChild.tagName).toBe('P');
  expect(container.firstChild.textContent).toBe('Paragraph');
});

// Type '# ' --> converts to <h1></h1>
test('Renders blank h1 when user types "# "', () => {
  act(() => {
    render(<LiveBlock textContent='' />, container);
  });
  const block = container.querySelector('p');
  block.textContent = '# ';

  block.dispatchEvent(new InputEvent('#'));
  block.dispatchEvent(new InputEvent(' '));

  expect(container.firstChild.tagName).toBe('H1');
  expect(container.firstChild.textContent).toBe('');
});