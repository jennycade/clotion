import dataHandler from './db';
import { countDuplicates } from './helpers';

// read
test(`getAllPages returns everything`, () => {
  const db = dataHandler();

  return db.getAllPages()
    .then(data => {
      expect(data.length).toBe(3);
    });
});

test(`getPage returns the page`, () => {
  const db = dataHandler();
  const page = {title: 'Page 1', icon: '😬', content: 'blah blah blah Page 1', id: 0};

  return db.getPage(0)
    .then(data => {
      expect(data).toMatchObject(page);
    });
});

// create
test(`createPage makes a new page`, () => {
  const db = dataHandler();

  return db.createPage('Page 4', '⏰', 'Another page!')
    .then((id) => {
      return db.getAllPages();
    })
    .then(data => {
      expect(data.length).toBe(4);
    });
});

test(`createPage makes a new page with a unique id`, () => {
  const db = dataHandler();

  return db.createPage('Page 4', '⏰', 'Another page!')
    .then( (id) => {
      return db.getAllPages();
    })
    .then( (data) => {
      const ids = data.map((page) => page.id);
      // count repeats
      const numDuplicates = countDuplicates(ids);
      expect(numDuplicates).toBe(0);
    });
});

// update
// test(`updateTitle can change a title`, () => {
//   const db = dataHandler();

//   function callback(data) {
//     try {
//       expect(data).toMatchObject({title: 'Page 1.5'});

//       done();
//     } catch (error) {
//       done(error);
//     }
//   }
//   db.updateTitle(0, 'Page 1.5');
//   db.getPage(0, callback);
// });

// delete