import dataHandler from './db';

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

    db.createPage('Page 4', '⏰', 'Another page!');
    db.getAllPages(callback);

  }
})

// update

// delete