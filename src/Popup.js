import './Popup.css';

import { useEffect } from 'react';

import { getAncestorClassList, generateUniqueString } from './helpers';

const Popup = (props) => {
  // props
  const { exit } = props;

  // className just for *this* popup
  const uniqueClassName = generateUniqueString([]);

  // event listener for clicking outside the picker --> close it
  useEffect(() => {
    const handleClick = (event) => {
      if (!getAncestorClassList(event.target).includes(uniqueClassName)) { // clicked outside the popup
        exit();
      }
    }

    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        exit();
      }
    }

    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeydown);
    // clean up
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeydown);
    }
  });

  return (
    <div className={`popup ${uniqueClassName}`}>
      { props.children }
    </div>
  );
}

export default Popup;