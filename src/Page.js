import { useState, useEffect } from 'react';

import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

import './Page.css';

import Content from './Content';
import EmojiPicker from './EmojiPicker';

import { db } from './firebase/db';

const Page = ( props ) => {
  // props
  const { id } = props;

  // state
  const [page, setPage] = useState({title: null, id: null, content: null, icon: null});
  const [docRef, setDocRef] = useState({});
  const [showIconPicker, setShowIconPicker] = useState(false);

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
  const updateIcon = ( newIcon ) => {
    updateDoc(docRef, {
      icon: newIcon,
    });
  }

  const handleIconClick = ( newIcon ) => {
    updateIcon(newIcon);
    setShowIconPicker(false);
  }

  return (
    <div className="page">

    { showIconPicker && <EmojiPicker exit={ () => setShowIconPicker(false) } handleIconClick={ handleIconClick } /> }
    { page.icon === '' && 
      <button className="subtleButton" onClick={ () => setShowIconPicker(true) }>☺ Add icon</button>
    }
    <div className="pageIcon linklike" onClick={ () => setShowIconPicker(true) }>{ page.icon }</div>
      
      <Content element='h1' handleContentChange={ handleTitleChange } updateContent={ updateTitle } content={ page.title }>
        { page.title === 'Untitled' && <h1 className="pageTitle titlePlaceholder">Untitled</h1>}
        { page.title !== 'Untitled' && <h1 className="pageTitle">{ page.title }</h1>}
      </Content>

      
      
      <div className="contentArea">
        <Content element='div' handleContentChange={ handleContentChange } updateContent={ updateContent } content={ page.content }>
          { page.content === '' && <div className="content placeholder">Press Enter to continue with an empty page.</div> }
          { page.content !== '' && <div className="content">{ page.content }</div> }
        </Content>
      </div>
    </div>
  );
}

export default Page;