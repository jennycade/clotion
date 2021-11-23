const convertEntry = (entry, propType, finalSave = false) => {
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
    default:
      throw new Error(`Invalid property type: ${propType}`);
  }
}

export {
  convertEntry,
};