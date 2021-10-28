import { useState, useEffect } from 'react';

import { doc, collection, onSnapshot, updateDoc, deleteDoc, query, where, orderBy, } from 'firebase/firestore';
import { db } from './firebase/db';

import './Page.css';

import Content from './Content';
import EmojiPicker from './EmojiPicker';
import PageLink from './PageLink';
import LiveBlock from './LiveBlock';

const Page = ( props ) => {
  // props
  const { uid, id, addPage, redirectToPage } = props;

  // state
  const [page, setPage] = useState({title: null, id: null, icon: null});
  const [subPages, setSubPages] = useState([]);
  const [docRef, setDocRef] = useState({});
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [blocks, setBlocks] = useState([]);

  // get page object
  useEffect( () => {
    const unsub = onSnapshot(doc(db, 'pages', id), (doc) => {
      setPage(doc.data());
    });
    return unsub;
  }, [id]);

  // get the docRef from firestore
  useEffect(() => {
    setDocRef(doc(db, 'pages', id));
  }, [id]);

  //////////////
  // SUBPAGES //
  //////////////

  const handleAddPage = () => {
    // add page
    const newPageId = addPage(id);

    // redirect router to new page
    // SHOULDN'T NEED TO DO THIS -- App.addPage() already redirects
    // redirectToPage(newPageId);

    // return the new id
    return newPageId;
  }

  ////////////
  // BLOCKS //
  ////////////

  useEffect(() => {
    if (uid !== '') {
      const blocksRef = collection(db, 'pages', id, 'blocks');
      const blocksQuery = query(blocksRef, where('uid', '==', uid), orderBy('order'));
      const unsub = onSnapshot(blocksQuery, (blocksSnapshot) => {
        const newBlocks = [];
        blocksSnapshot.forEach((doc) => {
          const newBlock = {id: doc.id, ...doc.data()}
          newBlocks.push(newBlock);
        });
        setBlocks(newBlocks);
      })
      return unsub;
    }
  }, [uid, id]);

  const updateBlock = (blockId, newContent) => {
    // update db
    const blockRef = doc(db, 'pages', id, 'blocks', blockId);
    updateDoc(blockRef, {
      content: newContent,
    });

    // update state
    const newBlocks = [...blocks]; // does it matter that this is a shallow copy?
    const index = blocks.findIndex(block => block.id === blockId);
    const newBlock = {...blocks[index]};
    newBlock.content = newContent;
    newBlocks.splice(index, 1, newBlock);
    setBlocks(newBlocks);
  }


  ///////////
  // TITLE //
  ///////////

  const handleTitleChange = ( event ) => {
    const newVal = event.target.value;
    const oldPage = {...page};
    oldPage.title = newVal;

    setPage(oldPage);
  }

  // save changes to db
  const updateTitle = () => {
    updateDoc(docRef, {
      title: page.title,
    });
  }

  //////////
  // ICON //
  //////////
  const updateIcon = ( newIcon ) => {
    updateDoc(docRef, {
      icon: newIcon,
    });
  }

  const handleIconClick = ( newIcon ) => {
    updateIcon(newIcon);
    setShowIconPicker(false);
  }

  ////////////
  // DELETE //
  ////////////
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
          {blocks.map(block => (
            <LiveBlock
              key={block.id}
              id={block.id}
              content={block.content}
              updateContent={ updateBlock }
              addPage={ handleAddPage }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;