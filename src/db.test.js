import dataHandler from './db';
import { countDuplicates } from './helpers';

// read
test(`getAllPages returns everything`, ( done ) => {
  const db = dataHandler();

  function callback(data) {
    try {
      expect(data.length).toBe(3);
      done();
    } catch (error) {
      done(error);
    }
  }

  db.getAllPages(callback);
});

test(`getPage returns the page`, ( done ) => {
  const db = dataHandler();

  function callback(data) {
    try {
      const page = {title: 'Page 1', icon: '😬', content: 'blah blah blah Page 1', id: 0};
      expect(data).toMatchObject(page);

      done();
    } catch (error) {
      done(error);
    }
  }

  db.getPage(0, callback);
});

// create
test(`createPage makes a new page`, ( done) => {
  const db = dataHandler();

  function callback(data) {
    try {
      expect(data.length).toBe(4);
      done();
    } catch (error) {
      done(error);
    }
  }
  db.createPage('Page 4', '⏰', 'Another page!');
  db.getAllPages(callback);
});

test(`createPage makes a new page with a unique id`, (done) => {
  const db = dataHandler();

  function callback(data) {
    try {
      const ids = data.map((page) => page.id);
      // count repeats
      const numDuplicates = countDuplicates(ids);
      expect(numDuplicates).toBe(0);

      done();
    } catch (error) {
      done(error);
    }
  }
  db.createPage('Page 4', '⏰', 'Another page!');
  db.getAllPages(callback);
});

// update
// test(`updateTitle can change a title`, (done) => {
//   const db = dataHandler();

//   function callback(data) {
//     try {
//       expect(data).toC

//       done();
//     } catch (error) {
//       done(error);
//     }
//   }
//   db.updateTitle(0, 'Page 1.5');
//   db.getAllPages(callback);
// })

// delete