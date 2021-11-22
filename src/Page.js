import { useState, useEffect } from 'react';

import { doc, collection, onSnapshot, addDoc, updateDoc, deleteDoc, query, where, orderBy, } from 'firebase/firestore';
import { db } from './firebase/db';

import { convertEntry } from './databaseFunctions';

import './Page.css';

import emojiDb from './emoji.json';

import Breadcrumb from './Breadcrumb';
import Content from './Content';
import EmojiPicker from './EmojiPicker';
import LiveBlock from './LiveBlock';
import Warning from './Warning';
import Database from './Database';

const Page = ( props ) => {
  // props
  const { uid, id, addPage, redirect, getLineage, deletePage, addDatabase } = props;

  // state
  const [page, setPage] = useState({title: null, id: null, icon: null, isDb: false});
  const [lineage, setLineage] = useState([]);
  const [docRef, setDocRef] = useState({});
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [warning, setWarning] = useState(false);
  const [rows, setRows] = useState([]);
  const [dbPages, setDbPages] = useState([]);

  // get page object
  useEffect( () => {
    const unsub = onSnapshot(doc(db, 'pages', id), (doc) => {
      setPage({id: doc.id, ...doc.data()});
    });
    return unsub;
  }, [id]);

  // get the docRef from firestore
  useEffect(() => {
    setDocRef(doc(db, 'pages', id));
  }, [id]);

  // set the lineage once the page is set
  useEffect(() => {
    if (page.parent) {
      setLineage(getLineage(page));
    }
  }, [page]);

  //////////////////////////
  // BLANK PAGE TEMPLATES //
  //////////////////////////

  const handleEmptyPageClick = () => {
    addBlocks();
  }

  const handleEmptyWithIconPageClick = () => {
    chooseRandomIcon();
    addBlocks();
  }

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

  const addBlocks = () => {
    const newBlock = {
      uid: uid,
      order: 1,
      content: JSON.stringify([{type: 'paragraph', children:[{text: ''}]}])
    };
    addDoc(collection(db, 'pages', id, 'blocks'), newBlock);
  }

  // get blocks
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

  const chooseRandomIcon = () => {
    // choose random icon
    const n = Math.floor(Math.random() * emojiDb.length);
    const randomEmoji = emojiDb[n]['emoji'];
    // assign it
    updateIcon(randomEmoji);
  }

  ////////////
  // DELETE //
  ////////////

  const handleClickDelete = () => {
    const newWarning = {
      text: 'Are you sure you want to delete this page and all sub-pages permanently?',
      continueText: 'Yes, Delete this page',
      continueFunction: deletePage,
      cancelText: 'Cancel',
    };

    setWarning(newWarning);
  }

  ///////////////
  // DATABASES //
  ///////////////

  // get rows
  useEffect(() => {
    if (uid !== '' && page.isDb) {
      const rowsRef = collection(db, 'pages', id, 'rows');
      const rowsQuery = query(rowsRef, where('uid', '==', uid));

      const unsub = onSnapshot(rowsQuery, (rowsSnapshot) => {
        const newRows = [];
        rowsSnapshot.forEach((doc) => {
          const newBlock = {id: doc.id, ...doc.data()}
          newRows.push(newBlock);
        });
        setRows(newRows);
      });
      return unsub;
    }
  }, [uid, id, page]);

  // get page info from db rows
  useEffect(() => {
    if (uid !== '' && page.isDb) {
      const pagesRef = collection(db, 'pages');

      // find pages for rows in this database
      const pagesQuery = query(
        pagesRef,
        where('uid', '==', uid),
        where('parentDb', '==', id)
      );

      const unsub = onSnapshot(pagesQuery, (pagesSnapshot) => {
        const newDbPages = {};
        pagesSnapshot.forEach((doc) => {
          newDbPages[doc.id] = {...doc.data()};
        });
        setDbPages(newDbPages);
      });

      return unsub;
    }
  }, [uid, id, page]);

  const handleDBRowChange = ( event, rowPageID, fieldID ) => {
    // get field type
    const type = page.properties[fieldID].type;
    
    // data validation/conversion
    const newVal = convertEntry(event.target.value, type);

    if (type === 'title') {
      // update dbPages
      // shallow copy
      const oldDbPages = {...dbPages};
      // shallow copy THE page
      const oldDbPage = {...oldDbPages[rowPageID]};
      // update it
      oldDbPage.title = newVal;
      // stick it back in
      oldDbPages[rowPageID] = oldDbPage;

      setDbPages(oldDbPages);
    }
    else {
      // shallow copy rows
      const oldRows = [...rows];
      // shallow copy THE row
      const oldRowIndex = rows.findIndex(row => row.id === rowPageID);
      const oldRow = {...oldRows[oldRowIndex]};
      // update it
      oldRow[fieldID] = newVal;
      // stick it back in
      oldRows[oldRowIndex] = oldRow;

      setRows(oldRows);
    }
  }

  // editing DBs
  const updateDBRow = async (rowPageID, fieldID) => {
    // revalidate certain fields
    const revalidateFields = ['number'];
    
    // get field type
    const type = page.properties[fieldID].type;

    let docRef, updateObj;

    if (type === 'title') {
      // title isn't stored in the `rows` collection -- update in the page
      const newVal = dbPages[rowPageID].title;
      docRef = doc(db, 'pages', rowPageID);
      updateObj = { title: newVal };
    } else {
      // new value from state
      let newVal = rows.find(row => row.id === rowPageID)[fieldID];

      // re-validate?
      if (revalidateFields.includes(type)) {
        newVal = convertEntry(
          newVal,
          type,
          true
        );
      }

      docRef = doc(db, 'pages', id, 'rows', rowPageID);
      updateObj = {}
      updateObj[fieldID] = newVal;
    }
    // update firebase
    await updateDoc(docRef, updateObj);
  }

  ////////////
  // RENDER //
  ////////////

  return (
    <div className="pageContainer">
      { warning &&
        <Warning
          text={warning.text}
          continueText={warning.continueText}
          continueFunction={warning.continueFunction}
          cancelText={warning.cancelText}
          cancelFunction={ () => setWarning(false) }
        />
      }
      <nav>
        <Breadcrumb lineage={lineage} page={page} />
        <button onClick={ handleClickDelete } className="subtleButton">Delete</button>
      </nav>
      
      <div className="page">

        { showIconPicker && <EmojiPicker exit={ () => setShowIconPicker(false) } handleIconClick={ handleIconClick } /> }
        { page.icon === '' && 
          <button className="subtleButton" onClick={ () => setShowIconPicker(true) }>☺ Add icon</button>
        }
        <div className="pageIcon linklike" onClick={ () => setShowIconPicker(true) }>{ page.icon }</div>
          
        <Content
          element='h1'
          handleContentChange={ handleTitleChange }
          updateContent={ updateTitle }
          content={ page.title }
        >
          { page.title === 'Untitled' &&
            <h1 className="pageTitle titlePlaceholder">Untitled</h1>
          }
          { page.title !== 'Untitled' &&
            <h1 className="pageTitle">{ page.title }</h1>
          }
        </Content>

        
        
        <div className="contentArea">

          {/* NEW PAGE MENU */}
          { blocks.length === 0 && !page.isDb &&
            <div className="newPageMenu">
              <p>Press Enter to continue with an empty page, or pick a template (click to select)</p>
              
              <button className='linklike'
                onClick={handleEmptyWithIconPageClick}
              >
                Empty with icon
              </button>
              <button className='linklike'
                onClick={handleEmptyPageClick}
              >
                Empty
              </button>
        
              <h2>DATABASE</h2>
              <button className='linklike'
                onClick={ () => addDatabase(id) }
              >Table</button>
              <button className='linklike'>Board</button>
              <button className='linklike'>List</button>
              <button className='linklike'>Gallery</button>
            </div>
          }

          {/* SLATE LIVEBLOCKS */}
          {blocks.map(block => (
            <LiveBlock
              key={block.id}
              id={block.id}
              content={block.content}
              updateContent={ updateBlock }
              addPage={ handleAddPage }
              redirect={ redirect }
            />
          ))}

          {/* DATABASES */}
          { page.isDb && page.views &&
            <Database
              page={page}
              rows={rows}
              dbPages={dbPages}
              handleDBRowChange={handleDBRowChange}
              updateDBRow={updateDBRow}
            />
          }

        </div>
      </div>
    </div>
  );
}

export default Page;