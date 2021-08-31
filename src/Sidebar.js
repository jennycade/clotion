import SidebarLink from './SidebarLink';

const Sidebar = ( props ) => {
  // props
  const { pages } = props;
  return (
    <div className="sidebar">

      { pages.map( (page) => <SidebarLink key={ page.id } page={ page } />) }

    </div>
  );
}

export default Sidebar;