import { useState, useEffect } from 'react';

import {
    doc, collection,
    onSnapshot,
    addDoc, updateDoc, setDoc,
    query, where, orderBy,
    writeBatch,
    deleteField, arrayRemove, arrayUnion,
} from 'firebase/firestore';
import { db } from './firebase/db';

import { convertEntry, convertValue, getDefaultEntry } from './databaseFunctions';

import './Page.css';

import emojiDb from './emoji.json';

import Breadcrumb from './Breadcrumb';
import Content from './Content';
import EmojiPicker from './EmojiPicker';
import LiveBlock from './LiveBlock';
import Warning from './Warning';
import Database from './Database';
import { generateUniqueString, } from './helpers';

const Page = ( props ) => {
  // props
  const {
    uid, id, addPage, redirect, getLineage, deletePage, addDatabase,
    updateFavicon, updatePageTitle,
  } = props;

  // state
  const [page, setPage] = useState({title: null, id: null, icon: null, isDb: false});
  const [lineage, setLineage] = useState([]);
  const [docRef, setDocRef] = useState({});
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [warning, setWarning] = useState(false);
  const [rows, setRows] = useState([]);
  const [row, setRow] = useState([{}]);
  const [dbPages, setDbPages] = useState([]);
  const [parentDbPage, setParentDbPage] = useState({});
  const [parentDbRows, setParentDbRows] = useState([]);

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
  }, [page, getLineage]);

  // set favicon and title
  useEffect(() => {
    if (page.icon) {
      updateFavicon(page.icon);
    } else {
      updateFavicon('🧬'); // default
    }

    if (page.title !== '') {
      updatePageTitle(page.title);
    } else {
      updatePageTitle('Untitled');
    }

  }, [page, updateFavicon, updatePageTitle]);

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

  const handleDBRowChange = ( payload, rowPageID, fieldID, page, rows, setRows ) => {
    // get field type
    const type = page.properties[fieldID].type;
    
    // data validation/conversion
    let newVal;
    if (type === 'checkbox') {
      newVal = convertEntry(payload.target.checked, 'checkbox');
    } else if (type === 'select' || type === 'multiselect') {
      newVal = payload;
    } else {
      newVal = convertEntry(payload.target.value, type);
    }

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
  const updateDBRow = async (rowPageID, fieldID, page, rows, overrideVal = null) => {
    // revalidate certain fields
    const revalidateFields = ['number', 'date'];
    
    // get field type
    const type = page.properties[fieldID].type;

    let docRef, updateObj;

    if (type === 'title') {
      // title isn't stored in the `rows` collection -- update in the page
      const newVal = dbPages[rowPageID].title;
      docRef = doc(db, 'pages', rowPageID);
      updateObj = { title: newVal };
    } else {
      let newVal;
      if (overrideVal !== null) {
        newVal = overrideVal;
      } else {
        // new value from state
        newVal = rows.find(row => row.id === rowPageID)[fieldID];
      }
      
      // re-validate?
      if (revalidateFields.includes(type)) {
        newVal = convertEntry(
          newVal,
          type,
          true
        );
      }

      docRef = doc(db, 'pages', page.id, 'rows', rowPageID);
      updateObj = {}
      updateObj[fieldID] = newVal;
    }
    // update firebase
    await updateDoc(docRef, updateObj);
  }

  const handleClickChange = async (payload, rowPageID, fieldID, page, rows, setRows) => {
    // for click events, where onChange triggers simultaneous state change and firestore database change

    // get field type
    const type = page.properties[fieldID].type;

    let newVal;
    // get value
    if (type === 'checkbox') {
      newVal = convertEntry(payload.target.checked, 'checkbox');
    } else if (type === 'select' || type === 'multiselect') {
      newVal = payload;
    }
    else {
      newVal = convertEntry(payload.target.value, type);
    }

    // update firestore
    await updateDBRow(rowPageID, fieldID, page, rows, newVal);

    // update state
    handleDBRowChange(payload, rowPageID, fieldID, page, rows, setRows);
  }

  const addSelectOption = async (displayName, fieldID, page) => {
    // generate ID
    const currentIDs = Object.keys(
      page.properties[fieldID].selectOptions
    );
    const newID = generateUniqueString(currentIDs);

    // add doc to page/fieldID/props with default settings
    const newOptions = {
      ...page.properties[fieldID].selectOptions,
      [newID]: {
        color: 'gray',
        displayName,
        sortOrder: 0, // fix this TODO
      }
    };
    
    await updateDoc(
      doc(db, 'pages', page.id),
      `properties.${fieldID}.selectOptions`,
      newOptions,
    );

    return newID;
  }

  const updateSelectOption = async (newVal, updateType, selectOptionID, fieldID, page) => {

    const VALID_UPDATES = ['displayName', 'color', 'sortOrder'];
    if (!VALID_UPDATES.includes(updateType)) {
      throw new Error(`updateSelectOption() doesn't know how to handle updateType ${updateType}`);
    }

    // update database
    await updateDoc(
      doc(db, 'pages', page.id),
      `properties.${fieldID}.selectOptions.${selectOptionID}.${updateType}`,
      newVal
    );
  }

  const deleteSelectOption = async (selectOptionID, fieldID, rows, page) => {
    // batch for simultaneous db changes
    const batch = writeBatch(db);

    // remove from database selectOptions
    batch.update(
      doc(db, 'pages', page.id),
      `properties.${fieldID}.selectOptions.${selectOptionID}`,
      deleteField()
    );

    // remove from each row that has the selectOption
    rows.forEach(row => {
      if (Array.isArray(row[fieldID]) && row[fieldID].includes(selectOptionID)) {
        // remove it
        batch.update(
          doc(db, 'pages', page.id, 'rows', row.id),
          {
            [fieldID]: arrayRemove(selectOptionID),
          }
        )
      }
    });

    // commit batch
    await batch.commit();
  }

  const handleDBPropNameChange = async (newName, fieldID, page) => {
    // shallow copy page
    const pageCopy = {...page};
    // update the name
    page.properties[fieldID].displayName = newName;
    // set state
    setPage(pageCopy);
  }

  const updateDBPropName = async (newName, fieldID, dbPage) => {
    const docRef = doc(db, 'pages', dbPage.id);
    // construct firebase field with dot notation
    const fieldStr = `properties.${fieldID}.displayName`;
    const updateObj = {
      [fieldStr]: newName,
    };
    await updateDoc(docRef, updateObj);
  }

  const updateDBPropType = async (newType, fieldID, dbPage, dbRows) => {
    const oldType = dbPage.properties[fieldID].type;
    const ARRAYTYPES = ['select', 'multiselect'];

    // update firestore
    const batch = writeBatch(db);

    // convert dbPage.property
    const pageRef = doc(db, 'pages', dbPage.id);
    const propTypeStr = `properties.${fieldID}.type`;
    const propTypeUpdateObj = {
      [propTypeStr]: newType,
    };
    batch.update(pageRef, propTypeUpdateObj);

    // convert row values

    // look up selectOptions for converting from array
    let selectOptions;
    if (ARRAYTYPES.includes(oldType)) {
      // call convertValue with selectOptions
      selectOptions = dbPage.properties[fieldID].selectOptions;
    }

    // for non-array -> array, but need in this scope
    const allDisplayNames = {};
    // non-array -> array
    if ((!ARRAYTYPES.includes(oldType)) && ARRAYTYPES.includes(newType)) {
      // check for number of new selectOptions! Don't make multiples!
      if (!oldType.includes(ARRAYTYPES)) {
        // converting from non-selectOption field
        
        // 1. look up selectOptions - always exists and may have values if 
        // field was once select or multiselect
        selectOptions = dbPage.properties[fieldID].selectOptions;

        // 2. get new row field values
        const allNewValues = [];
        dbRows.forEach(row => {
          const newVal = convertValue(row[fieldID], oldType, newType);
          allNewValues.push(newVal);
        });
        // flatten & remove duplicates
        const newValues = [...new Set(allNewValues.flat())];

        // 3. list displayNames from selectOptions
        
        /*
        obj allDisplayNames = {
          displayName1: id1,
          displayName2: id2,
          ...
        }
        */
        for (const [selectOptionID, selectOptionObj] of Object.entries(selectOptions)) {
          allDisplayNames[selectOptionObj.displayName] = selectOptionID;
        }

        // 4. compare existing selectOptions' displayNames to new values
        newValues.forEach(val => {
          if (!(val in allDisplayNames)) {
            // no match: create new selectOption & add reference object
            const id = generateUniqueString(Object.keys(selectOptions));
            selectOptions[id] = {
              color: 'gray',
              sortOrder: 0,
              displayName: val,
            }
            // add to allDisplayNames
            allDisplayNames[val] = id;
          }
        });

        // 6. update selectOptions in firebase (replace entire map)
        const pageRef = doc(db, 'pages', dbPage.id);
        const propTypeStr = `properties.${fieldID}.selectOptions`;
        batch.update(pageRef, propTypeStr, selectOptions);

        // 5. convert arrays of displayNames to selectOptionIDs &
        // update firebase
        // 
        // this happens in the next block

      }
    }
    
    dbRows.forEach(row => {
      // convert to new value for new type
      let newVal = convertValue(row[fieldID], oldType, newType, selectOptions);
      // replace displayNames with ids for non-array -> array
      if ((!ARRAYTYPES.includes(oldType)) && ARRAYTYPES.includes(newType)) {
        const temp = newVal.map(displayName => allDisplayNames[displayName]);
        newVal = temp;
      }
      
      // add update do batch
      const rowRef = doc(db, 'pages', dbPage.id, 'rows', row.id);
      const updateObj = {
        [fieldID]: newVal,
      };
      batch.update(rowRef, updateObj);

    });
    
    // commit the batch
    await batch.commit();
  }

  const addProperty = async (dbPage, dbRows) => {
    // batch for simultaneous updates
    const batch = writeBatch(db);

    // 1. add blank text property to page.properties

    // get existing IDs to make unique ID
    const existingIDs = Object.keys(dbPage.properties);
    const newID = generateUniqueString(existingIDs);
    // new property object
    const newFieldObj = {
      displayName: 'Column', // TODO to be fancy: 'Column 1' if 'Column' exists, 'Column 2' if both exist, etc.
      type: 'text',
      sortOrder: 0 // TODO make this a thing
    };
    // add to database
    batch.update(
      doc(db, 'pages', dbPage.id),
      `properties.${newID}`,
      newFieldObj
    );

    // 2. add field to each rows
    dbRows.forEach(row => {
      batch.update(
        doc(db, 'pages', dbPage.id, 'rows', row.id),
        newID,
        '',
      ) 
    });

    // 3. add to all views!
    for (const [viewID, viewObj] of Object.entries(dbPage.views)) {
      // skip activeView
      if (!(viewID === 'activeView')) {
        // add to database
        batch.update(
          doc(db, 'pages', dbPage.id),
          `views.${viewID}.visibleProperties`,
          arrayUnion(newID)
        );
      }
    }

    // commit batch
    await batch.commit();
  }

  const deleteProperty = async (fieldID, dbPage, dbRows) => {
    // batch for simultaneous updates
    const batch = writeBatch(db);

    // 1. Remove property from page.properties
    batch.update(
      doc(db, 'pages', dbPage.id),
      `properties.${fieldID}`,
      deleteField()
    );

    // 2. remove field from each row
    dbRows.forEach(row => {
      batch.update(
        doc(db, 'pages', dbPage.id, 'rows', row.id),
        fieldID,
        deleteField(),
      ) 
    });

    // 3. remove from all views!
    for (const [viewID, viewObj] of Object.entries(dbPage.views)) {
      // skip activeView
      if (!(viewID === 'activeView')) {
        // add to database
        batch.update(
          doc(db, 'pages', dbPage.id),
          `views.${viewID}.visibleProperties`,
          arrayRemove(fieldID)
        );
      }
    }

    // commit batch
    await batch.commit();
  }

  const addDBRow = async (dbPage, fields = null) => {
    // add page first so we have a page ID!
    const newRowID = await addPage(dbPage.id, true);

    // construct row object
    const newRow = {
      uid: uid,
    };
    // add default value for each property
    for (const [propID, propObj] of Object.entries(dbPage.properties)) {
      if (propID !== 'title') {
        newRow[propID] = getDefaultEntry(propObj.type);
      }
    }

    if (fields) {
      // merge in
      Object.assign(newRow, fields);
    }

    // add to rows collection
    await setDoc(
      doc(collection(db, 'pages', dbPage.id, 'rows'), newRowID),
      newRow
    );

  }

  // views

  const addView = async (dbPage, dbRows, viewType) => {
    console.log(`addView() isn't written yet, silly goose!`);
  }

  const updateViewName = async (newName, viewID, dbPage) => {
    console.log(`updateViewName() isn't written yet, silly goose!`);
  }

  const switchView = async (dbPage, newViewID) => {
    console.log(`switchView() isn't written yet, silly goose!`);
  }

  const deleteView = async (dbPage, viewID) => {
    console.log(`deleteView() isn't written yet, silly goose!`);
  }

  const updatePropertyVisibility = async (action, propID, viewID, dbPage) => {
    console.log(`addVisibleProperty() isn't written yet, silly goose!`);
    // action: 'add' or 'remove'
  }

  // column actions (table and single page)
  const handleColumnAction = async (action, fieldID, dbPage, dbRows) => {
    switch (action) {
      case 'delete':
        await deleteProperty(fieldID, dbPage, dbRows);
        break;
      
      default:
        throw new Error(`handleColumnAction() doens't know how to handle action ${action}`);
    }
  }




  ///////////////////
  // DATABASE PAGE //
  ///////////////////

  // database page: get row info
  useEffect(() => {
    if (uid !== '' && page.parentDb && page.parentDb !== '') {

      // get the row
      const unsub = onSnapshot(doc(db, 'pages', page.parentDb, 'rows', id), (doc) => {
        setRow([{id: doc.id, ...doc.data()}]);
      });
      return unsub;
    }
  }, [uid, id, page]);

  // get parent db info
  useEffect(() => {
    if (uid !== '' && page.parentDb && page.parentDb !== '') {
      // get the parent page
      const unsub = onSnapshot(doc(db, 'pages', page.parentDb), (doc) => {
        setParentDbPage({id: doc.id, ...doc.data()});
      });
      return unsub;
    }
  }, [uid, id, page]);

  // get parent db rows
  useEffect(() => {
    if (uid !== '' && page.parentDb && page.parentDb !== '') {
      const rowsRef = collection(db, 'pages', page.parentDb, 'rows');
      const rowsQuery = query(rowsRef, where('uid', '==', uid));

      const unsub = onSnapshot(rowsQuery, (rowsSnapshot) => {
        const newRows = [];
        rowsSnapshot.forEach((doc) => {
          const newBlock = {id: doc.id, ...doc.data()}
          newRows.push(newBlock);
        });
        setParentDbRows(newRows);
      });
      return unsub;
    }
  }, [page.parentDb, uid]);

  let headers;

  if (page.parentDb && Object.keys(parentDbPage).length > 0 && Object.keys(row[0]).length > 0) {
    // make single version of Database props
    const singleDbPage = {};
    singleDbPage[id] = page;

    headers = (
      <Database
        page={parentDbPage}
        rows={row}
        dbPages={singleDbPage}
        dbDisplay='header'
        // hanlders
        // rows
        handleDBRowChange={ (event, rowPageID, fieldID) => handleDBRowChange(event, rowPageID, fieldID, parentDbPage, row, setRow) }
        updateDBRow={ (rowPageID, fieldID, overrideVal = null) => updateDBRow(rowPageID, fieldID, parentDbPage, row, overrideVal) }
        handleClickChange={ (payload, rowPageID, fieldID) => handleClickChange(payload, rowPageID, fieldID, parentDbPage, row, setRow) }
        // selectOptions
        addSelectOption={ (propID, displayName) => addSelectOption(displayName, propID, parentDbPage)}
        updateSelectOption={ (newVal, type, selectOptionID, fieldID) => updateSelectOption(newVal, type, selectOptionID, fieldID, page) }
        deleteSelectOption={ (selectOptionID, fieldID) => deleteSelectOption(selectOptionID, fieldID, parentDbRows, parentDbPage) }
        // database property updates
        handleDBPropNameChange={(newName, fieldID) => handleDBPropNameChange(newName, fieldID, parentDbPage)}
        updateDBPropName={(newName, fieldID) => updateDBPropName(newName, fieldID, parentDbPage)}
        updateDBPropType={(newType, fieldID) => updateDBPropType(newType, fieldID, parentDbPage, parentDbRows)}
        // add property
        addProperty={() => addProperty(parentDbPage, parentDbRows)}
        // column actions
        handleColumnAction={(action, fieldID) => handleColumnAction(action, fieldID, parentDbPage, parentDbRows)}
      />
    );
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
          
        {/* TITLE */}
        <h1 className='pageTitle'>
          <Content
            element='title'
            handleContentChange={ handleTitleChange }
            updateContent={ updateTitle }
            content={ page.title }
          >
            { (page.title === 'Untitled' || page.title === '') &&
              <span className="titlePlaceholder">Untitled</span>
            }
            { page.title !== 'Untitled' &&
              <span>{ page.title }</span>
            }
          </Content>
        </h1>

        { headers }
        
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
                onClick={ () => addDatabase(id, 'table') }
              >Table</button>
              <button className='linklike'
                onClick={ () => addDatabase(id, 'board')}
              >Board</button>
              <button className='linklike'
                onClick={ () => addDatabase(id, 'list')}
              >List</button>
              <button className='linklike'
                onClick={ () => addDatabase(id, 'gallery')}
              >Gallery</button>
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
              dbDisplay={false}
              page={page}
              rows={rows}
              dbPages={dbPages}
              // row changes
              handleDBRowChange={ (event, rowPageID, fieldID) => handleDBRowChange(event, rowPageID, fieldID, page, rows, setRows) }
              updateDBRow={ (rowPageID, fieldID, overrideVal=null) => updateDBRow(rowPageID, fieldID, page, rows, overrideVal) }
              handleClickChange={ (payload, rowPageID, fieldID) => handleClickChange(payload, rowPageID, fieldID, page, rows, setRows) }
              // selectOption
              addSelectOption={ (propID, displayName) => addSelectOption(displayName, propID, page)}
              updateSelectOption={ (newVal, type, selectOptionID, fieldID) => updateSelectOption(newVal, type, selectOptionID, fieldID, page) }
              deleteSelectOption={ (selectOptionID, fieldID) => deleteSelectOption(selectOptionID, fieldID, rows, page) }
              // property changes
              handleDBPropNameChange={(newName, fieldID) => handleDBPropNameChange(newName, fieldID, page)}
              updateDBPropName={(newName, fieldID) => updateDBPropName(newName, fieldID, page)}
              updateDBPropType={(newType, fieldID) => updateDBPropType(newType, fieldID, page, rows)}
              // add property
              addProperty={() => addProperty(page, rows)}
              // column actions
              handleColumnAction={(action, fieldID) => handleColumnAction(action, fieldID, page, rows)}
              // add row
              addDBRow={(fields) => addDBRow(page, fields)}
              // views
              addView={(viewType) => addView(page, rows, viewType)}
              switchView={(newViewID) => switchView(page, newViewID)}
              updateViewName={(newName, viewID) => updateViewName(newName, viewID, page)}
              deleteView={(viewID) => deleteView(page, viewID)}
              updatePropertyVisibility={(action, propID, viewID) => updatePropertyVisibility(action, propID, viewID, page)}
            />
          }

        </div>
      </div>
    </div>
  );
}

export default Page;