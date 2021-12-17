import { convertEntry, validateSelectOptions, getInvalidSelectOptions, convertValue, renderDate } from './databaseFunctions';

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
const SIMPLETYPES = ['text', 'url', 'email', 'phone'];
const ARRAYTYPES = ['select', 'multiselect'];

test(`Converting between text, url, email, and phone returns the original value`, () => {

  // test all against each other
  for (let i=0; i<SIMPLETYPES.length; i++) {
    for (let j=0; j<SIMPLETYPES.length; j++) {
      // get a random string
      const testStr = generateUniqueString([]);
      const oldType = SIMPLETYPES[i];
      const newType = SIMPLETYPES[j];

      const originalVal = convertEntry(testStr, oldType);
      expect(convertValue(testStr, oldType, newType)).toBe(originalVal);
    }
  }
});

const DUMMYSELECTOPTIONS = {
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
  numeric: {
    sortOrder: 0,
    displayName: '100',
    color: 'gray',
  },
  decimal: {
    sortOrder: 0,
    displayName: '100.5',
    color: 'gray',
  },
  decimal2: {
    sortOrder: 0,
    displayName: '3.14159',
    color: 'gray',
  },
  seminumeric: {
    sortOrder: 0,
    displayName: '867-5309',
    color: 'gray',
  },
  yes: {
    sortOrder: 0,
    displayName: 'yEs',
    color: 'gray',
  },
  yess: {
    sortOrder: 0,
    displayName: 'yess',
    color: 'gray',
  },
  date: {
    sortOrder: 0,
    displayName: '2021-12-15',
    color: 'gray',
  },
  longdate: {
    sortOrder: 0,
    displayName: 'December 15, 2021',
    color: 'gray',
  },
  slashdate: {
    sortOrder: 0,
    displayName: '12/15/2021',
    color: 'gray',
  },
  december: {
    sortOrder: 0,
    displayName: 'December',
    color: 'gray',
  },
  '15': {
    sortOrder: 0,
    displayName: '15',
    color: 'gray',
  },
  '2021': {
    sortOrder: 0,
    displayName: '2021',
    color: 'gray',
  },
  '12': {
    sortOrder: 0,
    displayName: '12',
    color: 'gray',
  },
};
test(`Converting from multiselect to text returns a comma-separated list of values`, () => {

  const oldValue = ['id1', 'id2'];

  expect(convertValue(oldValue, 'multiselect', 'text', DUMMYSELECTOPTIONS)).toBe('pizza, burrito');
});

test(`Converting from select to text returns a the displayName of the selectOption`, () => {
  const oldValue = ['id3'];

  expect(convertValue(oldValue, 'select', 'text', DUMMYSELECTOPTIONS)).toBe('burger');
});

// text to selectOption
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
  const types = ['text', 'url', 'email', 'phone', 'date',];
  types.forEach(type => {
    expect(convertValue('', type, 'multiselect')).toEqual([]);
    expect(convertValue('', type, 'select')).toEqual([]);
  });
});

// date to text-type
test(`Converting date to text type gives date in format Month, d YYYY`, () => {
  const date = '2021-12-15';
  SIMPLETYPES.forEach(type => {
    expect(convertValue(date, 'date', type)).toBe('December 15, 2021');
  });
});

test(`Converting blank date to text type returns blank`, () => {
  const date = '';
  SIMPLETYPES.forEach(type => {
    expect(convertValue(date, 'date', type)).toBe('');
  });
});

// checkbox to text-type
test(`Converting checked checkbox to text type returns "Yes"`, () => {
  const val = true;
  SIMPLETYPES.forEach(type => {
    expect(convertValue(val, 'checkbox', type)).toBe('Yes');
  });
});

test(`Converting unchecked checkbox to text type returns blank`, () => {
  const val = false;
  SIMPLETYPES.forEach(type => {
    expect(convertValue(val, 'checkbox', type)).toBe('');
  });
});

// number to text-type
test(`Converting number to text type returns numeric string`, () => {
  const val = 102;
  SIMPLETYPES.forEach(type => {
    expect(convertValue(val, 'number', type)).toBe('102');
  });
});

test(`Converting number with NaN value to text type returns blank string`, () => {
  const val = NaN;
  SIMPLETYPES.forEach(type => {
    expect(convertValue(val, 'number', type)).toBe('');
  });
});


// to number

// simple types
test(`Converting simple type to number converts number-like strings`, () => {
  const val = '100';
  SIMPLETYPES.forEach(type => {
    expect(convertValue(val, type, 'number')).toBe(100);
  });
});

test(`Converting simple type with some numeric characters to number returns numeric characters as a number`, () => {
  const val = '707-934-7410';
  SIMPLETYPES.forEach(type => {
    expect(convertValue(val, type, 'number')).toBe(7079347410); // NOTE: Different from Notion's behavior: returns 707. I'm okay with this.
  });
});

