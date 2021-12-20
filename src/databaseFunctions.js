const convertEntry = (entry, propType, finalSave = false, selectOptions = null) => {
  switch(propType) {
    case 'text':
    case 'url':
    case 'email':
    case 'phone':
    case 'title':
      return entry;
    case 'number':
      // already a number? don't mess with it!
      if (typeof entry === 'number') {
        return entry;
      }
      // only numeric characters
      const str = entry.replace(/[^0-9.]/gm, '');

      // but allow a trailing decimal when it's not the final save
      if (str.match(/\.$/g) && !finalSave) {
        return str;
      }

      return parseFloat(str);
    case 'checkbox':
      if (entry === 'true' || entry === true) {
        return true;
      } else {
        return false;
      }
    case 'date':
      // validate
      let date = Date.parse(entry);
      if (isNaN(date)) {
        return '';
      } else {
        // convert final save
        if (finalSave) {
          // date number to date object
          date = new Date(entry);

          // num values
          const year = date.getUTCFullYear();
          let month = date.getUTCMonth() + 1;
          let day = date.getUTCDate();

          // pad
          month = month.toString().padStart(2, '0');
          day = day.toString().padStart(2, '0');

          // put it together
          return `${year}-${month}-${day}`;
        } else {
          return entry;
        }
        
      }
    case 'select':
    case 'multiselect':
      if (Array.isArray(entry)) {
        if (propType === 'select') {
          // only one array element
          if (entry.length > 1) {
            return entry.slice(0, 1);
          }
        }
        return [...entry];
      } else if (typeof entry === 'string') {
        if (entry === '') {
          return [];
        } else {
          return [entry];
        }
      } else {
        throw new Error(`Don't know how to convert ${typeof entry} to ${propType}`);
      }

    default:
      throw new Error(`Invalid property type: ${propType}`);
  }
}

const validateSelectOptions = (selectOptions, allSelectOptions) => {
  let result = true;
  selectOptions.forEach(selectOption => {
    if (! allSelectOptions.includes(selectOption)) {
      result = false;
    }
  })
  return result;
}

const getInvalidSelectOptions = (selectOptions, allSelectOptions) => {
  const result = [];
  selectOptions.forEach(selectOption => {
    if (! allSelectOptions.includes(selectOption)) {
      // check for duplication
      if (! result.includes(selectOption)) {
        result.push(selectOption);
      }
    }
  })
  return result;
}

const isBlank = (value, type) => {
  const blanks = {
    text: '',
    url: '',
    email: '',
    phone: '',
    number: NaN,
    date: '',
    checkbox: false,
  };

  // non-array types
  if (Object.keys(blanks).includes(type)) {
    if (isNaN(blanks[type])) {
      return isNaN(value);
    }
    return value === blanks[type];
  }

  // array types
  if (['select', 'multiselect'].includes(type) && Array.isArray(value)) {
    return value.length === 0;
  }

  // anything else is invalid
  throw new Error(`isBlank() doesn't know how to handle value ${value} and type ${type}`);
}

