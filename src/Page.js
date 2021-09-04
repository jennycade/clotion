import { useState, useEffect, useContext } from 'react';

import './Page.css';

import Content from './Content';
import { DbContext } from './fakedb';

const Page = ( props ) => {
  // props
  const { id } = props;

  // state
  const [page, setPage] = useState({});
  const [content, setContent] = useState('');

  // db
  const db = useContext(DbContext);

  // get page info/content
  useEffect( () => {
    db.getPage(id)
      .then((page) => {
        setPage(page);
        setContent(page.content);
      })
      .catch((error) => {
        console.error(`Error retreiving page: ${error}`);
      });

  }, [id, db]);

  // input
  const handleContentChange = ( event ) => {
    const newVal = event.target.value;
    setContent(newVal);
  }

  return (
    <div className="page">
      <h1 className="pageTitle">{ page.title }</h1>
      <div className="pageIcon">{ page.icon }</div>
      <div className="contentArea">
        <Content handleContentChange={ handleContentChange } content={ content } />
      </div>
    </div>
  );
}

export default Page;