test(`Converting simple type with no numeric characters to number returns NaN`, () => {
  const val = 'blah blah blah I am having a fun time';
  SIMPLETYPES.forEach(type => {
    expect(convertValue(val, type, 'number')).toBeNaN();
  });
});

test(`Converting blank simple type to number returns NaN`, () => {
  const val = '';
  SIMPLETYPES.forEach(type => {
    expect(convertValue(val, type, 'number')).toBeNaN();
  });
});

test(`Converting number to number returns the number`, () => {
  expect(convertValue(100, 'number', 'number')).toBe(100);
  // NaN
  expect(convertValue(NaN, 'number', 'number')).toBeNaN();
});

test(`Converting checkbox to number returns NaN`, () => {
  expect(convertValue(true, 'checkbox', 'number')).toBeNaN();
  expect(convertValue(false, 'checkbox', 'number')).toBeNaN();
});
test(`Converting date to number returns NaN`, () => {
  expect(convertValue('2021-12-15', 'date', 'number')).toBeNaN();
  expect(convertValue('', 'date', 'number')).toBeNaN();
});



// selectOptions
test(`Converting multiselect to number returns a number that represents the numeric value of concatenating all numeric characters in all selectOptions.`, () => {
  const val = ['numeric', 'decimal', 'seminumeric'];
  const correct = 100100.58675309;
  expect(convertValue(val, 'multiselect', 'number', DUMMYSELECTOPTIONS)).toBe(correct);
});

test(`Converting multiselect with no number characters to number returns NaN`, () => {
  const val = ['id1', 'id2', 'id3'];
  expect(convertValue(val, 'multiselect', 'number', DUMMYSELECTOPTIONS)).toBeNaN();
});

test(`Converting blank multiselect to number returns NaN`, () => {
  const val = [];
  expect(convertValue(val, 'multiselect', 'number', DUMMYSELECTOPTIONS)).toBeNaN();
});

test(`Converting multiselect with multiple decimals to number returns a number that represents the numeric value of concatenating all numeric characters in all selectOptions, ignoring any decimal points and following digis after the first decimal.`, () => {
  const val = ['decimal', 'decimal2'];
  const correct = 100.53; // NOTE This differs from Notion's behavior! Notion removes all decimal points after first one but keeps following digits.
  expect(convertValue(val, 'multiselect', 'number', DUMMYSELECTOPTIONS)).toBe(correct);
});

test(`Converting select with numeric value to number returns that number`, () => {
  const int = ['numeric'];
  expect(convertValue(int, 'select', 'number', DUMMYSELECTOPTIONS)).toBe(100);
  const decimal = ['decimal'];
  expect(convertValue(decimal, 'select', 'number', DUMMYSELECTOPTIONS)).toBe(100.5);
});

test(`Converting select with seminumeric value to number returns the number corresponding to the digit characters concatenated together`, () => {
  const val = ['seminumeric'];
  expect(convertValue(val, 'select', 'number', DUMMYSELECTOPTIONS)).toBe(8675309);
});

test(`Converting select with non-numeric displayName returns NaN`, () => {
  const val = ['id1'];
  expect(convertValue(val, 'select', 'number', DUMMYSELECTOPTIONS)).toBeNaN();
});

test(`Converting blank select returns NaN`, () => {
  const val = [];
  expect(convertValue(val, 'select', 'number', DUMMYSELECTOPTIONS)).toBeNaN();
});


///////
// to checkbox

// simple types
test(`Converting simple field to checkbox returns true if string is "Yes" or "yes" (or any other case mixing)`, () => {
  const values = ['Yes', 'yes', 'YeS', 'yES'];
  SIMPLETYPES.forEach(type => {
    values.forEach(val => {
      expect(convertValue(val, type, 'checkbox')).toBe(true);
    });
  });
});

test(`Converting simple field to checkbox returns false if string is not "Yes"`, () => {
  const values = ['Yessir', 'yes or no', 'maybe', 'oh but yes or no?'];
  SIMPLETYPES.forEach(type => {
    values.forEach(val => {
      expect(convertValue(val, type, 'checkbox')).toBe(false);
    });
  });
});

test(`Converting blank simple field to checkbox returns false`, () => {
  const val = '';
  SIMPLETYPES.forEach(type => {
    expect(convertValue(val, type, 'checkbox')).toBe(false);
  });
});

// number - always empty
test(`Converting number to checkbox returns false`, () => {
  const values = [0, 1, 100, NaN];
  values.forEach(val => {
    expect(convertValue(val, 'number', 'checkbox')).toBe(false);
  });
});

// date - always empty
test(`Converting date to checkbox returns false`, () => {
  const values = ['', '2021-12-15'];
  values.forEach(val => {
    expect(convertValue(val, 'date', 'checkbox')).toBe(false);
  });
});

