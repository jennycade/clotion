import { Link } from 'react-router-dom';

// CSS
import './PageLink.css';

const PageLink = ( props ) => {
  // props
  let { id, title, icon, draggable } = props;

  
  /////////////////
  // DRAG & DROP //
  /////////////////

  const handleDragOver = (event) => {
    event.preventDefault();
  }

  const handleDrop = () => {
    props.handleDrop(id);
  }

  ////////////
  // RENDER //
  ////////////

  if (draggable) {
    return (
      <div
        draggable={true}
        onDragStart={ (event) => props.handleDrag(event, id) }
        onDragOver={ handleDragOver }
        onDrop={ handleDrop }
      >
        <Link to={ `/${id}` } className="link" >
          <span className="linkIcon">
            { icon }
          </span>
    
          <span className="pageLink">
            { title }
          </span>
        </Link>
        {props.children}
      </div>
    );

  } else {
    return (
      <Link to={ `/${id}` } className="link"
        style={{ userSelect: "none" }} // for SlateJS
        contentEditable={false}
        {...props.attributes}
      >
        {props.children}
        <span
          className="linkIcon"
          style={{ userSelect: "none" }}
          contentEditable={false}
        >
          { icon }
        </span>
  
        <span
          className="pageLink"
          style={{ userSelect: "none" }}
          contentEditable={false}
        >
          { title }
        </span>
      </Link>
    );
  }
  
}

export default PageLink;