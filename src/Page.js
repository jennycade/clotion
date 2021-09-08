import { useState, useEffect, useContext } from 'react';

import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

import './Page.css';

import Content from './Content';

import { db } from './firebase/db';

const Page = ( props ) => {
  // props
  const { id, updatePages } = props;

  // state
  const [page, setPage] = useState({title: null, id: null, content: null, icon: null});
  const [docRef, setDocRef] = useState({});

  // get page info/content
  useEffect( () => {
    const unsub = onSnapshot(doc(db, 'pages', id), (doc) => {
      setPage(doc.data());
    });
    return unsub;
  }, [id]);

  // get the docRef from firestore
  useEffect(() => {
    setDocRef(doc(db, 'pages', id));
  }, [id])

  // input
  const handleContentChange = ( event ) => {
    const newVal = event.target.value;
    const oldPage = {...page};
    oldPage.content = newVal;

    setPage(oldPage);
    // setContent(newVal);
  }
  const handleTitleChange = ( event ) => {
    const newVal = event.target.value;
    const oldPage = {...page};
    oldPage.title = newVal;

    setPage(oldPage);
    // setContent(newVal);
  }

  // save changes to db

  const updateContent = () => {
    updateDoc(docRef, {
      content: page.content,
    });
  }
  const updateTitle = () => {
    updateDoc(docRef, {
      title: page.title,
    });
  }
  const updateIcon = () => {
    updateDoc(docRef, {
      icon: page.icon,
    });
  }

  return (
    <div className="page">
      
      <Content handleContentChange={ handleTitleChange } updateContent={ updateTitle } content={ page.title }>
        <h1 className="pageTitle">{ page.title }</h1>
      </Content>
      <div className="pageIcon">{ page.icon }</div>
      <div className="contentArea">
        <Content handleContentChange={ handleContentChange } updateContent={ updateContent } content={ page.content }>
          <div className="content">{ page.content }</div>
        </Content>
      </div>
    </div>
  );
}

export default Page;