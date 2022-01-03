import './BlockToolbar.css';

import { useState, useEffect, useRef } from 'react';

import BLOCKMENU from './blockMenu';

const BlockToolbar = (props) => {
  // props
  const { chooseBlock, hideToolbar, getTextAfterLastSlash } = props;

  // state
  const [selectedType, setSelectedType] = useState(BLOCKMENU[0].type);
  const [searchText, setSearchText] = useState('');
  // const [blockMenu, setBlockMenu] = useState(BLOCKMENU);

  // not state? eh?
  const blockMenu = BLOCKMENU.filter(c =>
    c.displayName.toLowerCase().includes(searchText.toLowerCase())
  );

  // selecting a block type
  const handleClick = async (event, blockType) => {
    event.preventDefault();
    await chooseBlock(blockType);
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

  // navigate with up and down arrows
  useEffect(() => {
    const arrowKeyValues = ['Up', 'ArrowUp', 'Down', 'ArrowDown', 'Left', 'ArrowLeft', 'Right', 'ArrowRight'];
    const onKeyDown = (event) => {
      if (arrowKeyValues.includes(event.key)) {
        let direction;
        event.preventDefault(); // NOTE: Doesn't prevent navigating left or right. May result in a bunch of lost data (when LiveBlock deletes to last slash)
        if (event.key === 'Up' || event.key === 'ArrowUp') {
          direction = 'up';
        } else if (event.key === 'Down' || event.key === 'ArrowDown') {
          direction = 'down';
        }
        // call navigateTypes to change the direction
        navigateTypes(direction);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    }
  });

  // effect to choose with enter/return key
  useEffect(() => {
    const onKeyDown = async (event) => {
      if (event.key === 'Enter') {
        // don't type enter!
        event.preventDefault();
        // choose the type
        await chooseBlock(selectedType);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    }
  });

  // effect to listen for typing
  useEffect(() => {
    const onKeyUp = () => {
      try {
        const newText = getTextAfterLastSlash();
        if (newText !== searchText) {
          // update search test
          setSearchText(newText);
        }
      } catch {
        // doesn't work --> slash was deleted. Close the toolbar
        hideToolbar();
      }
    }
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keyup', onKeyUp);
    }
  });

  const navigateTypes = (direction) => {
    // get current index
    const selectedBlockIndex = blockMenu.findIndex(blockType => blockType.type === selectedType);
    
    // calculate next index
    let newIndex;
    if (direction === 'up') {
      newIndex = selectedBlockIndex - 1;
    } else if (direction === 'down') {
      newIndex = selectedBlockIndex + 1;
    } else {
      throw new Error('Called navigateTypes() with invalid direction: ' + direction);
    }

    // is newIndex in the array?
    if (typeof blockMenu[newIndex] !== 'undefined') {
      // index exists
      // update state
      setSelectedType(blockMenu[newIndex].type);
    }

    // not in array --> at top or bottom of menu. Don't do anything.
  }

  return (
    <div className="blockToolbar"
      ref={ ref }
    >
      { blockMenu.map((block) => {
        return (
          <div
            key={ block.type }
            className={`blockType${block.type === selectedType ? ' selected' : ''}`}
            onMouseOver={ () => setSelectedType(block.type) }
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