import { Link } from 'react-router-dom';

const SidebarLink = ( props ) => {
  // props
  const { page } = props;

  return (
    <li key={page.id}>
      <span className="linkIcon">
        { page.icon }
      </span>
      <span className="pageLink">
        <Link to={ `/${page.id}` }>
          { page.title }
        </Link>
      </span>
    </li>
  );
}

export default SidebarLink;