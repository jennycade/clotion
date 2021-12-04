import { useState, cloneElement, isValidElement } from 'react';
import Popup from './Popup';

const SelectCell = (props) => {
  // props
  const { type, remove } = props; // type: 'select' or 'multiselect'

  // state
  const [editing, setEditing] = useState(false);

  if (editing) {
    // add make SelectOptions removeable
    const options = isValidElement(props.children) ? cloneElement(props.children, {remove}) : null;

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