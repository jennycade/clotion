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


const getDescendents = (pages, page) => {
  // descendents = [child, grandchild, great-grandchild]
  // for page without subpages, descendents = []
  // child = id

  // find children
  const children = pages.filter((p) => p.parent === page.id);

  if (children.length === 0) {
    return [];
  } else {
    // run on each child
    let line = [];
    children.forEach(child => {
      // add the child
      line.push(child.id);

      // ... and its descendents
      line.push(getDescendents(pages, child));
    });
    // flatten
    line = line.flat();
    return line;
  }
}

const splicePageLinkInBlock = (blockJson, pageID) => {
  // for removing a PageLink when subpage is deleted

  // convert to array
  let arr = JSON.parse(blockJson);

  // filter out node(s) with type === page and id === pageID
  arr = arr.filter(node => (node.type !== 'page' || node.id !== pageID));

  // empty array? add an empty node
  if (arr.length === 0) {
    const emptyNode = {
      type: 'paragraph',
      children: [
        {text: ''}
      ]
    };

    arr.push(emptyNode);
  }

  // convert back to JSON string
  const jsonResult = JSON.stringify(arr);

  // return string
  return jsonResult;
}

const isPageNodeInBlock = (blockJson, pageID) => {
  // returns true if the block contains a page link corresponding to pageID,
  // false if not
  // convert to array
  let arr = JSON.parse(blockJson);

  // find matching nodes
  arr = arr.filter(node => (node.type === 'page' && node.id === pageID));

  return arr.length !== 0; // found at least one match
}

const getColorCode = (colorName, type) => {
  const COLORS = {
    gray: 'rgba(96, 96, 98, 0.93)',
    brown: 'rgba(174, 102, 29, 1)',
    orange: 'rgba(210, 82, 22, 1)',
    yellow: 'rgba(203, 145, 47, 1)',
    green: 'rgba(62, 143, 53, 1)',
    blue: 'rgba(33, 131, 190, 1)',
    purple: 'rgba(151, 93, 190, 1)',
    pink: 'rgba(203, 62, 132, 1)',
    red: 'rgba(208, 60, 60, 1)',
  }
  const BGCOLORS = {
    'light gray': 'rgb(241, 240, 240)',
    gray: 'rgba(234, 234, 235, 0.93)',
    brown: 'rgba(213, 130, 38, 0.13)',
    orange: 'rgba(252, 103, 27, 0.13)',
    yellow: 'rgba(253, 183, 63, 0.13)',
    green: 'rgba(76, 169, 66, 0.13)',
    blue: 'rgba(45, 159, 226, 0.13)',
    purple: 'rgba(187, 123, 230, 0.13)',
    pink: 'rgba(255, 85, 163, 0.13)',
    red: 'rgba(255, 82, 71, 0.13)',
  }

  if (type === 'color') {
    if (Object.keys(COLORS).includes(colorName)) {
      return COLORS[colorName];
    } else {
      return 'inherit';
    }
  } else if (type === 'bgColor') {
    if (Object.keys(BGCOLORS).includes(colorName)) {
      return BGCOLORS[colorName];
    } else {
      return 'inherit';
    }
  } else {
    throw new Error(`getColorCode called with invalid type 'type'. (Should be 'color' or 'bgColor')`);
  }
}

const getAncestorClassList = (domElement, partialList = []) => {
  
  if (domElement.parentNode && (domElement.id !== 'root')) {
    // add parent class(es)
    const result = [...partialList];
    domElement.parentNode.classList.forEach(x => {
      result.push(x);
    });
    return getAncestorClassList(domElement.parentNode, result);
  } else {
    return partialList;
  }
  
}

const pickRandomCharacter = () => {
  const CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  return CHARACTERS[Math.floor(Math.random()*CHARACTERS.length)];
}

const generateUniqueString = (existingStringsArr, stringLength = 12) => {
  // prevent infinite loops!
  const startTime = Date.now();
  const timeoutms = 5000;

  let str;
  do {
    // reset str
    str = '';

    // check for infinite loop
    if (startTime + timeoutms < Date.now()) {
      throw new Error('Caught in an infinite loop in generateUniqueString(). Check stringLength parameter');
    }
    for (let i=0; i<stringLength; i++) {
      // pick a random character
      str += pickRandomCharacter();
    }
    
  } while (existingStringsArr.includes(str)); // check for uniqueness

  // return
  return str;
}

const removeFromArray = (value, arr) => {
  const loc = arr.findIndex(x => x === value);
  const newArr = [...arr.slice(0, loc), ...arr.slice(loc + 1)];

  return newArr;
}

const sortOutOfPlace = (arr, sortFn) => {
  const result = [...arr];

  if (sortFn) {
    return result.sort(sortFn);
  }

  return result.sort();
}


export {
  countDuplicates,
  getTitles,
  createMarkup,
  rearrange,
  getDescendents,
  splicePageLinkInBlock,
  isPageNodeInBlock,
  getColorCode,
  getAncestorClassList,
  generateUniqueString,
  removeFromArray,
  sortOutOfPlace,
};


