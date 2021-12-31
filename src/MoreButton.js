import { useState } from 'react';

// components
import Popup from './Popup';

const MoreButton = (props) => {
  // props
  const { displayText } = props;

  // state
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className='dropdownWrapper'>
      <button className='ellipsisButton'
        onClick={() => setShowDropdown(true)}
      >
        { displayText ? displayText : '…'}
      </button>

      {/* DROPDOWN */}
      { showDropdown &&
      <Popup
        popupClassName='moreButtonDropdown'
        exit={() => setShowDropdown(false)}
        class
      >
        {props.children}
      </Popup>
      }
    </div>
  );
}

export default MoreButton;