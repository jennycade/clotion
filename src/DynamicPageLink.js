import { useState, useEffect } from 'react';

// database
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase/db';


import PageLink from "./PageLink";

const DynamicPageLink = (props) => {
  // props
  const { id } = props;

  // state
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('');

  //////////////////////////////
  // NO DATA -> FETCH FROM DB //
  //////////////////////////////

  useEffect( () => {
    const unsub = onSnapshot(doc(db, 'pages', id), (doc) => {
      setTitle(doc.data().title);
      setIcon(doc.data().icon);
    });
    return unsub;
  }, [id]);

  return (
    <PageLink
      id={id}
      title={title}
      icon={icon}
      draggable={false}
      style={{ userSelect: "none" }} // for SlateJS
      contentEditable={false}
      {...props.attributes}
    >
    </PageLink>
  );
}

export default DynamicPageLink;