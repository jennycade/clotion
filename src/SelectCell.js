import { useState, cloneElement } from 'react';
import Popup from './Popup';

const SelectCell = (props) => {
  // props
  const { type, remove } = props; // type: 'select' or 'multiselect'

  // state
  const [editing, setEditing] = useState(false);

  if (editing) {
    // add make SelectOptions removeable
    const options = cloneElement(props.children, {remove});

    return (
      <Popup exit={ () => setEditing(false) }>
        { options }
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