import { useState, useEffect, cloneElement, isValidElement } from 'react';
import Popup from './Popup';

const SelectCell = (props) => {
  // props
  const { type, remove, allOptions } = props; // type: 'select' or 'multiselect'

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
    }
  }, [filter, allOptions]);

  // clear filter when leaving editing mode
  useEffect(() => {
    if (!editing) {
      setFilter('');
    }
  }, [editing]);

  ////////////
  // RENDER //
  ////////////

  if (editing) {
    // add make SelectOptions removeable
    const options = isValidElement(props.children) ? cloneElement(props.children, {remove}) : null;

    return (
      <Popup exit={ () => setEditing(false) }>
        { options }
        <input type='text' onChange={handleFilterChange} value={filter} />
        { matchingOptions.map(option => {
          return <div key={option.id}>{option.displayName}</div>
        })}
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