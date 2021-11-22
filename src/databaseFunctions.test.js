import { convertEntry } from './databaseFunctions';

test(`Converts number string to number`, () => {
  const numEntry = '1';
  const result = convertEntry(numEntry, 'number');

  expect(result).toBe(1);
});

test(`Converts another number string to number`, () => {
  const numEntry = '2';
  const result = convertEntry(numEntry, 'number');

  expect(result).toBe(2);
});

test(`Doesn't change text, url, email, or phone`, () => {
  const strEntry = 'abc';
  const result = convertEntry(strEntry, 'text');

  expect(result).toBe(strEntry);

  expect(convertEntry(strEntry, 'url')).toBe(strEntry);
  expect(convertEntry(strEntry, 'email')).toBe(strEntry);
  expect(convertEntry(strEntry, 'phone')).toBe(strEntry);
});

test(`Ignores non-numeric characters when type is "number"`, () => {
  const strEntry = 'abc123';
  const result = convertEntry(strEntry, 'number');
  const expected = 123;

  expect(result).toBe(expected);
});

test(`Allows "." in number of last position of number`, () => {
  const strEntry = '123.';
  const result = convertEntry(strEntry, 'number');
  const expected = strEntry;

  expect(result).toBe(expected);
});

test(`Doesn't allow "." in number of last position of number when saving to db`, () => {
  const strEntry = '123.';
  const result = convertEntry(strEntry, 'number', true);
  const expected = 123;

  expect(result).toBe(expected);
});

test(`Revalidation doesn't break if it's fed a previously converted number`, () => {
  const entry = 123;
  const result = convertEntry(entry, 'number', true);
  
  expect(result).toBe(123);
});