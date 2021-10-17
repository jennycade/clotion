// css
import './SpanToolbar.css';

// react
import { useState, useEffect, useRef } from 'react';

// slateJS
import { useSlate, ReactEditor } from 'slate-react';
import { Editor, Range } from 'slate';
import ColorToolbar from './ColorToolbar';

// components
import SpanButton from './SpanButton';

const SpanToolbar = (props) => {
  // props
  const { chooseColor, toggleMark, isMarkActive } = props;

  // state
  const [showColorToolbar, setShowColorToolbar] = useState(false);

  // click
  const handleClick = (event, mark) => {
    event.preventDefault();

    toggleMark(mark);
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
  });


  return (
    <div className="toolbarContainer"
      ref={ ref }
    >
      <div className="spanToolbar">
        <SpanButton mark='bold' isMarkActive={ isMarkActive } handleMouseDown={ handleClick }>B</SpanButton>

        <SpanButton mark='italic' isMarkActive={ isMarkActive } handleMouseDown={ handleClick }>i</SpanButton>

        <SpanButton mark='underline' isMarkActive={ isMarkActive } handleMouseDown={ handleClick }>U</SpanButton>

        <SpanButton mark='strikethrough' isMarkActive={ isMarkActive } handleMouseDown={ handleClick }>S</SpanButton>

        <SpanButton mark='code' isMarkActive={ isMarkActive } handleMouseDown={ handleClick }>&lt;&gt;</SpanButton>

        <SpanButton mark='colorButton' isMarkActive={ () => false } handleMouseDown={ handleColorToolbarClick }>A</SpanButton>

      </div>
      {/* DROPDOWN MENUS */}
      { showColorToolbar &&
          <ColorToolbar chooseColor={chooseColor} hideToolbar={() => setShowColorToolbar(false)} />
        }
    </div>
  );
}

export default SpanToolbar;