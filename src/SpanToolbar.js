import './SpanToolbar.css';

import { useState, useEffect, useRef } from 'react';

// slateJS
import { useSlate, ReactEditor } from 'slate-react';
import { Editor, Range } from 'slate';
import ColorToolbar from './ColorToolbar';

const SpanToolbar = (props) => {
  // props
  const { chooseColor } = props;

  // state
  const [showColorToolbar, setShowColorToolbar] = useState(false);

  // click
  const handleClick = (event) => {
    event.preventDefault();

  }

  // toolbars
  const handleColorToolbarClick = (event) => {
    event.preventDefault();
    setShowColorToolbar(true);
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
    <div className="toolbarContainer"
      ref={ ref }
    >
      <div className="spanToolbar">
        <button className="boldButton" onClick={handleClick}>B</button>
        <button className="italicButton" onClick={handleClick}>i</button>
        <button className="underlineButton" onClick={handleClick}>U</button>
        <button className="strikethroughButton" onClick={handleClick}>S</button>
        <button className="codeButton" onClick={handleClick}>&lt;&gt;</button>
        <button className="colorButton" onClick={handleColorToolbarClick}>A</button>
      </div>
      {/* DROPDOWN MENUS */}
      { showColorToolbar &&
          <ColorToolbar chooseColor={chooseColor} hideToolbar={() => setShowColorToolbar(false)} />
        }
    </div>
  );
}

export default SpanToolbar;