// CSS
import './Menu.css';
import './ColorThumbnail.css';

import { useState } from 'react';

// components
import SelectOption from './SelectOption';
import Popup from './Popup';
import Menu from './Menu';
import { ColorThumbnail } from './ColorToolbar';
import { getColorCode } from './helpers';

const SelectOptionRow = (props) => {
  // props
  const { handleChoose, color, displayName,
    updateSelectOption, deleteSelectOption,
  } = props;

  // state
  const [editOption, setEditOption] = useState(false);
  const [newName, setNewName] = useState(displayName);

  // handling
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }
  const handleBlur = () => {
    // send through
    updateSelectOption(newName, 'displayName');
  }
  const chooseColor = (color) => {
    updateSelectOption(color, 'color');
  }

  // color menu
  const colorMenu = [
    {id: 'light gray', displayText: 'Light Gray', displayIcon: <ColorThumbnail color='inherit' backgroundColor={ getColorCode('light gray', 'bgColor')} />},
    {id: 'gray', displayText: 'Gray', displayIcon: <ColorThumbnail color='inherit' backgroundColor={ getColorCode('gray', 'bgColor')} />},
    {id: 'brown', displayText: 'Brown', displayIcon: <ColorThumbnail color='inherit' backgroundColor={ getColorCode('brown', 'bgColor')} />},
    {id: 'orange', displayText: 'Orange', displayIcon: <ColorThumbnail color='inherit' backgroundColor={ getColorCode('orange', 'bgColor')} />},
    {id: 'yellow', displayText: 'Yellow', displayIcon: <ColorThumbnail color='inherit' backgroundColor={ getColorCode('yellow', 'bgColor')} />},
    {id: 'green', displayText: 'Green', displayIcon: <ColorThumbnail color='inherit' backgroundColor={ getColorCode('green', 'bgColor')} />},
    {id: 'blue', displayText: 'Blue', displayIcon: <ColorThumbnail color='inherit' backgroundColor={ getColorCode('blue', 'bgColor')} />},
    {id: 'purple', displayText: 'Purple', displayIcon: <ColorThumbnail color='inherit' backgroundColor={ getColorCode('purple', 'bgColor')} />},
    {id: 'pink', displayText: 'Pink', displayIcon: <ColorThumbnail color='inherit' backgroundColor={ getColorCode('pink', 'bgColor')} />},
    {id: 'red', displayText: 'Red', displayIcon: <ColorThumbnail color='inherit' backgroundColor={ getColorCode('red', 'bgColor')} />},
  ]

  return (
    <li className='selectOptionDiv'>
      <span onClick={ () => handleChoose }>
        <SelectOption
          color={color}
        >
        { displayName }
        </SelectOption>
      </span>
      <button
        className='moreButton'
        onClick={ () => setEditOption(true) }
      >…</button>
      { editOption && 
        <Popup exit={ () => setEditOption(false)}>

          {/* DISPLAY NAME */}
          <div>
            <input type='text'
              onChange={handleNameChange}
              onBlur={handleBlur}
              value={ newName }
              autoFocus={true}
            />
          </div>

          <ul className='menu'>
            {/* DELETE */}
            <li className='grid'
              onClick={deleteSelectOption}
            >
              <span className='icon'>
                🗑
              </span>
              <span>
                Delete
              </span>
            </li>
            
            {/* COLOR */}
            <li className='noHover'><h2>COLORS</h2></li>
          </ul>

          {/* COLOR */}
          <Menu
            menuItems={colorMenu}
            choose={chooseColor}
          />
        </Popup>
      }
    </li>
  );
}

export default SelectOptionRow;