// self!
test(`Converting from checkbox to checkbox preserves the value`, () => {
  expect(convertValue(true, 'checkbox', 'checkbox')).toBe(true);
  expect(convertValue(false, 'checkbox', 'checkbox')).toBe(false);
});

// selectOptions
// multiselect
test(`Converting from multiselect where ONLY value is "Yes" (case-insensitive) to checkbox returns true`, () => {
  const val = ['yes'];
  expect(convertValue(val, 'multiselect', 'checkbox', DUMMYSELECTOPTIONS)).toBe(true);
});

test(`Converting from multiselect where value includes "Yes" and other values to checkbox returns false`, () => {
  const val = ['yes', 'yess'];
  expect(convertValue(val, 'multiselect', 'checkbox', DUMMYSELECTOPTIONS)).toBe(false);
});

test(`Converting from multiselect where value isn't 'yes' to checkbox returns false`, () => {
  const val = ['id1', 'id2', 'id3'];
  expect(convertValue(val, 'multiselect', 'checkbox', DUMMYSELECTOPTIONS)).toBe(false);
});

test(`Converting from blank multiselect to checkbox returns false`, () => {
  const val = [];
  expect(convertValue(val, 'multiselect', 'checkbox', DUMMYSELECTOPTIONS)).toBe(false);
});

// select
test(`Converting from select where value is "Yes" (case-insensitive) to checkbox returns true`, () => {
  const val = ['yes'];
  expect(convertValue(val, 'select', 'checkbox', DUMMYSELECTOPTIONS)).toBe(true);
});

test(`Converting from select where value is 'yess' to checkbox returns false`, () => {
  const val = ['yess'];
  expect(convertValue(val, 'select', 'checkbox', DUMMYSELECTOPTIONS)).toBe(false);
});

test(`Converting from select where value isn't 'yes' to checkbox returns false`, () => {
  const val = ['id1'];
  expect(convertValue(val, 'select', 'checkbox', DUMMYSELECTOPTIONS)).toBe(false);
});

test(`Converting from blank select to checkbox returns false`, () => {
  const val = [];
  expect(convertValue(val, 'select', 'checkbox', DUMMYSELECTOPTIONS)).toBe(false);
});

//////////
// to date

// simple
test(`Converting date-like simple type to date returns that date in format YYYY-MM-DD`, () => {
  const values = [
    '2021-12-15',
    '12/15/21',
    'December 15, 2021',
    'Dec 15 2021',
  ];

  SIMPLETYPES.forEach(type => {
    values.forEach(val => {
      expect(convertValue(val, type, 'date')).toBe('2021-12-15');
    });
  });
});

test(`Converting non-date string to date returns blank`, () => {
  const values = ['abc', 'bloop', 'December'];
  SIMPLETYPES.forEach(type => {
    values.forEach(val => {
      expect(convertValue(val, type, 'date')).toBe('');
    });
  });
});

test(`Converting blank string to date returns blank`, () => {
  const val = '';
  SIMPLETYPES.forEach(type => {
    expect(convertValue(val, type, 'date')).toBe('');
  });
});

// number always empty
test(`Converting number to date returns blank`, () => {
  const values = [123, 0, -5, NaN];
  values.forEach(val => {
    expect(convertValue(val, 'number', 'date')).toBe('');
  });
});

// checkbox always empty
test(`Converting checkbox to date returns blank`, () => {
  const values = [true, false];
  values.forEach(val => {
    expect(convertValue(val, 'checkbox', 'date')).toBe('');
  });
});

// self
test(`Converting date to date preserves value`, () => {
  const values = ['2021-12-15', ''];
  values.forEach(val => {
    expect(convertValue(val, 'checkbox', 'checkbox')).toBe(val);
  });
});

///////
// selectOptions

// single option (both select and multiselect)
test(`Converting single datelike multiselect or select to date returns date in 'YYYY-MM-DD' format`, () => {
  const types = ['select', 'multiselect'];
  const values = [['date'], ['longdate'], ['slashdate']];
  types.forEach(type => {
    values.forEach(val => {
      expect(convertValue(val, type, 'date', DUMMYSELECTOPTIONS)).toBe('2021-12-15');
    });
  });
});

test(`Converting single non-datelike multiselect or select to date returns date in 'YYYY-MM-DD' format`, () => {
  const types = ['select', 'multiselect'];
  const val = ['id1'];
  types.forEach(type => {
      expect(convertValue(val, type, 'date', DUMMYSELECTOPTIONS)).toBe('');
  });
});

test(`Converting blank multiselect or select to date returns date in 'YYYY-MM-DD' format`, () => {
  const types = ['select', 'multiselect'];
  const val = [];
  types.forEach(type => {
      expect(convertValue(val, type, 'date', DUMMYSELECTOPTIONS)).toBe('');
  });
});

