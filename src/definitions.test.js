import { getSamplePage } from './definitions';

test(`getSamplePage() returns welcome page with uid`, () => {
  const uid = 'newUser';
  const doc = getSamplePage(uid, 'welcomeDoc');
  const block = getSamplePage(uid, 'welcomeDoc');

  expect(doc.uid).toBe(uid);
  expect(block.uid).toBe(uid);
});

test(`getSamplePage() returns child page with uid`, () => {
  const uid = 'newUser';
  const result = getSamplePage(uid, 'child');

  expect(result.doc.uid).toBe(uid);
});

test(`Properties in recipesDB have non-identical timestamps in the created field`, () => {
  const recipeDB = getSamplePage('newUser', 'recipesDB');

  const timestamps = {};
  Object.keys(recipeDB.doc.properties).forEach(propID => {
    timestamps[propID] = recipeDB.doc.properties[propID].created;
  });

  expect(timestamps.source).not.toEqual(timestamps.lastmade);
});

test(`recipeRows and recipePages have the same IDs`, () => {
  const recipeRows = getSamplePage('newUser', 'recipeRows');
  const recipePages = getSamplePage('newUser', 'recipePages');

  expect(Object.keys(recipeRows)).toEqual(Object.keys(recipePages));
});

test(`getSamplePage() takes parent page ID as third argument, uses it for child page`, () => {
  const parentID = 'bloopity blorp';
  const childObj = getSamplePage('user', 'child', parentID);

  expect(childObj.doc.parent).toBe(parentID);
});

test(`getSamplePage() takes parent page ID as third argument, uses it for db child pages`, () => {
  const parentID = 'bloopity blorp';
  const recipePages = getSamplePage('user', 'recipePages', parentID);

  Object.keys(recipePages).forEach(recipePageID => {
    expect(recipePages[recipePageID].doc.parent).toBe(parentID);
  });
});

test(`getSamplePage() takes child page ID argument as third argument, uses it for content`, () => {
  const childID = 'bloopity blorp';
  const welcomeBlock = getSamplePage('user', 'welcomeBlock', childID);

  expect(welcomeBlock.content).toContain(childID);
});