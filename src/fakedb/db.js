const dataHandler = () => {
  const DUMMY_PAGES = [
    {title: 'Page 1', icon: '😬', content: 'I am a real page blah blah blah Page 1', id: 0},
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

  const updatePage = (id, element, newValue) => {
    // which one?
    const i = DUMMY_PAGES.findIndex((page) => page.id === id);
    
    // update
    DUMMY_PAGES[i][element] = newValue;

    return Promise.resolve();
  }

  const updateTitle = (id, title) => {
    return updatePage(id, 'title', title);
  }
  const updateIcon = (id, icon) => {
    return updatePage(id, 'icon', icon);
  }
  const updateContent = (id, content) => {
    return updatePage(id, 'content', content);
  }

  const deletePage = (id) => {
    // which one?
    const i = DUMMY_PAGES.findIndex((page) => page.id === id);

    // BAHLEETED
    DUMMY_PAGES.splice(i, 1);

    return Promise.resolve();
  }

  return {
    getAllPages,
    getPage,
    createPage,
    updateTitle, updateIcon, updateContent,
    deletePage,
  }
}

export default dataHandler;