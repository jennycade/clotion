const countDuplicates = (arr) => {
  let usedVals = [];
  let numDuplicates = 0;

  for (let i=0; i<arr.length; i++) {
    if (usedVals.includes(arr[i])) {
      numDuplicates++;
    } else {
      usedVals.push(arr[i]);
    }
  }
  
  return numDuplicates;
}


const getTitles = (arr, colName) => {
  const reducer = (titles, newTitle) => {
    if (!titles.includes(newTitle[colName])) {
      return [...titles, newTitle[colName] ];
    } else {
      return titles;
    }
  }

  const titles = [];
  return arr.reduce(reducer, titles);
}

// html string --> jsx (use dangerouslySetInnerHtml)
const createMarkup = ( htmlStr ) => {
  return {__html: htmlStr};
}

export {
  countDuplicates,
  getTitles,
  createMarkup,
};


