import { useState, useEffect } from 'react';

import './Page.css';

import Content from './Content';

const DUMMY_PAGES = [
  {title: 'Page 1', icon: '😬', content: 'blah blah blah page 1', id: 0},
  {title: 'Page 2', icon: '🤷‍♀️', content: 'blah blah blah page 2', id: 1},
  {title: 'Page 3', icon: '🥳', content: 'blah blah blah page 3', id: 2},
]

const Page = ( props ) => {
  const { id } = props;

  // state
  const [page, setPage] = useState({});
  const [content, setContent] = useState('');

  // get page info/content
  useEffect( () => {
    const newPage = DUMMY_PAGES.filter( (page) => page.id === id)[0];
    setPage(newPage);
    setContent(newPage.content);
  }, [id]);

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