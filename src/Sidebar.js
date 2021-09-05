import SidebarLink from './SidebarLink';

import './Sidebar.css';

const Sidebar = ( props ) => {
  // props
  const { pages } = props;
  return (
    <div className="sidebar">
      <ul>

        {/* { pages.map( (page) => <SidebarLink key={ page.id } id={ page.id } title={ page.title } icon={ page.icon } />) } */}

        { props.children }
        
      </ul>

    </div>
  );
}

export default Sidebar;