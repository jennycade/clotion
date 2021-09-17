import { Link } from 'react-router-dom';

import './PageLink.css';

const PageLink = ( props ) => {
  // props
  const { id, title, icon } = props;

  return (
    <Link to={ `/${id}` } className="link" >
      <span className="linkIcon">
        { icon }
      </span>

      <span className="pageLink">
        { title }
      </span>
    </Link>
  );
}

export default PageLink;