const convertValue = (oldValue, oldType, newType, selectOptions = []) => {
  const simpleTypes = ['text', 'url', 'email', 'phone'];
  const arrayTypes = ['select', 'multiselect'];
  /* TYPES
    text: str
    url: str
    email: str
    phone: str

    date: str with format YYYY-MM-DD

    number: number

    checkbox: bool

    select: arr with one element that corresponds to key in selectOptions obj
    multiselect: arr with elements that correspond to keys in selectOptions obj
  */

  // NOTE: ignore selectOptions unless oldValue is select or multiselect. Let
  // the function that calls this one sort out ids vs. displayNames and
  // existing vs. new selectOptions.

  // from selectOption 
  if (arrayTypes.includes(oldType)) {
    if (selectOptions.length === 0) {
      throw new Error(`convertValue() missing argument selectOptions`);
    }

    // array -> simple
    if (simpleTypes.includes(newType)) {
      // convert each array member to displayName
      const names = oldValue.map(selectOptionID => selectOptions[selectOptionID].displayName);

      // collapse into comma-separated list
      return names.join(', ');
    }

    // array -> array
    if (arrayTypes.includes(newType)) {
      if (oldType === 'multiselect' && newType === 'select') {
        // only return first value
        return convertEntry(oldValue, 'select', true, selectOptions);
      }
      return [...oldValue];
    }

    // non-array -> array
    if (!arrayTypes.includes(newType)) {
      // convert each array member to displayName
      const names = oldValue.map(selectOptionID => selectOptions[selectOptionID].displayName);

      // convert and concatenate: handling based on type

      // number
      if (newType === 'number') {
        // concatenate all displayNames
        const concatenated = names.join('');
        // convert to number
        return convertEntry(concatenated, 'number', true);
      }

      // checkbox
      if (newType === 'checkbox') {
        // concatenate all displayNames
        const concatenated = names.join('');
        // rerun as text
        return convertValue(concatenated, 'text', 'checkbox');
      }

      // date
      if (newType === 'date') {
        // concatenate with... spaces?
        const concatenated = names.join(' ');
        // rerun as text
        return convertValue(concatenated, 'text', 'date', true);
      }
    }
  }

  // simple -> simple and same -> same
  if (oldType === newType ||
    (simpleTypes.includes(oldType) && simpleTypes.includes(newType))) {
    return oldValue;
  }

  // non-array to array
  if ((!arrayTypes.includes(oldType)) && arrayTypes.includes(newType)) {
    // blanks
    if (isBlank(oldValue, oldType)) {
      return [];
    }

    // simple -> array
    if (simpleTypes.includes(oldType)) {
      // does value contain comma-separated list?
      const commaSep = oldValue.split(/\s*,\s*/gm);

      // elimintate duplicates
      const uniqueVals = [...new Set(commaSep)];

      if (newType === 'select') {
        // only return the first element
        return [uniqueVals[0]];
      }

      return uniqueVals;
    }

    // date, checkbox, number -> array with element corresponding to text value
    if (['date', 'checkbox', 'number'].includes(oldType)) {
      // blank? return empty array
      if (isBlank(oldValue, oldType)) {
        return [];
      }
      // convert to text
      return [convertValue(oldValue, oldType, 'text')];
    }
  }

  // to simple types
  if (simpleTypes.includes(newType)) {
    return convertToString(oldValue, oldType);
  }

  // to number
  if (newType === 'number') {
    // checkbox and date -> always blank (NaN)
    if (['checkbox', 'date'].includes(oldType)) {
      return NaN;
    }
    return convertEntry(oldValue, 'number', true);
  }

  // to checkbox
  if (newType === 'checkbox') {
    // date and number -> always false
    if (['date', 'number'].includes(oldType)) {
      return false;
    }

    // simple
    if (simpleTypes.includes(oldType)) {
      // only 'yes' (case insensitive, ignoring whitespace) corresponds to
      // checked.
      const lowerCaseTrimmed = oldValue.trim().toLowerCase();
      return lowerCaseTrimmed === 'yes';
    }
  }

  // to date
  if (newType === 'date') {
    // number and checkbox -> always empty
    if (['number', 'checkbox'].includes(oldType)) {
      return '';
    }

    // simple
    if (simpleTypes.includes(oldType)) {
      // convert
      return convertEntry(oldValue, 'date', true);
    }
  }

  // that covers everything—don't fail silently!
  throw new Error (`convertValue() doesn't know how to convert ${oldType} to ${newType}`);

}

const convertToString = (value, oldType) => {
  switch (oldType) {
    case 'date':
      // validate
      let date = Date.parse(value);
      if (isNaN(date)) {
        return '';
      } else {
        // convert
        // date number to date object
        date = new Date(value);

        // num values
        const year = date.getUTCFullYear();
        let month = date.getUTCMonth();
        const day = date.getUTCDate();

        // convert to word month
        const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'];
        month = MONTHS[month];

        // put it together
        return `${month} ${day}, ${year}`;
      }
    case 'checkbox':
      return value ? 'Yes' : '';
    case 'number':
      if (isNaN(value)) {
        return '';
      }
      return value.toString();
     

     default:
       throw new Error(`convertToString() does not know how to handle type ${oldType}`);
  }
}

const renderDate = (val) => {
  // convert to string
  return convertToString(val, 'date');
}

const getDefaultEntry = (type) => {
  return convertEntry('', type, true);
}

export {
  convertEntry,
  getDefaultEntry,
  validateSelectOptions,
  getInvalidSelectOptions,
  convertValue,
  renderDate,
};