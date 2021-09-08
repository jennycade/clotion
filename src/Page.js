import { useState, useEffect, useContext } from 'react';

import './Page.css';

import Content from './Content';
import { DbContext } from './fakedb';

const Page = ( props ) => {
  // props
  const { id, updatePages } = props;

  // state
  const [page, setPage] = useState({title: null, id: null, content: null, icon: null});
  // const [content, setContent] = useState('');

  // db
  const db = useContext(DbContext);

  // get page info/content
  useEffect( () => {
    db.getPage(id)
      .then((page) => {
        setPage(page);
        // setContent(page.content);
      })
      .catch((error) => {
        console.error(`Error retreiving page: ${error}`);
      });

  }, [id, db]);

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
    // send to db
    db.updateContent(id, page.content)
      .then(() => {
        // get content from the db (?)
        return db.getPage(id);
      })
      .then((pageData) => {
        setPage(pageData);
      })
      .catch((error) => {
        console.error(`Error saving page data: ${error}`);
      });
  }
  const updateTitle = () => {
    // send to db
    db.updateTitle(id, page.title)
      .then(() => {
        // get content from the db (?)
        return db.getPage(id);
      })
      .then((pageData) => {
        setPage(pageData);
        // tell the App to refresh
        updatePages();
      })
      .catch((error) => {
        console.error(`Error saving page data: ${error}`);
      });
  }
  const updateIcon = () => {
    // send to db
    db.updateIcon(id, page.icon)
      .then(() => {
        // tell the App to refresh
        updatePages();
        // get content from the db (?)
        return db.getPage(id);
      })
      .then((pageData) => {
        setPage(pageData);
      })
      .catch((error) => {
        console.error(`Error saving page data: ${error}`);
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