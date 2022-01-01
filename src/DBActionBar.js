import {useState} from 'react';

// components
import ViewManager from './ViewManager';
import Popup from './Popup';
import MoreButton from './MoreButton';
import Menu from './Menu';
import FieldName from './FieldTitle';
import Toggle from './Toggle';

// helpers
import { sortIDsByCreated } from './databaseFunctions';
import { removeFromArray } from './helpers';

const DBActionBar = (props) => {
  // props
  const {
    page, 
    getPropName, getType,
    addDBRow, 
    updateDBPropName, updateDBPropType, handleColumnAction, addProperty,
    addView, updateViewName, switchView, deleteView,
    updateViewGroupByProperty, updatePropertyVisibility,
  } = props;

  // state
  const [showPropertiesManager, setShowPropertiesManager] = useState(false);

  // vars
  const activeViewID = page.activeView;
  const viewType = page.views[activeViewID].type;
  const groupBy = viewType === 'board' ? page.views[activeViewID].groupBy : null;
  const visiblePropIDs = page.views[activeViewID].visibleProperties;

  const getSortedVisiblePropIDs = () => {
    const sortedIDsArray = ['title', ...sortIDsByCreated(removeFromArray('title', Object.keys(page.properties)), page.properties)]
    return sortedIDsArray;
  }

  return (
    <div className='dbActionBar'>
      {/* VIEWS */}
      <div className='viewButton'>
        <ViewManager
          views={page.views}
          activeViewID={activeViewID}
          addView={addView}
          updateViewName={updateViewName}
          switchView={switchView}
          deleteView={deleteView}
        />
      </div>

      <div className='otherActions'>

        {/* PROPERTIES */}
        <div className='dropdownWrapper'>
        <button onClick={() => setShowPropertiesManager(true)}>
          Properties
        </button>
        { showPropertiesManager &&
          <Popup exit={() => setShowPropertiesManager(false)}>
            <ul className='menu wideMenu'>
              {/* Group by for boards */}
              { viewType === 'board' &&
                <li className='rightButton'>
                  <span>Group by</span>
                  <MoreButton displayText={getPropName(groupBy)}>
                    {/* all select properties */}
                    <Menu
                      menuItems={
                        Object.keys(page.properties).filter(propID => {
                          return getType(propID) === 'select'
                        }).map(propID => {
                          return {
                            id: propID,
                            displayText: page.properties[propID].displayName,
                          }
                        })
                      }
                      choose={(newGroupByPropID) => updateViewGroupByProperty(newGroupByPropID, activeViewID)}

                    />
                  </MoreButton>
                </li>
              }
              {
                getSortedVisiblePropIDs().map(propID => {
                  return (
                    <li key={propID} className='rightButtonGrid'>
                      <FieldName
                        type={getType(propID)}
                        displayName={getPropName(propID)}
                        viewType={viewType}
                        updateDBPropName={(newName) => updateDBPropName(newName, propID)}
                        updateDBPropType={async (newType) => await updateDBPropType(newType, propID)}
                        handleColumnAction={async (action) => await handleColumnAction(action, propID, activeViewID)}
                      />

                      {/* SWITCH */}
                      <Toggle
                        checked={visiblePropIDs.includes(propID)}
                        onCallback={() => updatePropertyVisibility('add', propID, page.activeView)}
                        offCallback={() => updatePropertyVisibility('remove', propID, page.activeView)}
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
        }
        </div>

        <div className='dropdownWrapper'>
          <button className='newButton' onClick={() => addDBRow()}>
            New
          </button>
        </div>
      </div>
    </div>
  );
}

export default DBActionBar;