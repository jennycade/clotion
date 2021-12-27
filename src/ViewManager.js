import { useState, useEffect } from 'react';

// my components
import Popup from './Popup';
import Menu from './Menu';

// constants
import { VIEWMENU } from './definitions';

const ViewManager = (props) => {
  // props
  const { views, activeViewID, addView, switchView, updateViewName, deleteView } = props;

  // state
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showSwitcher, setShowSwitcher] = useState(false);

  // vars
  const numViews = Object.keys(views).length;

  // handling
  const handleAddClick = (viewType) => {
    addView(viewType);
    // close popup
    setShowAddMenu(false);
  }

  const handleSwitchView = (viewID) => {
    switchView(viewID);
    // close popup
    setShowSwitcher(false);
  }

  return (
    <div>
      {/* VIEW BUTTON */}

      {/* Add button */}
      { numViews === 1 &&
        <button onClick={() => setShowAddMenu(true)}>+ Add a view</button>
      }

      {/* Active view name */}
      { numViews > 1 &&
        <button onClick={() => setShowSwitcher(true)}>
          {views[activeViewID].displayName}
        </button>
      }

      {/* VIEW SWITCHER - only when 2+ views */}
      { showSwitcher &&
        <Popup exit={() => setShowSwitcher(false)}>
          <Menu menuItems={
              Object.keys(views).map(
                id => { return { id: id, displayText: views[id].displayName } }
              )
            }
            choose={handleSwitchView}
          >

          </Menu>
        </Popup>
      }

      {/* ADD A VIEW popup */}
      { showAddMenu &&
        <Popup exit={() => setShowAddMenu(false)}>
          <Menu menuItems={VIEWMENU} choose={handleAddClick}>

          </Menu>
        </Popup>
        
      }


    </div>
  );
}

export default ViewManager;