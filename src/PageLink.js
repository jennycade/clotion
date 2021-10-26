import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

// database
import {doc, onSnapshot} from 'firebase/firestore';
import { db } from './firebase/db';

// CSS
import './PageLink.css';

const PageLink = ( props ) => {
  // props
  let { id, title, icon, draggable } = props;

  // ref
  const pageLinkRef = useRef(null);

  // state! for style
  const [style, setStyle] = useState({});

  //////////////////////////////
  // NO DATA -> FETCH FROM DB //
  //////////////////////////////

  useEffect( () => {
    if (typeof title === 'undefined') {
      const unsub = onSnapshot(doc(db, 'pages', id), (doc) => {
        title = doc.data().title;
        icon = doc.data().icon;
      });
      return unsub;
    }
  }, [id]);



  /////////////////
  // DRAG & DROP //
  /////////////////

  const handleDragOver = (event) => {
    event.preventDefault();
    // const newStyle = {
    //   borderTop: '3px solid Highlight',
    //   marginTop: '-3px',
    // };
    // if (Object.keys(style).length === 0) { // currently empty
    //   setStyle(newStyle);
    // }
  }

  const handleDragEnter = () => {
    // highlight!
    const newStyle = {
      borderTop: '3px solid Highlight',
      marginTop: '-3px',
    };

    console.log(`Entering page ${title}`)

    if (Object.keys(style).length === 0) { // currently empty
      setStyle(newStyle);
    }
      
  }

  const handleDragLeave = () => {
    console.log(`Possibly leaving page ${title}`)
    if (props.isDragLeaveReal(id)) {
      // returns true if it's really leaving
      setStyle({});
    }
  }

  const handleDrop = () => {
    // setStyle({});
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