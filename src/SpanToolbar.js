import './BlockToolbar.css';

import { useEffect, useRef } from 'react';

// slateJS
import { useSlate, ReactEditor } from 'slate-react';
import { Editor, Range } from 'slate';

const COLORNAMES = [
  'default',
  'gray',
  'brown',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'red',
];

const SpanToolbar = (props) => {
  // props
  const { chooseColor } = props;

  // click
  const handleClick = (event, type, colorName) => {
    event.preventDefault();
    chooseColor(type, colorName); // TODO: Hook this up!
  }

  // for positioning
  const ref = useRef(null);
  const editor = useSlate();

  // effect to manage caret position
  useEffect(() => {
    const el = ref.current
    const { selection } = editor

    if (!el) {
      return
    }

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style')
      return
    }

    const domSelection = window.getSelection()
    const domRange = domSelection.getRangeAt(0)
    const rect = domRange.getBoundingClientRect()
    el.style.opacity = '1'
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`
    el.style.left = `${rect.left +
      window.pageXOffset -
      el.offsetWidth / 2 +
      rect.width / 2}px`
  })


  return (
    <div className="blockToolbar"
      ref={ ref }
    >
      { COLORNAMES.map((colorName) => {
        return (
          <div
            className="color"
            onMouseDown={ (event) => handleClick(event, 'color', colorName) }
          >
            <p>{ `${colorName.slice(0, 1).toUpperCase()}${colorName.slice(1)}` }</p>
          </div>
        );
      }) }
      { COLORNAMES.map((colorName) => {
        return (
          <div
            className="color"
            onMouseDown={ (event) => handleClick(event, 'bgColor', colorName) }
          >
            <p>{ `${colorName.slice(0, 1).toUpperCase()}${colorName.slice(1)} background` }</p>
          </div>
        );
      }) }
    </div>
  );
}

export default SpanToolbar;