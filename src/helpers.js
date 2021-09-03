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

export {
  countDuplicates,
};