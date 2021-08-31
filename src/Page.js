import { useState, useEffect } from 'react';

const DUMMY_PAGES = [
  {title: 'Page 1', icon: '😬', content: 'blah blah blah', id: 0},
  {title: 'Page 2', icon: '🤷‍♀️', content: 'blah blah blah', id: 1},
  {title: 'Page 3', icon: '🥳', content: 'blah blah blah', id: 2},
]

const Page = ( props ) => {
  const { id } = props;

  // state
  const [page, setPage] = useState({});

  // get page info/content
  useEffect( () => {
    const newPage = DUMMY_PAGES.filter( (page) => page.id === id)[0];
    setPage(newPage);
  }, [id]);

  return (
    <div className="page">
      <title className="pageTitle">{ page.title }</title>
      <div className="pageIcon">{ page.icon }</div>
      <div className="content">
        { page.content }
      </div>
    </div>
  );
}

export default Page;