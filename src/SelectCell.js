import './SelectCell.css';

import { useState, useEffect, cloneElement, isValidElement } from 'react';
import Popup from './Popup';
import SelectOption from './SelectOption';

const SelectCell = (props) => {
  // props
  const { type, remove, allOptions, addSelectOption } = props; // type: 'select' or 'multiselect'

  // state
  const [editing, setEditing] = useState(false);
  const [filter, setFilter] = useState('');
  const [matchingOptions, setMatchingOptions] = useState(allOptions);

  // filtering
  const handleFilterChange = (event) => {
    const newVal = event.target.value;
    setFilter(newVal);
  }

  // filter
  useEffect(() => {
    if (filter !== '') {
      const matching = allOptions.filter(x => x.displayName.includes(filter));
      setMatchingOptions(matching);
    } else {
      setMatchingOptions(allOptions);
    }
  }, [filter, allOptions]);

  // clear filter when leaving editing mode
  useEffect(() => {
    if (!editing) {
      setFilter('');
    }
  }, [editing]);

  // click to choose
  const handleClick = (optionID) => {
    // call prop
    props.handleClick(optionID);
    // close modal for select
    if (type === 'select') {
      setEditing(false);
    }
  }

  // adding an option
  const handleAddOption = async () => {
    // add to db
    const newOptionID = await addSelectOption(filter);

    // select it
    props.handleClick(newOptionID);

    // clear filter
    setFilter('');

    // for select: close the SelectCell
    if (type === 'select') {
      setEditing(false);
    }
  }

  ////////////
  // RENDER //
  ////////////

  if (editing) {
    // add make SelectOptions removeable
    const options = isValidElement(props.children) ? cloneElement(props.children, {remove}) : null;

    return (
      <Popup exit={ () => setEditing(false) }>
        <header className='currentSelectOptions'>
          {/* Current value */}
          { options } 

          {/* Filter text box */}
          <input
            type='text'
            autoFocus={true}
            onChange={handleFilterChange}
            value={filter}
          />
        </header>
        
        <ul className='selectOptions'>
          <li className='instructions'>Select an option or create one.</li>
          { matchingOptions.map(option => {
            return <li className='selectOptionDiv' key={option.id} onClick={ () => handleClick(option.id) } >
              <SelectOption
                color={option.color}
              >
              { option.displayName }
              </SelectOption>
            </li>
          })}

          { matchingOptions.length === 0 && 
            <li className='selectOptionDiv'
              onClick={ handleAddOption }
            >
              Create <SelectOption color='gray'>{filter}</SelectOption>
            </li>
          }

        </ul>
      </Popup>
      
    );
  } else {
    return (
      <div onClick={ () => setEditing(true) }>
        { props.children }
      </div>
    );
  }
  
};

export default SelectCell;