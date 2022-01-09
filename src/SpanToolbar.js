// css
import './SpanToolbar.css';

// react
import { useState, useEffect, useRef } from 'react';

// slateJS
import { useSlate, ReactEditor } from 'slate-react';
import { Editor, Range } from 'slate';

// components
import SpanButton from './SpanButton';
import ColorToolbar from './ColorToolbar';
import MiniBlockToolbar from './MiniBlockToolbar';

// constants
import { DROPDOWNICON } from './definitions';

const SpanToolbar = (props) => {
  // props
  const { chooseBlock, chooseColor, toggleMark, isMarkActive, getColorCode } = props;

  // state
  const [showColorToolbar, setShowColorToolbar] = useState(false);
  const [showBlockToolbar, setShowBlockToolbar] = useState(false);

  // click
  const handleClick = (event, mark) => {
    event.preventDefault();

    toggleMark(mark);
  }

  // sub-toolbars
  const handleColorToolbarClick = (event) => {
    event.preventDefault();
    setShowColorToolbar(!showColorToolbar);
  }
  const handleBlockToolbarClick = (event) => {
    event.preventDefault();
    setShowBlockToolbar(!showBlockToolbar);
  }

  // for positioning
  const containerRef = useRef(null);
  const spanToolbarRef = useRef(null);
  const editor = useSlate();

  // effect to manage position
  useEffect(() => {
    const containerElement = containerRef.current;
    const toolbarElement = spanToolbarRef.current;
    const { selection } = editor;

    if (!containerElement) {
      return
    }

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      containerElement.removeAttribute('style');
      // collapse dropdowns
      setShowBlockToolbar(false);
      setShowColorToolbar(false);
      return
    }

    const domSelection = window.getSelection()
    const domRange = domSelection.getRangeAt(0)
    const rect = domRange.getBoundingClientRect()
    containerElement.style.opacity = '1'
    containerElement.style.top = `${rect.top + window.pageYOffset - toolbarElement.offsetHeight}px`
    containerElement.style.left = `${rect.left +
      window.pageXOffset -
      toolbarElement.offsetWidth / 2 +
      rect.width / 2}px`
  }, [editor]);


  return (
    <div className="toolbarContainer"
      ref={ containerRef }
    >
      <div className="spanToolbar"
        ref={ spanToolbarRef }
      >
        <SpanButton mark='blockButton' isMarkActive={ () => false } handleMouseDown={ handleBlockToolbarClick } dropdown={true}>
          Choose block
          { DROPDOWNICON }
        </SpanButton>

        <SpanButton mark='bold' isMarkActive={ isMarkActive } handleMouseDown={ handleClick }>B</SpanButton>

        <SpanButton mark='italic' isMarkActive={ isMarkActive } handleMouseDown={ handleClick }>i</SpanButton>

        <SpanButton mark='underline' isMarkActive={ isMarkActive } handleMouseDown={ handleClick }>U</SpanButton>

        <SpanButton mark='strikethrough' isMarkActive={ isMarkActive } handleMouseDown={ handleClick }>S</SpanButton>

        <SpanButton mark='code' isMarkActive={ isMarkActive } handleMouseDown={ handleClick }>&lt;&gt;</SpanButton>

        <SpanButton mark='colorButton' isMarkActive={ () => false } handleMouseDown={ handleColorToolbarClick } dropdown={true}>
          A
          { DROPDOWNICON }
        </SpanButton>

      </div>
      {/* DROPDOWN MENUS */}
      { showBlockToolbar && 
        <MiniBlockToolbar
          chooseBlock={ chooseBlock }
          hideToolbar={() => setShowBlockToolbar(false) }
        />
      }

      { showColorToolbar &&
          <ColorToolbar
            chooseColor={chooseColor}
            getColorCode={getColorCode}
            hideToolbar={() => setShowColorToolbar(false)}
          />
        }
    </div>
  );
}

export default SpanToolbar;