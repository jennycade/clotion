import { convertEntry, validateSelectOptions, getInvalidSelectOptions, convertValue } from './databaseFunctions';

import { generateUniqueString } from './helpers';

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


////////////////////////////
// VALIDATE SELECTOPTIONS //
////////////////////////////

test(`validateSelectOptions returns true when the only option is valid`, () => {
  const entry = ['bloop'];
  const allOptions = ['bloop', 'poop', 'shmoop'];
  const result = validateSelectOptions(entry, allOptions);

  expect(result).toBe(true);
});

test(`validateSelectOptions returns false when the only option is not valid`, () => {
  const entry = ['gloop'];
  const allOptions = ['bloop', 'poop', 'shmoop'];
  const result = validateSelectOptions(entry, allOptions);

  expect(result).toBe(false);
});

test(`validateSelectOptions returns true when the all options are valid`, () => {
  const entry = ['bloop', 'poop'];
  const allOptions = ['bloop', 'poop', 'shmoop'];
  const result = validateSelectOptions(entry, allOptions);

  expect(result).toBe(true);
});

test(`validateSelectOptions returns false when the one of several options are invalid`, () => {
  const entry = ['bloop', 'gloop'];
  const allOptions = ['bloop', 'poop', 'shmoop'];
  const result = validateSelectOptions(entry, allOptions);

  expect(result).toBe(false);
});

///////////////////////////////
// GET INVALID SELECTOPTIONS //
///////////////////////////////

test(`getInvalidSelectOptions returns an empty array when the only option is valid`, () => {
  const entry = ['bloop'];
  const allOptions = ['bloop', 'poop', 'shmoop'];
  const result = getInvalidSelectOptions(entry, allOptions);

  expect(result).toEqual([]);
});

test(`getInvalidSelectOptions returns array with invalid selectOption when the only option is not valid`, () => {
  const entry = ['gloop'];
  const allOptions = ['bloop', 'poop', 'shmoop'];
  const result = getInvalidSelectOptions(entry, allOptions);

  expect(result).toEqual(['gloop']);
});

test(`getInvalidSelectOptions returns an empty array when the all options are valid`, () => {
  const entry = ['bloop', 'poop'];
  const allOptions = ['bloop', 'poop', 'shmoop'];
  const result = getInvalidSelectOptions(entry, allOptions);

  expect(result).toEqual([]);
});

test(`getInvalidSelectOptions returns array with invalid selectOption when one of several options are invalid`, () => {
  const entry = ['bloop', 'gloop'];
  const allOptions = ['bloop', 'poop', 'shmoop'];
  const result = getInvalidSelectOptions(entry, allOptions);

  expect(result).toEqual(['gloop']);
});

test(`getInvalidSelectOptions returns array with invalid selectOptions when several options are invalid`, () => {
  const entry = ['snoop', 'gloop'];
  const allOptions = ['bloop', 'poop', 'shmoop'];
  const result = getInvalidSelectOptions(entry, allOptions);

  expect(result).toEqual(['snoop', 'gloop']);
});

test(`getInvalidSelectOptions array doesn't include duplicates`, () => {
  const entry = ['snoop', 'gloop', 'snoop', 'snoop', 'snoop'];
  const allOptions = ['bloop', 'poop', 'shmoop'];
  const result = getInvalidSelectOptions(entry, allOptions);

  expect(result).toEqual(['snoop', 'gloop']);
});


///////////////////
// CONVERT VALUE //
///////////////////

test(`Converting between text, url, email, and phone returns the original value`, () => {
  const types = ['text', 'url', 'email', 'phone'];

  // test all against each other
  for (let i=0; i<types.length; i++) {
    for (let j=0; j<types.length; j++) {
      // get a random string
      const testStr = generateUniqueString([]);
      const oldType = types[i];
      const newType = types[j];

      const originalVal = convertEntry(testStr, oldType);
      expect(convertValue(testStr, oldType, newType)).toBe(originalVal);
    }
  }
});

const dummySelectOptions = {
  id1:
    {
      sortOrder: 0,
      displayName: 'pizza',
      color: 'gray',
    },
  id2:
  {
    sortOrder: 0,
    displayName: 'burrito',
    color: 'gray',
  },
  id3:
  {
    sortOrder: 0,
    displayName: 'burger',
    color: 'gray',
  },
};
test(`Converting from multiselect to text returns a comma-separated list of values`, () => {

  const oldValue = ['id1', 'id2'];

  expect(convertValue(oldValue, 'multiselect', 'text', dummySelectOptions)).toBe('pizza, burrito');
});

test(`Converting from select to text returns a the displayName of the selectOption`, () => {
  const oldValue = ['id3'];

  expect(convertValue(oldValue, 'select', 'text', dummySelectOptions)).toBe('burger');
});

test(`Converting from a comma-separated list in text to multiselect returns an array with the values of the comma-separated items`, () => {
  const oldValue = 'pizza, burrito';
  const condensedValue = 'pizza,burrito';
  
  expect(convertValue(oldValue, 'text', 'multiselect')).toEqual(['pizza', 'burrito']);
  expect(convertValue(condensedValue, 'text', 'multiselect')).toEqual(['pizza', 'burrito']);
});

// above for select
test(`Converting from a comma-separated list in text to select returns an array with the first value of the comma-separated items`, () => {
  const oldValue = 'pizza, burrito';
  const condensedValue = 'pizza,burrito';
  
  expect(convertValue(oldValue, 'text', 'select')).toEqual(['pizza']);
  expect(convertValue(condensedValue, 'text', 'select')).toEqual(['pizza']);
});

// above but test for eliminating duplicates
test(`Converting from a comma-separated list in text to multiselect eliminates duplicates`, () => {
  const oldValue = 'pizza, burrito, pizza, pizza, pizza';
  const condensedValue = 'pizza,burrito,pizza,pizza,pizza';
  
  expect(convertValue(oldValue, 'text', 'multiselect')).toEqual(['pizza', 'burrito']);
  expect(convertValue(condensedValue, 'text', 'multiselect')).toEqual(['pizza', 'burrito']);
});

// non-comma
test(`Converting from text to multiselect or select without commas returns a single element in an array`, () => {
  const string = 'Bloop bloop bloop bloop be doop';
  expect(convertValue(string, 'text', 'multiselect')).toEqual([string]);
  expect(convertValue(string, 'text', 'select')).toEqual([string]);
});

// blank!
test(`Converting any blank string to select or multiselect returns an empty array`, () => {
  const types = ['text', 'url', 'email', 'phone', 'date', 'number',];
  types.forEach(type => {
    expect(convertValue('', type, 'multiselect')).toEqual([]);
    expect(convertValue('', type, 'select')).toEqual([]);
  });
});