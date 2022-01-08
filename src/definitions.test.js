import { getSamplePage } from './definitions';

test(`getSamplePage() returns welcome page with uid`, () => {
  const uid = 'newUser';
  const result = getSamplePage(uid, 'welcome');

  expect(result.doc.uid).toBe(uid);
  expect(result.block.uid).toBe(uid);
});

test(`getSamplePage() returns child page with uid`, () => {
  const uid = 'newUser';
  const result = getSamplePage(uid, 'child');

  expect(result.doc.uid).toBe(uid);
});

test(`getSamplePage() returns child page with correct parent ID`, () => {
  const uid = 'newUser';
  const parentID = getSamplePage(uid, 'welcome').pageID;
  const result = getSamplePage(uid, 'child');

  expect(result.doc.parent).toBe(parentID);
});

test(`Properties in recipesDB have non-identical timestamps in the created field`, () => {
  const recipeDB = getSamplePage('newUser', 'recipesDB');

  const timestamps = {};
  Object.keys(recipeDB.doc.properties).forEach(propID => {
    timestamps[propID] = recipeDB.doc.properties[propID].created;
  });

  expect(timestamps.source).not.toEqual(timestamps.lastmade);
})