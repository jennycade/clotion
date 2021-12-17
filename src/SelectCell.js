import './SelectCell.css';

import { useState, useEffect, Children, cloneElement, isValidElement } from 'react';

import Popup from './Popup';
import SelectOption from './SelectOption';
import SelectOptionRow from './SelectOptionRow';

const SelectCell = (props) => {
  // props
  const {
    type, remove, allOptions,
    addSelectOption, updateSelectOption, deleteSelectOption,
  } = props; // type: 'select' or 'multiselect'

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
    const options = Children.map(props.children, child => isValidElement(child) ? cloneElement(child, {remove}) : null); // iterate over children!

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
            return (
              <SelectOptionRow key={option.id}
                handleChoose={() => handleClick(option.id)}
                color={option.color}
                displayName={option.displayName}
                updateSelectOption={ () => updateSelectOption() }
                deleteSelectOption={ () => deleteSelectOption() }
              />
            )
          })}

          { matchingOptions.length === 0 && filter !== '' && 
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