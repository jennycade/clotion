import './Popup.css';

import { useEffect } from 'react';

import { getAncestorClassList } from './helpers';

const Popup = (props) => {
  // props
  const { exit } = props;

  // event listener for clicking outside the picker --> close it
  useEffect(() => {
    const handleClick = (event) => {
      // console.table(); // return to this part!!!!!!!
      if (!getAncestorClassList(event.target).includes('popup')) { // clicked outside the popup
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
    <div className='popup'>
      { props.children }
    </div>
  );
}

export default Popup;