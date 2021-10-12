import './BlockToolbar.css';

import { useEffect, useRef } from 'react';

const blockMenu = [
  {
    displayName: 'Text',
    type: 'paragraph',
    description: 'Just start writing with plain text.',
  },
  {
    displayName: 'Page', ////////////////////////////////////// TODO
    type: 'page',
    description: 'Embed a sub-page inside this page.',
  },
  {
    displayName: 'Heading 1',
    type: 'h1',
    description: 'Big section heading.',
  },
  {
    displayName: 'Heading 2',
    type: 'h2',
    description: 'Medium section heading.',
  },
  {
    displayName: 'Heading 3',
    type: 'h3',
    description: 'Small section heading.',
  },
  {
    displayName: 'Bulleted list',
    type: 'bulletList',
    description: 'Create a simple bulleted list.',
  },
  {
    displayName: 'Numbered list',
    type: 'orderedList',
    description: 'Create a list with numbering.',
  },
  {
    displayName: 'Divider', ////////////////////////////////////// TODO
    type: 'divider',
    description: 'Visually divide blocks',
  },
  {
    displayName: 'Callout', ////////////////////////////////////// TODO
    type: 'callout',
    description: 'Make writing stand out.',
  },
];

const BlockToolbar = (props) => {
  // props
  const { chooseBlock, hideToolbar } = props;

  // selecting a block type
  const handleClick = (event, blockType) => {
    event.preventDefault();
    chooseBlock(blockType);
    hideToolbar();
  }

  // for positioning at the caret
  const ref = useRef(null);

  // effect to manage caret position
  useEffect(() => {
    const el = ref.current;

    const domSelection = window.getSelection();
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    el.style.opacity = '1';
    el.style.top = `${rect.top + window.pageYOffset}px`;
    el.style.left = `${rect.right +
      window.pageXOffset}px`;
  });

  // effect for global click listener
  useEffect(() => {
    const onClick = (event) => {
      const x = event.clientX;
      const y = event.clientY;
      const menu = ref.current.getBoundingClientRect();
      if (
        y < menu.top ||
        y > menu.bottom ||
        x < menu.left ||
        x > menu.right
      ) {
        hideToolbar();
      }
    }
    window.addEventListener('click', onClick);
    // unlisten
    return () => {
      window.removeEventListener('click', onClick);
    }
  });
  // hide on typing escape
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        hideToolbar();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    }
  });

  return (
    <div className="blockToolbar"
      ref={ ref }
    >
      { blockMenu.map((block) => {
        return (
          <div
            key={ block.type }
            className="blockType"
            onMouseDown={ (event) => handleClick(event, block.type) }
          >
            <h2>{ block.displayName }</h2>
            <p>{ block.description }</p>
          </div>
        );
      }) }
    </div>
  );
}

export default BlockToolbar;