import { Link } from 'react-router-dom';

import './PageLink.css';

const PageLink = ( props ) => {
  // props
  const { id, title, icon, draggable } = props;

  if (draggable) {
    return (
      <div
        draggable={true}
        onDragStart={ () => props.handleDrag(id) }
        onDragOver={ (event) => event.preventDefault() }
        onDrop={ () => props.handleDrop(id) }
      >
        <Link to={ `/${id}` } className="link" >
          <span className="linkIcon">
            { icon }
          </span>
    
          <span className="pageLink">
            { title }
          </span>
        </Link>
      </div>
    );

  } else {
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
  
}

export default PageLink;