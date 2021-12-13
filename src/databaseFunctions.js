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

export {
  convertEntry,
  validateSelectOptions,
  getInvalidSelectOptions,
};