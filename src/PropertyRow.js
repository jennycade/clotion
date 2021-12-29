import { useState } from 'react';

// my components
import Toggle from './Toggle';
import Popup from './Popup';
import FieldName from './FieldTitle';

// constants
import { PROPERTYTYPEICONS } from './definitions';

const PropertyRow = (props) => {
  // props
  const {
    propID, propIDs, displayName,
    type, updatePropertyVisibility,
    updateDBPropName, updateDBPropType, handleColumnAction,
  } = props;

  // state
  const [showFieldName, setShowFieldName] = useState(false);

  return (
    <li className='rightButtonGrid'>

      <FieldName
        type={type}
        displayName={displayName}
        updateDBPropName={updateDBPropName}
        updateDBPropType={updateDBPropType}
        handleColumnAction={handleColumnAction}
      />

      {/* ICON */}
      {/* <span className='icon'>
        {PROPERTYTYPEICONS[type]}
      </span> */}

      {/* NAME */}
      {/* <span onClick={() => setShowFieldName(true)}>{displayName}</span> */}

      {/* POPUP */}
      {/* { showFieldName &&
      <Popup exit={() => setShowFieldName(false)} >
        <FieldName
          type={type}
          displayName={displayName}
          updateDBPropName={updateDBPropName}
          updateDBPropType={updateDBPropType}
          handleColumnAction={handleColumnAction}
        />
      </Popup>
      } */}

      {/* SWITCH */}
      <Toggle
        checked={propIDs.includes(propID)}
        onCallback={() => updatePropertyVisibility('add')}
        offCallback={() => updatePropertyVisibility('remove')}
        disabled={propID === 'title'}
      />
    </li>
  );
}

export default PropertyRow;