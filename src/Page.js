import { useState, useEffect } from 'react';

import { doc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase/db';

import './Page.css';

import Content from './Content';
import EmojiPicker from './EmojiPicker';
import PageLink from './PageLink';
import Block from './Block';
import LiveBlock from './LiveBlock';

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

  const updateContent = ( newContent ) => {
    // save state
    const newPage = {...page};
    newPage.content = newContent;
    setPage(newPage);

    // save to firebase
    updateDoc(docRef, {
      content: newContent,
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

  const deletePage = () => {
    deleteDoc(docRef);
  }

  return (
    <div className="pageContainer">
      <nav>
        <PageLink id={ id } title={ page.title } icon={ page.icon } />
        <button onClick={ deletePage } className="subtleButton">Delete</button>
      </nav>
      
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

          <LiveBlock handleContentChange={ handleContentChange } updateContent={ updateContent } textContent={ page.content } />

          {/* <Block handleContentChange={ handleContentChange } updateContent={ updateContent } content={ page.content }>
          </Block> */}
      
        </div>
      </div>
    </div>
  );
}

export default Page;