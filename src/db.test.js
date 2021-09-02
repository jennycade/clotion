import db from './db';

const DUMMY_PAGES = [
  {title: 'Page 1', icon: '😬', content: 'blah blah blah', id: 0},
  {title: 'Page 2', icon: '🤷‍♀️', content: 'blah blah blah', id: 1},
  {title: 'Page 3', icon: '🥳', content: 'blah blah blah', id: 2},
];

test(`getAllPages returns everything`, () => {
  return db.getAllPages().then(data => {
    expect(data.length).toBe(3);
  });
});