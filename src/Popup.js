import './Popup.css';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';

import { getAncestorClassList } from './helpers';

const Popup = (props) => {
  // props
  const { exit } = props;

  // ref
  const popupDiv = useRef(null);

  // state
  const [right, setRight] = useState('auto');
  const [bottom, setBottom] = useState('auto');

  // position
  useLayoutEffect(() => {
    if (popupDiv) {
      const rectangle = popupDiv.current.getBoundingClientRect();

      // right
      if (rectangle.right > window.innerHeight) {
        setRight(0);
      } else {
        setRight('auto');
      }

      // bottom
      if (rectangle.top + rectangle.height > window.innerHeight) {
        setBottom(0);
      } else {
        setBottom('auto');
      }

    }
  }, [setRight, setBottom]);

  // unique className
  let uniqueClassName = 'popup';
  let fullClassName = 'popup';
  if (!!props.popupClassName) {
    uniqueClassName = props.popupClassName;
    fullClassName = `popup ${props.popupClassName}`;
  }

  // event listener for clicking outside the picker --> close it
  useEffect(() => {
    const handleClick = (event) => {
      const allAncestors = getAncestorClassList(event.target);
      if (!allAncestors.includes(uniqueClassName)) { // clicked outside the popup
        exit();
      }
    }

    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        exit();
      }
    }

    window.addEventListener('mousedown', handleClick);
    window.addEventListener('keydown', handleKeydown);
    // clean up
    return () => {
      window.removeEventListener('mousedown', handleClick);
      window.removeEventListener('keydown', handleKeydown);
    }
  }, [exit, uniqueClassName]);

  // render
  return (
    <div
      ref={popupDiv}
      className={ fullClassName }
      style={
        {
          right: right,
          bottom: bottom
        }
      }
    >
      { props.children }
    </div>
  );
}

export default Popup;