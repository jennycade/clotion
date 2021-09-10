import { countDuplicates, getTitles } from './helpers';

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