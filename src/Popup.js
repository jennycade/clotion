import './Popup.css';

import { useEffect } from 'react';

import { getAncestorClassList } from './helpers';

const Popup = (props) => {
  // props
  const { exit } = props;

  // unique className
  let uniqueClassName = 'popup';
  let fullClassName = 'popup';
  if (!!props.popupClassName) {
    uniqueClassName = props.popupClassName;
    fullClassName = `popup ${props.popupClassName}`;
  }

  // full className


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

  return (
    <div className={ fullClassName }>
      { props.children }
    </div>
  );
}

export default Popup;