import { useState } from 'react';

// components
import Popup from './Popup';
import Menu from './Menu';

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
    updateDBPropName, updateDBPropType, 
  } = props;

  // state
  const [editing, setEditing] = useState(false);
  const [showPropTypeMenu, setShowPropTypeMenu] = useState(false);
  const [newName, setNewName] = useState(displayName);

  // updates
  const handleNameChange = (event) => {
    // update state
    const input = event.target.value;
    setNewName(input);

    // send to Page (why exactly?)
    // handleDBPropNameChange(input);
  }

  // update prop/column name
  const handleBlur = () => {
    // send it through!
    updateDBPropName(newName);
  }

  // change prop type
  const handleChoosePropType = (newType) => {
    // send it through
    updateDBPropType(newType);

    // close both popups
    setShowPropTypeMenu(false);
    setEditing(false);
  }

  // menus
  const propertyTypeMenu = [
    {
      id: 'text',
      displayText: 'Text',
      displayIcon: ICONS['text'],
    },
    {
      id: 'number',
      displayText: 'Number',
      displayIcon: ICONS['number'],
    },
    {
      id: 'select',
      displayText: 'Select',
      displayIcon: ICONS['select'],
    },
    {
      id: 'multiselect',
      displayText: 'Multi-select',
      displayIcon: ICONS['multiselect'],
    },
    {
      id: 'date',
      displayText: 'Date',
      displayIcon: ICONS['date'],
    },
    {
      id: 'checkbox',
      displayText: 'Checkbox',
      displayIcon: ICONS['checkbox'],
    },
    {
      id: 'url',
      displayText: 'URL',
      displayIcon: ICONS['url'],
    },
    {
      id: 'email',
      displayText: 'Email',
      displayIcon: ICONS['email'],
    },
    {
      id: 'phone',
      displayText: 'Phone',
      displayIcon: ICONS['phone'],
    },
  ];

  if (editing) {
    return (
      <Popup
        exit={ () => setEditing(false) }
      >
        {/* COLUMN NAME */}
        <div>
          <input type="text"
            onChange={handleNameChange}
            onBlur={handleBlur}
            value={newName}
            autoFocus={true}
          />
        </div>

        {/* PROPERTY TYPE */}
        <ul className='menu'>
          <li className='noHover'><h2>PROPERTY TYPE</h2></li>
          <li className='grid'
            onClick={() => setShowPropTypeMenu(true)}
          >
            <span className='icon'>
              {ICONS[type]}
            </span>
            <span>
              { propertyTypeMenu.find(x => x.id === type).displayText }
            </span>
          </li>
        </ul>

        { showPropTypeMenu &&
          <Popup
            exit={ () => setShowPropTypeMenu(false) }
          >
            <Menu
              menuItems={ propertyTypeMenu }
              selectedID={ type }
              choose={ handleChoosePropType }
            />
          </Popup>

        }

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