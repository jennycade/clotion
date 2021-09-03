import { countDuplicates } from './helpers';

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