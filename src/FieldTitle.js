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

  // other column actions
  const handleColumnAction = (action) => {
    /*
    ACTIONS
    - selectOptions
    - filter
    - sortAsc
    - sortDesc
    - addLeft
    - addRight
    - hide
    - duplicate
    - delete
    */
   console.log(`Column action called: ${action}`);

   // close
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
  const columnActionMenu = [
    {
      id: 'selectOptions',
      displayText: 'Configure options',
    },
    {
      id: 'filter',
      displayText: 'Add filter',
    },
    {
      id: 'sortAsc',
      displayText: 'Sort ascending',
    },
    {
      id: 'sortDesc',
      displayText: 'Sort descending',
    },
    {
      id: 'addLeft',
      displayText: 'Insert left',
    },
    {
      id: 'addRight',
      displayText: 'Insert right',
    },
    {
      id: 'hide',
      displayText: 'Hide',
    },
    {
      id: 'duplicate',
      displayText: 'Duplicate',
    },
    {
      id: 'delete',
      displayText: 'Delete',
    },
  ];


  // RENDER

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

        {/* COLUMN ACTIONS */}
        <Menu
          menuItems={ columnActionMenu }
          choose={ (action) => handleColumnAction(action) }
        />

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