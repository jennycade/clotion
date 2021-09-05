import { Link } from 'react-router-dom';

const SidebarLink = ( props ) => {
  // props
  const { id, title, icon } = props;

  return (
    <li key={id}>
      <span className="toggle">
        ▶
      </span>
      <span className="linkIcon">
        { icon }
      </span>
      <span className="pageLink">
        <Link to={ `/${id}` }>
          { title }
        </Link>
      </span>
    </li>
  );
}

export default SidebarLink;