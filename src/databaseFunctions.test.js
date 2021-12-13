import { convertEntry } from './databaseFunctions';

test(`Doesn't change text, url, email, or phone`, () => {
  const strEntry = 'abc';
  const result = convertEntry(strEntry, 'text');

  expect(result).toBe(strEntry);

  expect(convertEntry(strEntry, 'url')).toBe(strEntry);
  expect(convertEntry(strEntry, 'email')).toBe(strEntry);
  expect(convertEntry(strEntry, 'phone')).toBe(strEntry);
});

////////////
// NUMBER //
////////////

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

//////////////
// CHECKBOX //
//////////////

// string --> boolean!
test(`Converts 'true' to true for checkbox`, () => {
  const entry = 'true';
  const result = convertEntry(entry, 'checkbox');

  expect(result).toBe(true);
});

test(`Converts 'false' to false for checkbox`, () => {
  expect(convertEntry('false', 'checkbox')).toBe(false);
});

test(`Converts true to true for checkbox`, () => {
  expect(convertEntry(true, 'checkbox')).toBe(true);
});

test(`Converts false to false for checkbox`, () => {
  expect(convertEntry(false, 'checkbox')).toBe(false);
});

//////////
// DATE //
//////////

// format: 'xxxx-xx-xx'
test(`Converts invalid date into blank string`, () => {
  expect(convertEntry('2020-12-32', 'date')).toBe('');
});

test(`Leaves a valid xxxx-xx-xx date alone`, () => {
  expect(convertEntry('2021-12-02', 'date')).toBe('2021-12-02');
});

test(`Converts other date formats to xxxx-xx-xx`, () => {
  const correct = '2021-12-02';
  
  expect(convertEntry('2021/12/02', 'date')).toBe(correct);
  expect(convertEntry('12/02/21', 'date')).toBe(correct);
  expect(convertEntry('12/02/2021', 'date')).toBe(correct);
  expect(convertEntry('12-2-21', 'date')).toBe(correct);
  expect(convertEntry('12-02-2021', 'date')).toBe(correct);
});


////////////
// SELECT //
////////////
test(`Passes an empty array through`, () => {
  const input = [];
  const result = convertEntry(input, 'select');

  expect(result).toEqual(input);
});

test(`Converts blank string to empty array`, () => {
  const input = '';
  const result = convertEntry(input, 'select');

  expect(result).toEqual([]);
});

test(`Convert a non-blank string to array with that string`, () => {
  const input = 'bloop';
  const result = convertEntry(input, 'select');

  expect(result).toEqual(['bloop']);
});

test(`Passes array with one member through`, () => {
  const input = ['bloop'];
  const result = convertEntry(input, 'select');

  expect(result).toEqual(['bloop']);
});

test(`For select, reduces array down to first element`, () => {
  const input = ['bloop', 'sloop'];
  const result = convertEntry(input, 'select');

  expect(result).toEqual(['bloop']);
});

test(`For multiselect, allow array of any size`, () => {
  const input = ['bloop', 'sloop'];
  const result = convertEntry(input, 'multiselect');

  expect(result).toEqual(['bloop', 'sloop']);
});