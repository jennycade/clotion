// my components
import Popup from './Popup';
import Toggle from './Toggle';

// helper functions
import { sortIDsByCreated } from './databaseFunctions';
import { removeFromArray } from './helpers';

// constants
import { PROPERTYTYPEICONS } from './definitions';

const PropertyManager = (props) => {
  // props
  const { exit, properties, propIDs, getType, updatePropertyVisibility, addProperty } = props;
  return (
    <Popup exit={exit}>
      <ul className='menu wideMenu'>
        {
          ['title', ...sortIDsByCreated(removeFromArray('title', Object.keys(properties)), properties)].map(propID => {
            return (
              <li className='iconNameButtonGrid' key={propID}>
                {/* ICON */}
                <span className='icon'>
                  {PROPERTYTYPEICONS[getType(propID)]}
                </span>

                {/* NAME */}
                <span>{properties[propID].displayName}</span>

                {/* SWITCH */}
                <Toggle
                  checked={propIDs.includes(propID)}
                  onCallback={() => updatePropertyVisibility('add', propID)}
                  offCallback={() => updatePropertyVisibility('remove', propID)}
                  disabled={propID === 'title'}
                />
              </li>
            )
          }
          )
        }
        <li onClick={addProperty}>+ Add a property</li>
      </ul>
      
    </Popup>
  );
}

export default PropertyManager;