import { Timestamp } from "firebase/firestore";

const VIEWMENU = [
  {
    id: 'table',
    displayText: 'Table',
  },
  {
    id: 'board',
    displayText: 'Board',
  },
  {
    id: 'list',
    displayText: 'List',
  },
  {
    id: 'gallery',
    displayText: 'Gallery',
  },
];

const PROPERTYTYPEICONS = {
  title: '🆔', 
  text: '🔤',
  number: '#️⃣',
  select: '▾',
  multiselect: '≔',
  date: '🗓',
  checkbox: '☑︎',
  url: '🔗',
  email: '✉️',
  phone: '📞',
};

function* infinite() {
  let index = 0;

  while (true) {
      yield index++;
  }
}
const getNextInt = infinite();

const getSamplePage = (uid, pageName) => {
  // page IDs
  const instructionsPageID = 'welcome';
  const childPageID = 'instructionssubpage';
  const recipesDBID = 'recipesDB';

  // timestamp
  const currentTimestamp = new Date();
  const getPrevTimestamp = () => {
    return Timestamp.fromDate(new Date(currentTimestamp - getNextInt.next().value));
  }

  switch(pageName) {
    case 'welcome':
      return {
        pageID: instructionsPageID,
        doc: {
          icon: '👋',
          isDb: false,
          order: 0,
          parent: '',
          title: 'Welcome to Clotion',
          uid: uid,
        },
        block: {
          content: JSON.stringify(
            [{"type":"callout","children":[{"text":"Clotion is a simple Notion clone made for The Odin Project. Learn more about this app at "},{"text":"github.com/jennycade/clotion","code":true}]},
            {"type":"h1","children":[{"text":"👆 Icon and title","backgroundColor":"inherit","color":"inherit"}]},
            {"type":"paragraph","children":[{"backgroundColor":"inherit","color":"inherit","text":"Every page has an icon and title. Click the icon (or the Add icon button) to choose a new emoji to use as the icon, and click the title to change it."}]},
            {"type":"h1","children":[{"text":"👈 Sidebar"}]},
            {"type":"paragraph","children":[{"text":"The sidebar shows all of your pages. Click any page to open it. Drag and drop to re-order top-level pages."}]},
            {"type":"h1","children":[{"backgroundColor":"inherit","color":"inherit","text":"New page"}]},
            {"type":"paragraph","children":[{"text":"When you open a new page, you can choose to make it either an empty rich text document or a database."}]},
            {"type":"divider","children":[{"text":""}]},
            {"type":"h1","children":[{"text":"Rich text editor"}]},
            {"type":"paragraph","children":[{"text":"Type '/' to see the types of blocks that are available. You can make:"}]},
            {"type":"bulletList","children":[{"type":"li","children":[{"text":"paragraphs"}]},
            {"type":"li","children":[{"text":"bulleted lists"}]},
            {"type":"li","children":[{"text":"numbered lists"}]},
            {"type":"li","children":[{"text":"headings"}]},
            {"type":"li","children":[{"text":"codeblocks"}]},
            {"type":"li","children":[{"text":"quotes"}]},
            {"type":"li","children":[{"text":"dividers"}]},
            {"type":"li","children":[{"text":"callouts (like the box at the top of this page)"}]}]},
            {"type":"paragraph","children":[{"text":"The editor also supports "},{"text":"bold","bold":true},{"text":", "},{"text":"italic","italic":true},{"text":", "},{"text":"underline","underline":true},{"text":", "},{"text":"strikethrough","strikethrough":true},{"text":", and "},{"text":"monospaced","code":true},{"text":" styles, as well as "},{"text":"multiple","backgroundColor":"inherit","color":"inherit"},{"text":" "},{"text":"font","color":"rgba(208, 60, 60, 1)"},{"text":" and "},{"text":"background ","backgroundColor":"rgba(76, 169, 66, 0.13)"},{"backgroundColor":"rgba(76, 169, 66, 0.13)","text":"colors","color":"rgba(33, 131, 190, 1)"},{"text":". Highlight text to change its formatting."}]},
            {"type":"h2","children":[{"text":"Keyboard shortcuts"}]},
            {"type":"callout","children":[{"text":"The list below gives Mac shortcuts. For non-Macs, use Ctrl for ⌘ and alt for ⌥"}]},
            {"type":"h3","children":[{"text":"Text formatting"}]},
            {"type":"paragraph","children":[{"text":"⌘ B - bold"}]},
            {"type":"paragraph","children":[{"text":"⌘ I - italic"}]},
            {"type":"paragraph","children":[{"text":"⌘ U - underline"}]},
            {"type":"paragraph","children":[{"text":"⌘ ⇧ S - strikethrough"}]},
            {"type":"paragraph","children":[{"text":"⌘ E - monospace"}]},
            {"type":"h3","children":[{"text":"Blocks"}]},
            {"type":"paragraph","children":[{"text":"⌘ ⌥ 0 - paragraph"}]},
            {"type":"paragraph","children":[{"text":"⌘ ⌥ 1 - heading 1"}]},
            {"type":"paragraph","children":[{"text":"⌘ ⌥ 2 - heading 2"}]},
            {"type":"paragraph","children":[{"text":"⌘ ⌥ 3 - heading 3"}]},
            {"type":"paragraph","children":[{"text":"⌘ ⌥ 5 - bullet list"}]},
            {"type":"paragraph","children":[{"text":"⌘ ⌥ 6 - numbered list"}]},
            {"type":"paragraph","children":[{"text":"⌘ ⌥ 8 - code block"}]},
            {"type":"paragraph","children":[{"text":"⌘ ⌥ 9 - insert subpage"}]},
            {"type":"h1","children":[{"text":"Subpages"}]},
            {"type":"paragraph","children":[{"text":"Choose the page block to add a subpage. You can nest pages as deeply as you want."}]},
            {"type":"page","children":[{"text":""}],"id":childPageID},{"type":"paragraph","children":[{"text":"If you delete a link to a subpage, it will be added back to the end of its parent page the next time the parent page is opened."}]},
            {"type":"divider","children":[{"text":""}]},
            {"type":"h1","children":[{"text":"Databases"}]},
            {"type":"paragraph","children":[{"text":"Click over to the Sample database to see a database in action. Use "},{"text":"Views","bold":true},{"text":" to see the same data represented in a table, a board, a list, or a gallery."}]},
            {"type":"paragraph","children":[{"text":"Each database can have any number of properties. There are nine different types of properties:"}]},
            {"type":"orderedList","children":[{"type":"li","children":[{"text":"text"}]},
            {"type":"li","children":[{"text":"number"}]},
            {"type":"li","children":[{"text":"select","bold":true},{"text":" - one of any number of user-defined options. Used for board views."}]},
            {"type":"li","children":[{"text":"multiselect","bold":true},{"text":" - like select, but it supports choosing any number of options. Not used for board views."}]},
            {"type":"li","children":[{"text":"date"}]},
            {"type":"li","children":[{"text":"checkbox"}]},
            {"type":"li","children":[{"text":"url"}]},
            {"type":"li","children":[{"text":"email"}]},
            {"type":"li","children":[{"text":"phone"}]}]},
            {"type":"paragraph","children":[{"text":"You can create any number of views by clicking on the view selector at the top left corner of the database. Within each view, any number of properties can be displayed."}]},
            {"type":"paragraph","children":[{"text":"In a board, drag and drop cards to assign the grouping select property."}]},
            {"type":"page","id":"uDHKB5JuKM6ycTYLSNiH","children":[{"text":""}]},
            {"type":"paragraph","children":[{"text":""}]}]),
          order: 1,
          uid: uid,
          }
      };
    case 'child':
      return {
        pageID: childPageID,
        doc: {
          icon: '🐣',
          isDb: false,
          order: 0,
          parent: instructionsPageID,
          title: `Check me out, I'm a sub-page`,
          uid: uid,
        }
      }
    case 'recipesDB':
      return {
        pageID: recipesDBID,
        doc: {
          activeView: 'boardView',
          icon: '🍲',
          isDb: true,
          order: 1,
          parent: '',
          properties: {
            source: {
              displayName: 'Source',
              type: 'url',
              sortOrder: 0,
              created: getPrevTimestamp(),
            },
            lastmade: {
              displayName: 'Last made',
              type: 'date',
              sortOrder: 0,
              created: getPrevTimestamp(),
            },
            dish: {
              displayName: 'Dish', 
              type: 'select',
              sortOrder: 0,
              created: getPrevTimestamp(),
              selectOptions: {
                vegetable: {
                  displayName: '🥕 Vegetable',
                  color: 'green',
                  sortOrder: 0,
                },
                soup: {
                  displayName: '🍲 Soup',
                  color: 'brown',
                  sortOrder: 0,
                },
                main: {
                  displayName: '🥘 Main dish',
                  color: 'light gray',
                  sortOrder: 0,
                },
                dessert: {
                  displayName: '🧁 Dessert',
                  color: 'yellow',
                  sortOrder: 0,
                },
              }
            },
            tags: {
              displayName: 'Tags',
              type: 'multiselect',
              sortOrder: 0,
              created: getPrevTimestamp(),
              selectOptions: {
                pressure: {
                  displayName: '⏱ Pressure cooker',
                  color: 'pink',
                  sortOrder: 0,
                },
                vegan: {
                  displayName: '🌱 Vegan',
                  color: 'orange',
                  sortOrder: 0,
                },
                good: {
                  displayName: '👌 Good & Easy',
                  color: 'green',
                  sortOrder: 0,
                },
                tried: {
                  displayName: '👍 Tried & true',
                  color: 'green',
                  sortOrder: 0,
                },
              }
            },
            title: {
              displayName: 'Name',
              type: 'title',
              sortOrder: 0,
              created: getPrevTimestamp(),
            },
          },
          title: 'Sample database - recipes',
          uid: uid,
          views: {
            boardView: {
              displayName: 'Board view - By dish',
              groupBy: 'dish',
              type: 'board',
              visibleProperties: [
                'title',
                'tags',
              ],
            },
            listView: {
              displayName: 'List view',
              type: 'list',
              visibleProperties: [
                'title',
              ],
            },
            galleryView: {
              displayName: 'Gallery view',
              type: 'gallery',
              visibleProperties: [
                'title',
                'dish',
                'source',
                'tags'
              ],
            },
            tableView: {
              created: getPrevTimestamp(),
              displayName: 'Table view',
              type: 'board',
              visibleProperties: [
                'title',
                'tags',
                'lastmade',
                'dish',
                'source',
              ],
            },
          },
        }
      }
    case 'recipeRows':
      return {
        eggplant: {
          source: 'https://www.seriouseats.com/roasted-eggplant-tahini-pine-nut-lentil-vegan-experience-recipe',
          lastmade: '',
          dish: ['vegetable'],
          tags: ['vegan', 'tried'],
          uid: uid,
        }, 
        riceandlentils: {
          source: '',
          lastmade: '2021-10-10',
          dish: ['main'],
          tags: ['tried', 'good', 'pressure'],
          uid: uid,
        }, 
        icecream: {
          source: '',
          lastmade: '2021-11-23',
          dish: ['dessert'],
          tags: ['tried', 'good'],
          uid: uid,
        }, 
        misosoup: {
          source: 'https://pickledplum.com/japanese-miso-soup-recipe/',
          lastmade: '2022-01-01',
          dish: ['soup'],
          tags: ['good', 'tried'],
          uid: uid,
        }, 
        broccoli: {
          source: '',
          lastmade: '2021-12-21',
          dish: ['vegetable'],
          tags: ['tried', 'good', 'vegan'],
          uid: uid,
        }, 
        sample: {
          source: '',
          lastmade: '',
          dish: [],
          tags: [],
          uid: uid,
        }, 
      }
    case 'recipePages':
      return {
        eggplant: {
          doc: {
            icon: '🍆',
            title: 'Roasted eggplant',
            isDb: false,
            order: 3,
            parent: recipesDBID,
            uid: uid,
          },
          block: {
            content: `[{"type":"h1","children":[{"text":"Ingredients"}]},
            {"type":"bulletList","children":[{"type":"li","children":[{"text":"2 large Italian or small globe eggplants, about 1 pound (450g) each"}]},
            {"type":"li","children":[{"text":"4 tablespoons (60ml) extra-virgin olive oil"}]},
            {"type":"li","children":[{"text":"Kosher salt and freshly ground black pepper"}]},
            {"type":"li","children":[{"text":"4 large sprigs fresh rosemary"}]}]},
            {"type":"h1","children":[{"text":"Instructions"}]},
            {"type":"orderedList","children":[{"type":"li","children":[{"text":"Cut each eggplant in half, or cut a large eggplant into quarters. Score flesh with the tip of a paring knife in a cross-hatch pattern at 1-inch intervals."}]},
            {"type":"li","children":[{"text":"Transfer to a foil-lined rimmed baking sheet, cut side up, and brush each eggplant half with 1 tablespoon oil, letting each brushstroke be fully absorbed before brushing with more. Season with salt and pepper. Place a rosemary sprig on top of each one."}]},
            {"type":"li","children":[{"text":"Transfer to "},{"text":"450°F","bold":true,"backgroundColor":"rgba(253, 183, 63, 0.13)"},{"text":" oven and roast until completely tender and well charred, "},{"text":"25 to 35 minutes","bold":true,"backgroundColor":"rgba(253, 183, 63, 0.13)"},{"text":". Remove from oven and discard rosemary."}]}]}]`,
            order: 0,
            uid: uid,
          },
        }, 
        riceandlentils: {
          block: {
            order: 0,
            uid: uid,
            content: `[{"type":"h1","children":[{"text":"Ingredients"}]},
            {"type":"bulletList","children":[{"type":"li","children":[{"text":"2 tablespoons butter or oil"}]},
            {"type":"li","children":[{"text":"1 large shallot, sliced"}]},
            {"type":"li","children":[{"text":"Kosher salt"}]},
            {"type":"li","children":[{"text":"1 cup brown rice"}]},
            {"type":"li","children":[{"text":"1 cup black French lentils"}]},
            {"type":"li","children":[{"text":"2 cups chicken broth"}]}]},
            {"type":"h1","children":[{"text":"Instructions"}]},
            {"type":"orderedList","children":[{"type":"li","children":[{"text":"Turn Instant Pot on sauté at medium temperature."}]},
            {"type":"li","children":[{"text":"Melt butter. Add shallot and salt and stir. Cook until shallots are soft and beginning to brown."}]},
            {"type":"li","children":[{"text":"Add brown rice and stir in. Cook, stirring frequently, until the rice is toasted, about "},{"text":"2–3 minutes","bold":true,"backgroundColor":"rgba(253, 183, 63, 0.13)"},{"text":"."}]},
            {"type":"li","children":[{"text":"Stir in broth. Cover, seal valve, and cook on high pressure for "},{"text":"20 minutes","bold":true,"backgroundColor":"rgba(253, 183, 63, 0.13)"},{"text":"."}]},
            {"type":"li","children":[{"text":"Natural release for "},{"text":"at least 10 minutes","bold":true,"backgroundColor":"rgba(253, 183, 63, 0.13)"},{"text":". Fluff, season with additional salt if needed, and serve."}]}]}]`,
          },
          doc: {
            icon: '🍚',
            title: 'Instant Pot brown rice and lentils',
            isDb: false,
            order: 3,
            parent: recipesDBID,
            uid: uid,
          },
        }, 
        icecream: {
          block: {
            order: 0,
            uid: uid,
            content: `[{"type":"h1","children":[{"text":"Ingredients"}]},
            {"type":"bulletList","children":[{"type":"li","children":[{"text":"3/4 cup sugar"}]},
            {"type":"li","children":[{"text":"2 cup cream"}]},
            {"type":"li","children":[{"text":"1 cup milk"}]},
            {"type":"li","children":[{"text":"1/2 teaspoon kosher salt (or 1/4 teaspoon salt)"}]},
            {"type":"li","children":[{"text":"flavoring"}]}]},
            {"type":"h1","children":[{"text":"Instructions"}]},
            {"type":"orderedList","children":[{"type":"li","children":[{"text":"Combine ingredients in mixing bowl."}]},
            {"type":"li","children":[{"text":"Pour into 1.5-qt ice cream machine. Run according to instructions."}]},
            {"type":"li","children":[{"text":"Scoop into containers, eliminating air as much as possible. Freeze at least 4 hours (overnight is better) until ice cream is hard."}]}]},
            {"type":"h2","children":[{"text":"Flavor ideas"}]},
            {"type":"bulletList","children":[{"type":"li","children":[{"text":"chocolate","bold":true,"color":"rgba(174, 102, 29, 1)"},{"text":": add 1/4 cup cocoa powder"}]},
            {"type":"li","children":[{"text":"salted caramel","bold":true,"color":"rgba(203, 145, 47, 1)"},{"text":": make caramel with all the sugar using the dry method. Add 2 T butter, then add cream in 1/3 C batches to avoid seizing. Add milk and 1–1.5 t kosher salt, then chill thoroughly—AT LEAST 4 hours—before churning"}]},
            {"type":"li","children":[{"text":"cardamom coffee","bold":true,"color":"rgba(62, 143, 53, 1)"},{"text":": add 3 packets decaf instant coffee, 1 teaspoon vanilla, and 1/4 teaspoon cardamom. It may help to combine the coffee with cream and milk then refrigerate until dissolved, about two hours."}]},
            {"type":"li","children":[{"text":"brown sugar","bold":true,"color":"rgba(210, 82, 22, 1)"},{"text":": substitute sugar for 3/4 cup brown sugar and add 1/2 teaspoon vanilla extract"}]},
            {"type":"li","children":[{"text":"mint-chocolate chip","bold":true,"color":"rgba(62, 143, 53, 1)"},{"text":": add 1 teaspoon peppermint flavor, 1 teaspoon vanilla extract, and heaping 1/4 cup chocolate chips, chopped"}]},
            {"type":"li","children":[{"text":"vanilla","bold":true,"color":"rgba(96, 96, 98, 0.93)"},{"text":": add 1 T + 1/2 teaspoon vanilla extract"}]},
            {"type":"li","children":[{"text":"strawberry-balsamic","bold":true,"color":"rgba(203, 62, 132, 1)"},{"text":": reduce sugar to 6 T and add 1/2 cup strawberry preserves and 1 t balsamic vinegar"}]}]}]`,
          },
          doc: {
            icon: '🍨',
            title: 'Generic ice cream',
            isDb: false,
            order: 3,
            parent: recipesDBID,
            uid: uid,
          },
        }, 
        misosoup: {
          block: {
            order: 0,
            uid: uid,
            content: `[{"type":"h1","children":[{"text":"Ingredients"}]},
            {"type":"bulletList","children":[{"type":"li","children":[{"text":"4 cups water"}]},
            {"type":"li","children":[{"text":"1 tablespoon dashi granules"}]},
            {"type":"li","children":[{"text":"3–4 tablespoons miso paste (yellow is best, white or red is okay)"}]}]},
            {"type":"h1","children":[{"text":"Instructions"}]},
            {"type":"orderedList","children":[{"type":"li","children":[{"text":"Heat water in a pot with dashi granules."}]},
            {"type":"li","children":[{"text":"Place miso paste into a small strainer. Hold the strainer over the pot so that miso paste is submerged, and stir with chopsticks. Continue stirring until miso paste is all dissolved except for large solids."}]},
            {"type":"li","children":[{"text":"If soup is not hot enough, continue heating. Serve."}]}]}]`,
          },
          doc: {
            icon: '🥣',
            title: 'Miso soup',
            isDb: false,
            order: 3,
            parent: recipesDBID,
            uid: uid,
          },
        }, 
        broccoli: {
          block: {
            order: 0,
            uid: uid,
            content: `[{"type":"h1","children":[{"text":"Ingredients"}]},
            {"type":"bulletList","children":[{"type":"li","children":[{"text":"2 1-lb bags frozen broccoli florets"}]},
            {"type":"li","children":[{"text":"Olive oil"}]},
            {"type":"li","children":[{"text":"Kosher salt"}]}]},
            {"type":"h1","children":[{"text":"Instructions"}]},
            {"type":"orderedList","children":[{"type":"li","children":[{"text":"Preheat oven to "},{"text":"400°F","bold":true,"backgroundColor":"rgba(253, 183, 63, 0.13)"}]},
            {"type":"li","children":[{"text":"Place broccoli florets onto a rimmed baking sheet and toss with olive oil and salt."}]},
            {"type":"li","children":[{"text":"Roast until bottom side is browned, about "},{"text":"30 minutes","bold":true,"backgroundColor":"rgba(253, 183, 63, 0.13)"},{"text":", then flip each floret and roast until the second side is browned, about "},{"text":"10 minutes","bold":true,"backgroundColor":"rgba(253, 183, 63, 0.13)"},{"text":"."}]}]}]`,
          },
          doc: {
            icon: '🥦',
            title: 'Roasted broccoli',
            isDb: false,
            order: 3,
            parent: recipesDBID,
            uid: uid,
          },
        }, 
        sample: {
          doc: {
            icon: '❓',
            title: 'Drag and drop cards in a board view',
            isDb: false,
            order: 3,
            parent: recipesDBID,
            uid: uid,
          },
        }, 
      }
    default:
      throw new Error(`getSamplePage() doesn't know how to handle pageName ${pageName}`);
  }
}

////////////
// EXPORT //
////////////

export {
  VIEWMENU,
  PROPERTYTYPEICONS,
  getSamplePage
};