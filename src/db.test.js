import dataHandler from './db';
import { countDuplicates } from './helpers';

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

// delete