import { Link } from 'react-router-dom';

const Sidebar = ( props ) => {
  // props
  const { pages } = props;
  return (
    <div className="sidebar">

      { pages.map( (page) => <li key={page.id}>{ page.icon + ' ' + page.title }</li>) }
      
    </div>
  );
}

export default Sidebar;