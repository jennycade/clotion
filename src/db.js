const dataHandler = () => {
  const DUMMY_PAGES = [
    {title: 'Page 1', icon: '😬', content: 'blah blah blah', id: 0},
    {title: 'Page 2', icon: '🤷‍♀️', content: 'blah blah blah', id: 1},
    {title: 'Page 3', icon: '🥳', content: 'blah blah blah', id: 2},
  ];

  const getAllPages = ( callback ) => {
    callback(DUMMY_PAGES)
    
  }

  const createPage = (title, icon, content) => {
    // find next id
    let id=0;
    // start here next time with a while () to find the next available id

    DUMMY_PAGES.append()
  }

  return {
    getAllPages,
    createPage,
  }
}

export default dataHandler;