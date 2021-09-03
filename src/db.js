const dataHandler = () => {
  const DUMMY_PAGES = [
    {title: 'Page 1', icon: '😬', content: 'blah blah blah Page 1', id: 0},
    {title: 'Page 2', icon: '🤷‍♀️', content: 'blah blah blah Page 2', id: 1},
    {title: 'Page 3', icon: '🥳', content: 'blah blah blah Page 3', id: 2},
  ];

  const getAllPages = () => {
    return Promise.resolve(DUMMY_PAGES);
  }

  const getPage = ( id ) => {
    return Promise.resolve(DUMMY_PAGES.filter( (page) => page.id === id)[0]);
  }

  const createPage = (title, icon, content) => {

    // generate unique id
    const usedIds = DUMMY_PAGES.map( (page) => page.id);
    const id = Math.max(usedIds) + 1;

    DUMMY_PAGES.push({title, icon, content, id});

    return Promise.resolve(id);
  }

  const updateTitle = (id, title) => {
    const oldPage = {...getPage(id)};
    console.log(oldPage);
  }

  return {
    getAllPages,
    getPage,
    createPage,
    updateTitle,
  }
}

export default dataHandler;