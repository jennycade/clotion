import { useState } from 'react';

// components
import Popup from './Popup';

const FieldName = (props) => {
  // property type icons
  const ICONS = {
    title: '🆔', 
    text: '🔤',
    number: '#️⃣',
    select: '▾',
    multiselect: '≔',
    date: '🗓',
    checkbox: '☑︎',
    url: '🔗',
    email: '✉️',
    phone: '📞',
  };

  // props
  const {
    type, displayName,
    // handleDBPropNameChange,
    updateDBPropName,
  } = props;

  // state
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(displayName);

  // updates
  const handleNameChange = (event) => {
    // update state
    const input = event.target.value;
    setNewName(input);

    // send to Page (why exactly?)
    // handleDBPropNameChange(input);
  }

  const handleBlur = () => {
    // send it through!
    updateDBPropName(newName);
  }

  if (editing) {
    return (
      <Popup
        exit={ () => setEditing(false) }
      >
        <div>
          <input type="text"
            onChange={handleNameChange}
            onBlur={handleBlur}
            value={newName}
            autoFocus={true}
          />
        </div>

      </Popup>
    );
  } else {
    return (
      <span className='columnName' onClick={() => setEditing(true)}>
        <span>{ ICONS[type] }</span>
        <span>{ displayName }</span>
      </span>
    );
  }
}

export default FieldName;