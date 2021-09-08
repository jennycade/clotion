import './Sidebar.css';

const Sidebar = ( props ) => {
  return (
    <div className="sidebar">
      <ul>

        { props.children }
        
      </ul>

    </div>
  );
}

export default Sidebar;