import './Sidebar.css';
import React from 'react';

const Sidebar = ( props ) => {
  const childrenWithProps = React.Children.map(props.children, child => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { draggable: true });
    }
    return child;
  });

  return (
    <div className="sidebar">
      {/* { cloneElement(props.children, { draggable: true }) } */}
      { childrenWithProps }
    </div>
  );
}

export default Sidebar;