import { stringify } from '@firebase/util';
import { countDuplicates, getTitles, rearrange, organizePages } from './helpers';

// countDuplicates
test(`No duplicates in [1,2,3]`, () => {
  const num = countDuplicates([1,2,3]);
  expect(num).toBe(0);
});

test(`1 duplicate in [1,1,2,3]`, () => {
  const num = countDuplicates([1,1,2,3]);
  expect(num).toBe(1);
});

test(`Counts multiple duplicates of the same entry`, () => {
  const num = countDuplicates([1,1,1,1]);
  expect(num).toBe(3);
})

test(`No duplicates in []`, () => {
  const num = countDuplicates([]);
  expect(num).toBe(0);
});

// getTitles
test(`Gets title of single value`, () => {
  const arr = [
    {
      "name": "boop",
      "title": "floop",
    },
  ];

  const titles = getTitles(arr, 'title');

  expect(titles).toContain('floop');
  expect(titles.length).toBe(1);
});

test(`Gets one title from two entries`, () => {
  const arr = [
    {
      "name": "boop",
      "title": "floop",
    },
    { 'name': 'sloop',
      'title': 'floop'
    },
  ];

  const titles = getTitles(arr, 'title');

  expect(titles).toContain('floop');
  expect(titles.length).toBe(1);
});

test(`Gets two titles from five entries`, () => {
  const arr = [
    {
      "name": "boop",
      "title": "floop",
    },
    {
      'name': 'sloop',
      'title': 'floop'
    },
    {
      'name': 'sloop',
      'title': 'floop'
    },
    {
      'name': 'sloop',
      'title': 'gloop'
    },
    {
      'name': 'sloop',
      'title': 'gloop'
    },
    {
      'name': 'sloop',
      'title': 'gloop'
    },
  ];

  const titles = getTitles(arr, 'title');

  expect(titles).toContain('floop');
  expect(titles).toContain('gloop');
  expect(titles.length).toBe(2);
});

// for rearranging
test(`Rearrange returns an array`, () => {
  const test = [
    {id: 'a', order: 0},
    {id: 'b', order: 1},
    {id: 'c', order: 2},
    {id: 'd', order: 3},
    {id: 'e', order: 4},
  ];

  const resorted = rearrange(test, 'd', 'b');

  expect(resorted).toEqual(expect.any(Array));
});

test(`Rearrange returns an array of objects with keys 'id', 'order', and 'newOrder'`, () => {
  const test = [
    {id: 'a', order: 0},
    {id: 'b', order: 1},
    {id: 'c', order: 2},
    {id: 'd', order: 3},
    {id: 'e', order: 4},
  ];

  const resorted = rearrange(test, 'd', 'b');

  for (let i=0; i<resorted.length; i++) {
    expect(Object.keys(resorted[i])).toContain('id');
    expect(Object.keys(resorted[i])).toContain('newOrder');
  }

  expect(resorted.length).not.toBe(0);
});

test(`Rearrange doesn't change the original array`, () => {
  const test = [
    {id: 'a', order: 0},
    {id: 'b', order: 1},
    {id: 'c', order: 2},
    {id: 'd', order: 3},
    {id: 'e', order: 4},
  ];
  const test2 = [
    {id: 'a', order: 0},
    {id: 'b', order: 1},
    {id: 'c', order: 2},
    {id: 'd', order: 3},
    {id: 'e', order: 4},
  ];

  const resorted = rearrange(test, 'd', 'b');

  for (let i=0; i<test.length; i++) {
    expect(test[i]).toMatchObject(test2[i]);
  }

  expect(test.length).not.toBe(0);
});

test(`Rearrange moves an item forward multiple levels`, () => {
  const test = [
    {id: 'a', order: 0},
    {id: 'b', order: 1},
    {id: 'c', order: 2},
    {id: 'd', order: 3},
    {id: 'e', order: 4},
  ];

  const resorted = rearrange(test, 'd', 'b');

  const newOrderList = [
    {id: 'a', order: 0, newOrder: 0},
    {id: 'b', order: 1, newOrder: 2},
    {id: 'c', order: 2, newOrder: 3},
    {id: 'd', order: 3, newOrder: 1},
    {id: 'e', order: 4, newOrder: 4},
  ];
  
  for (let i=0; i<resorted.length; i++) {
    expect(resorted[i]).toMatchObject(newOrderList[i]);
  }

  expect(resorted.length).not.toBe(0);
});

test(`Rearrange moves an item back one level`, () => {
  const test = [
    {id: 'a', order: 0},
    {id: 'b', order: 1},
    {id: 'c', order: 2},
    {id: 'd', order: 3},
    {id: 'e', order: 4},
  ];

  const resorted = rearrange(test, 'b', 'd');

  const newOrderList = [
    {id: 'a', order: 0, newOrder: 0},
    {id: 'b', order: 1, newOrder: 2},
    {id: 'c', order: 2, newOrder: 1},
    {id: 'd', order: 3, newOrder: 3},
    {id: 'e', order: 4, newOrder: 4},
  ];
  
  for (let i=0; i<resorted.length; i++) {
    expect(resorted[i]).toMatchObject(newOrderList[i]);
  }

  expect(resorted.length).not.toBe(0);
});

test(`Rearrange moves an item to the front`, () => {
  const test = [
    {id: 'a', order: 0},
    {id: 'b', order: 1},
    {id: 'c', order: 2},
    {id: 'd', order: 3},
    {id: 'e', order: 4},
  ];

  const resorted = rearrange(test, 'e', 'a');

  const newOrderList = [
    {id: 'a', order: 0, newOrder: 1},
    {id: 'b', order: 1, newOrder: 2},
    {id: 'c', order: 2, newOrder: 3},
    {id: 'd', order: 3, newOrder: 4},
    {id: 'e', order: 4, newOrder: 0},
  ];
  
  for (let i=0; i<resorted.length; i++) {
    expect(resorted[i]).toMatchObject(newOrderList[i]);
  }

  expect(resorted.length).not.toBe(0);
});

test(`Rearrange moves an item to the back`, () => {
  const test = [
    {id: 'a', order: 0},
    {id: 'b', order: 1},
    {id: 'c', order: 2},
    {id: 'd', order: 3},
    {id: 'e', order: 4},
  ];

  const resorted = rearrange(test, 'a');

  const newOrderList = [
    {id: 'a', order: 0, newOrder: 4},
    {id: 'b', order: 1, newOrder: 0},
    {id: 'c', order: 2, newOrder: 1},
    {id: 'd', order: 3, newOrder: 2},
    {id: 'e', order: 4, newOrder: 3},
  ];
  
  for (let i=0; i<resorted.length; i++) {
    expect(resorted[i]).toMatchObject(newOrderList[i]);
  }

  expect(resorted.length).not.toBe(0);
});

test(`Rearrange doesn't move anything if from and to are the same`, () => {
  const test = [
    {id: 'a', order: 0},
    {id: 'b', order: 1},
    {id: 'c', order: 2},
    {id: 'd', order: 3},
    {id: 'e', order: 4},
  ];

  const resorted = rearrange(test, 'a', 'a');

  const newOrderList = [
    {id: 'a', order: 0, newOrder: 0},
    {id: 'b', order: 1, newOrder: 1},
    {id: 'c', order: 2, newOrder: 2},
    {id: 'd', order: 3, newOrder: 3},
    {id: 'e', order: 4, newOrder: 4},
  ];
  
  for (let i=0; i<resorted.length; i++) {
    expect(resorted[i]).toMatchObject(newOrderList[i]);
  }

  expect(resorted.length).not.toBe(0);
});
