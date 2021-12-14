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
        // convert
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
        return entry;
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
    number: '',
    date: '',
    checkbox: false,
  };

  // non-array types
  if (Object.keys(blanks).includes(type)) {
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

    number: str with numeric value
    date: str with format YYYY-MM-DD

    checkbox: bool

    select: arr with one element that corresponds to key in selectOptions obj
    multiselect: arr with elements that correspond to keys in selectOptions obj
  */

  // NOTE: ignore selectOptions unless oldValue is select or multiselect. Let
  // the function that calls this one sort out ids vs. displayNames and
  // existing vs. new selectOptions.

  // simple -> simple
  if (oldType === newType ||
    (simpleTypes.includes(oldType) && simpleTypes.includes(newType))
  ) {
    return oldValue;
  }

  // array -> simple
  if (arrayTypes.includes(oldType) && simpleTypes.includes(newType)) {
    // convert each array member to displayName
    const names = oldValue.map(selectOptionID => selectOptions[selectOptionID].displayName);

    // collapse into comma-separated list
    return names.join(', ');
  }

  // non-arrayto array
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
  }
  

}

export {
  convertEntry,
  validateSelectOptions,
  getInvalidSelectOptions,
  convertValue,
};