import { useState } from 'react';

// components
import Popup from './Popup';
import Menu from './Menu';

// constants
import { PROPERTYTYPEICONS } from './definitions';
import TextInput from './TextInput';

const FieldName = (props) => {
  // props
  const {
    type, displayName,
    updateDBPropName, updateDBPropType,
    handleColumnAction,
  } = props;

  // state
  const [editing, setEditing] = useState(false);
  const [showPropTypeMenu, setShowPropTypeMenu] = useState(false);

  // change prop type
  const handleChoosePropType = (newType) => {
    // send it through
    updateDBPropType(newType);

    // close both popups
    setShowPropTypeMenu(false);
    setEditing(false);
  }

  // other column actions
  const handleColumnActionClick = (action) => {
    /*
    ACTIONS
    - hide
    - delete
    */
    handleColumnAction(action);

   // close
   setEditing(false);
  }

  // menus
  const propertyTypeMenu = [
    {
      id: 'text',
      displayText: 'Text',
      displayIcon: PROPERTYTYPEICONS['text'],
    },
    {
      id: 'number',
      displayText: 'Number',
      displayIcon: PROPERTYTYPEICONS['number'],
    },
    {
      id: 'select',
      displayText: 'Select',
      displayIcon: PROPERTYTYPEICONS['select'],
    },
    {
      id: 'multiselect',
      displayText: 'Multi-select',
      displayIcon: PROPERTYTYPEICONS['multiselect'],
    },
    {
      id: 'date',
      displayText: 'Date',
      displayIcon: PROPERTYTYPEICONS['date'],
    },
    {
      id: 'checkbox',
      displayText: 'Checkbox',
      displayIcon: PROPERTYTYPEICONS['checkbox'],
    },
    {
      id: 'url',
      displayText: 'URL',
      displayIcon: PROPERTYTYPEICONS['url'],
    },
    {
      id: 'email',
      displayText: 'Email',
      displayIcon: PROPERTYTYPEICONS['email'],
    },
    {
      id: 'phone',
      displayText: 'Phone',
      displayIcon: PROPERTYTYPEICONS['phone'],
    },
  ];
  const columnActionMenu = [
    // {
    //   id: 'selectOptions',
    //   displayText: 'Configure options',
    // },
    // {
    //   id: 'filter',
    //   displayText: 'Add filter',
    // },
    // {
    //   id: 'sortAsc',
    //   displayText: 'Sort ascending',
    // },
    // {
    //   id: 'sortDesc',
    //   displayText: 'Sort descending',
    // },
    // {
    //   id: 'addLeft',
    //   displayText: 'Insert left',
    // },
    // {
    //   id: 'addRight',
    //   displayText: 'Insert right',
    // },
    {
      id: 'hide',
      displayText: 'Hide',
      icon: '🚫',
    },
    // {
    //   id: 'duplicate',
    //   displayText: 'Duplicate',
    // },
    {
      id: 'delete',
      displayText: 'Delete',
      icon: '🗑'
    },
  ];

  // RENDER

  if (editing) {
    return (
      <Popup
        exit={ () => setEditing(false) }
        popupClassName={'fieldNamePopup'}
      >
        {/* COLUMN NAME */}
        <div>
          <TextInput
            initialVal={displayName}
            updateVal={updateDBPropName}
            liveUpdate={false}
          />
          
        </div>

        {/* PROPERTY TYPE */}
        { type !== 'title' &&
        
        <ul className='menu'>
          <li className='noHover'><h2>PROPERTY TYPE</h2></li>
          <li className='grid'
            onClick={() => setShowPropTypeMenu(true)}
          >
            <span className='icon'>
              {PROPERTYTYPEICONS[type]}
            </span>
            <span>
              { propertyTypeMenu.find(x => x.id === type).displayText }
            </span>
          </li>
        </ul>
        }

        {/* PROPERTY TYPE MENU */}
        { type !== 'title' &&showPropTypeMenu &&
          <Popup
            exit={ () => setShowPropTypeMenu(false) }
            popupClassName={'propTypePopup'}
          >
            <Menu
              menuItems={ propertyTypeMenu }
              selectedID={ type }
              choose={ handleChoosePropType }
            />
          </Popup>
        }

        {/* COLUMN ACTIONS */}
        { type !== 'title' &&
        
        <Menu
          menuItems={ columnActionMenu }
          choose={ handleColumnActionClick }
        />

        }

      </Popup>
    );
  } else {
    return (
      <span className='columnName' onClick={() => setEditing(true)}>
        <span>{ PROPERTYTYPEICONS[type] }</span>
        <span>{ displayName }</span>
      </span>
    );
  }
}

export default FieldName;