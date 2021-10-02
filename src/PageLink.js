import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';

import './PageLink.css';

const PageLink = ( props ) => {
  // props
  const { id, title, icon, draggable } = props;

  // ref
  const pageLinkRef = useRef(null);

  // state! for style
  const [style, setStyle] = useState({});

  const handleDragEnter = () => {
    // highlight!
    const newStyle = {
      borderTop: '3px solid Highlight',
      marginTop: '-3px',
    };

    setStyle(newStyle);
  }

  const handleDragLeave = () => {
    console.log(`Possibly leaving page ${title}`)
    if (props.isDragLeaveReal(id)) {
      // returns true if it's really leaving
      setStyle({});
    }
  }

  if (draggable) {
    return (
      <div
        style={ style }
        ref={ pageLinkRef }
        draggable={true}
        onDragStart={ (event) => props.handleDrag(event, id) }
        onDragEnter={ handleDragEnter }
        onDragLeave={ handleDragLeave }
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