// multiselect
test(`Converting multiselect with one datelike element and non-date element to date returns blank`, () => {
  const val = ['date', 'id1'];
  expect(convertValue(val, 'multiselect', 'date', DUMMYSELECTOPTIONS)).toBe('');
});

test(`Converting multiselect with elements that concatenate into a long date string to date returns that date in YYYY-MM-DD format`, () => {
  const val = ['december', '15', '2021'];
  expect(convertValue(val, 'multiselect', 'date', DUMMYSELECTOPTIONS)).toBe('2021-12-15');
});

test(`Converting multiselect with elements that concatenate into slash date string to date returns that date in YYYY-MM-DD format`, () => {
  const val = ['12', '15', '2021'];
  expect(convertValue(val, 'multiselect', 'date', DUMMYSELECTOPTIONS)).toBe('2021-12-15');
});


//////////
// Non-simple and non-array to select/multiselect //


// date -> select/multiselect
test(`Converting date to multiselect or select returns array with single element - long date format string`, () => {
  const val = '2021-12-15';
  ARRAYTYPES.forEach(type => {
    expect(convertValue(val, 'date', type)).toEqual(['December 15, 2021']);
  });
});
test(`Converting blank date to multiselect or select returns empty array`, () => {
  const val = '';
  ARRAYTYPES.forEach(type => {
    expect(convertValue(val, 'date', type)).toEqual([]);
  });
});

// checkbox -> select/multiselect
test(`Converting true checkbox to multiselect or select returns array with single element - "Yes"`, () => {
  const val = true;
  ARRAYTYPES.forEach(type => {
    expect(convertValue(val, 'checkbox', type)).toEqual(['Yes']);
  });
});
test(`Converting false checkbox to multiselect or select returns empty array`, () => {
  const val = false;
  ARRAYTYPES.forEach(type => {
    expect(convertValue(val, 'checkbox', type)).toEqual([]);
  });
});

// number -> select/multiselect
test(`Converting number to multiselect or select returns array with single element - number as string`, () => {
  const val = 100;
  ARRAYTYPES.forEach(type => {
    expect(convertValue(val, 'number', type)).toEqual(['100']);
  });
});
test(`Converting blank number to multiselect or select returns empty array`, () => {
  const val = NaN;
  ARRAYTYPES.forEach(type => {
    expect(convertValue(val, 'number', type)).toEqual([]);
  });
});

///////////////////
// Array to array

// from select
test(`Converting select to select or multiselect returns equivalent single-element array`, () => {
  const val = ['id1'];
  ARRAYTYPES.forEach(type => {
    const result = convertValue(val, 'select', type, DUMMYSELECTOPTIONS);
    expect(result).toEqual(val);
    expect(result).not.toBe(val);
  });
});

test(`Converting blank select to select or multiselect returns an empty array`, () => {
  const val = [];
  ARRAYTYPES.forEach(type => {
    const result = convertValue(val, 'select', type, DUMMYSELECTOPTIONS);
    expect(result).toEqual(val);
    expect(result).not.toBe(val);
  });
});

// from multiselect
test(`Convertying single-element multiselect to select or multiselect returns equivalent single-element array`, () => {
  const val = ['id1'];
  ARRAYTYPES.forEach(type => {
    const result = convertValue(val, 'multiselect', type, DUMMYSELECTOPTIONS);
    expect(result).toEqual(val);
    expect(result).not.toBe(val);
  });
});

test(`Converting blank multiselect to select or multiselect returns empty array`, () => {
  const val = [];
  ARRAYTYPES.forEach(type => {
    const result = convertValue(val, 'multiselect', type, DUMMYSELECTOPTIONS);
    expect(result).toEqual(val);
    expect(result).not.toBe(val);
  });
});

test(`Converting multiselect with multiple elements to multiselect returns equivalent array`, () => {
  const val = ['id1', 'id2'];
  const result = convertValue(val, 'multiselect', 'multiselect', DUMMYSELECTOPTIONS);
  expect(result).toEqual(val);
  expect(result).not.toBe(val);
});

test(`Converting multiselect with multiple elements to select returns equivalent array`, () => {
  const val = ['id1', 'id2'];
  const result = convertValue(val, 'multiselect', 'select', DUMMYSELECTOPTIONS);
  expect(result).toEqual(['id1']);
});


///////////////
// rendering //
///////////////

test(`Date renders YYYY-MM-DD as Month d, YYYY when given no format argument`, () => {
  const val = '2021-12-16';
  const correct = 'December 16, 2021';
  expect(renderDate(val)).toBe(correct);
});

test(`Date renders blank as blank`, () => {
  expect(renderDate('')).toBe('');
});

// formats:
// Full date
// Month/Day/Year
// Day/Month/Year
// Year/Month/Day
// Relative