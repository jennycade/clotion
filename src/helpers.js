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

// rearrange
const rearrange = ( arr, fromId, beforeId = null ) => {
  // arr is an array of objects with keys `id` (unique string or numeric) `order` (unique numeric)
  // arr = [
  //   {id: 'a', order: 0},
  //   {id: 'b', order: 1},
  //   {id: 'c', order: 2},
  //   {id: 'd', order: 3},
  //   {id: 'e', order: 4},
  // ];
  // fromId is val for `id` of item to move
  // beforeId is value for `id` of item that the item being moved will be put in front of
  // OR omit beforeId (or pass in any value that doesn't match an `id` in arr) to move an item
  // to the end of the list
  //
  // returns a new array with `id` and `order` copied from arr, plus value `newOrder` that has
  // new sort order for each item.


  // extract order values
  const fromOrder = arr.filter(item => item.id === fromId)[0]['order'];
  
  // to value: move to the end or move in front of another item?
  const beforeItem = arr.filter(item => item.id === beforeId)[0];
  let toOrder;
  if (beforeItem) {
    toOrder = beforeItem['order'];
  } else {
    // highest order + 1
    toOrder = Math.max(...arr.map(item => item.order)) + 1;
  }
  
  const newArr = arr.map(item => {
    let newOrder;
    if (fromOrder > toOrder) {
      if (item.order === fromOrder) {
        newOrder = toOrder;
      } else if (item.order < fromOrder && item.order >= toOrder) {
        newOrder = item.order + 1;
      } else if (item.order < toOrder || item.order > fromOrder) {
        newOrder = item.order;
      }
    } else if (toOrder > fromOrder) {
      if (item.order === fromOrder) {
        newOrder = toOrder - 1;
      } else if (item.order < fromOrder || item.order >= toOrder) {
        newOrder = item.order;
      } else if (item.order > fromOrder && item.order < toOrder) {
        newOrder = item.order - 1;
      }
    } 
    if (fromOrder === toOrder) { // dumb case: from and to are the same
      newOrder = item.order;
    }

    return {id: item.id, order: item.order, newOrder: newOrder}
  });

  return newArr;
}


export {
  countDuplicates,
  getTitles,
  createMarkup,
  rearrange,
};


