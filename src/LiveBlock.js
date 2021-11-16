import { useState, useMemo, useCallback } from 'react';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { createEditor, Editor, Transforms, Text, Element as SlateElement, Range } from 'slate';

import './LiveBlock.css';

// block components
import Todo from './Todo';
import DynamicPageLink from './DynamicPageLink';

// toolbars
import BlockToolbar from './BlockToolbar';
import SpanToolbar from './SpanToolbar';
import Page from './Page';

const CustomEditor = {
  ///////////////
  // IS ACTIVE //
  ///////////////
  TOGGLEMARKS: ['bold', 'italic', 'underline', 'strikethrough', 'code'],

  isMarkActive(editor, mark) {
    if (!this.TOGGLEMARKS.includes(mark)) {
      throw new Error(`CustomEditor.isMarkActive called with invalid mark: ${mark}.`);
    }
    const [match] = Editor.nodes(editor, {
      match: n => n[mark] === true,
      universal: true,
    });

    return !!match;
  },

  // spans
  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.bold === true,
      universal: true,
    })

    return !!match
  },
  isItalicMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.italic === true,
      universal: true,
    });
    return !!match;
  },
  isUnderlineMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.underline === true,
      universal: true,
    });
    return !!match;
  },
  isStrikethroughMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.strikethrough === true,
      universal: true,
    });
    return !!match;
  },
  isCodeMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.code === true,
      universal: true,
    });
    return !!match;
  },

  // blocks
  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === 'code',
    })

    return !!match
  },
  isHeadingOneBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === 'h1',
    })

    return !!match
  },


  ////////////
  // TOGGLE //
  ////////////

  // spans
  toggleMark(editor, mark) {
    const TOGGLEMARKS = ['bold', 'italic', 'underline', 'strikethrough', 'code'];
    if (!TOGGLEMARKS.includes(mark)) {
      throw new Error(`CustomEditor.toggleMark called with invalid mark: ${mark}.`);
    }

    const isActive = CustomEditor.isMarkActive(editor, mark);
    
    const newObj = {};
    newObj[mark] = isActive ? null : true;

    Transforms.setNodes(
      editor,
      newObj,
      { match: n => Text.isText(n), split: true }
    );
  },

  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor)
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    )
  },
  toggleItalicMark(editor) {
    const isActive = CustomEditor.isItalicMarkActive(editor);
    Transforms.setNodes(
      editor,
      { italic: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    )
  },
  toggleUnderlineMark(editor) {
    const isActive = CustomEditor.isUnderlineMarkActive(editor);
    Transforms.setNodes(
      editor,
      { underline: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    )
  },
  toggleStrikethroughMark(editor) {
    const isActive = CustomEditor.isStrikethroughMarkActive(editor);
    Transforms.setNodes(
      editor,
      { strikethrough: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    )
  },
  toggleCodeMark(editor) {
    const isActive = CustomEditor.isCodeMarkActive(editor);
    Transforms.setNodes(
      editor,
      { code: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    )
  },


  ///////////////
  // SET SPANS //
  ///////////////
  setSpanColor(editor, colorName) {
    const color = CustomEditor.getColorCode(colorName, 'color');
    Transforms.setNodes(
      editor,
      { color: color },
      { match: n => Text.isText(n), split: true}
    );
  },
  setSpanBackgroundColor(editor, colorName) {
    const color = CustomEditor.getColorCode(colorName, 'bgColor');
    Transforms.setNodes(
      editor,
      { backgroundColor: color },
      { match: n => Text.isText(n), split: true}
    );
  },

  ////////////////
  // SET BLOCKS //
  ////////////////
  setBlock(editor, type, blockParams = {}) {
    const listTypes = ['todoList', 'orderedList', 'bulletList'];

    let options = {type: type}; // pass as-is for simple blocks. modify for lists, todos, links...
    
    Transforms.unwrapNodes(editor, {
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        listTypes.includes(n.type),
      split: true,
    });
    // lists: wrap node
    if (listTypes.includes(type)) {
      const block = { type: type, children: [] }
      Transforms.wrapNodes(editor, block);
      options.type = 'li';

      // special: todo list items!
      if (type === 'todoList') {
        options.type = 'todoListItem';
        options.completed = false;
      }
    }

    // pages
    if (type === 'page') {
      options.id = blockParams.pageId; 
    }

    // for all: set node
    Transforms.setNodes(
      editor,
      options,
      { match: n => Editor.isBlock(editor, n) }
    )
  },

  ///////////////////////
  // TEXT MANIPULATION //
  ///////////////////////
  deleteToLastSlash(editor) {
    while (CustomEditor.getLastCharacter(editor) !== '/') {
      Editor.deleteBackward(editor);
    }
    Editor.deleteBackward(editor);
  },

  getTextAfterLastSlash(editor) {
    const cursorLocation = Range.start(editor.selection);
    let rangeStart = Editor.before(editor, cursorLocation, {unit: 'character'});

    while (rangeStart) {
      let range = Editor.range(editor, rangeStart, cursorLocation);
      let text = Editor.string(editor, range);

      if (text.match(/\/.*/)) {
        return text.slice(1);
      }

      // step one character back
      rangeStart = Editor.before(editor, rangeStart, {unit: 'character'});
    }

    // didn't find it
    throw new Error (`Could not find slash before selection in LiveBlock.`);
    // console.log(`Could not find slash before selection in LiveBlock.`);
  },



  /////////////
  // HELPERS //
  /////////////
  getLastCharacter(editor) {
    const cursorLocation = Range.start(editor.selection);
    const prevCharLoc = Editor.before(editor, editor.selection, {unit: 'character'});
    const prevCharRange = Editor.range(editor, prevCharLoc, cursorLocation);
    const prevChar = Editor.string(editor, prevCharRange);
    return prevChar;
  },

  getColorCode(colorName, type) {
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
}

export { CustomEditor };

const LiveBlock = (props) => {
  // props
  const { id, updateContent, addPage, redirect } = props;

  // state
  // const editor = useMemo(() => withReact(withMentions(createEditor()), []));
  const editor = useMemo(() => withReact(withPages(withDividers(createEditor()))), []);
  const [showBlockToolbar, setShowBlockToolbar] = useState(false);
  const [blockToolbarFromSlash, setBlockToolbarFromSlash] = useState(false);

  // pull value from props
  const [value, setValue] = useState(
    JSON.parse(props.content)
  );

  //////////////////////////////
  // RENDER ELEMENTS & LEAVES //
  //////////////////////////////

  const renderElement = useCallback((props) => {
    switch(props.element.type) {
      case 'h1':
        return <HeadingOneElement {...props} />
      case 'h2':
        return <HeadingTwoElement {...props} />
      case 'h3':
        return <HeadingThreeElement {...props} />
      case 'h4':
        return <HeadingFourElement {...props} />
      case 'h5':
        return <HeadingFiveElement {...props} />
      case 'h6':
        return <HeadingSixElement {...props} />
      case 'li':
        return <ListItemElement {...props} />
      case 'todoList':
        return <TodoListElement {...props} />
      case 'todoListItem':
        return (<Todo
          completed={props.element.completed}
          handleTodoClick={CustomEditor.handleTodoClick}
          {...props.attributes}
          {...props}
        >
        </Todo>);
      case 'orderedList':
        return <OrderedListElement {...props} />
      case 'bulletList':
        return <BulletListElement {...props} />
      case 'code':
        return <CodeElement {...props} />
      case 'quote':
        return <QuoteElement {...props} />
      case 'divider':
        return <DividerElement {...props} />
      case 'callout':
        return <CalloutElement {...props} />
      case 'page':
        return (
          <PageLinkElement
            id={props.element.id}
            {...props}
          />
        );
      default:
        return <DefaultElement {...props} />
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />
  }, [])

  ///////////////////////
  // TOOLBARS / BLOCKS //
  ///////////////////////
  const handleBlockToolbarChoice = async (blockType) => {
    const overrideBlocks = ['page',];

    let newPageId;

    if (overrideBlocks.includes(blockType)) {
      switch (blockType) {
        case 'page':
          // add page
          newPageId = await addPage();
          // setBlock
          CustomEditor.setBlock(editor, blockType, {pageId: newPageId});
          break;
      }
    } else {
      // a normal block! Proceed.
      CustomEditor.setBlock(editor, blockType);
    }


    if (blockToolbarFromSlash) {
      CustomEditor.deleteToLastSlash(editor);
      // reset for next time
      setBlockToolbarFromSlash(false);
    }

    // hide toolbar
    setShowBlockToolbar(false);

    // made a new page? redirect
    if (blockType === 'page') {
      redirect(newPageId);
    }
  }

  const handleColorChoice = (type, colorName) => {
    if (type === 'color') {
      CustomEditor.setSpanColor(editor, colorName);
    } else if (type === 'bgColor') {
      CustomEditor.setSpanBackgroundColor(editor, colorName);
    } else {
      throw new Error(`Invalid color type supplied to handleColorChoice: ${type} (should be 'color' or 'bgColor')`);
    }
    // hide toolbar... or not?
  }

  return (
    <Slate
      editor={editor}
      value={value}
      placeholder="Type something"
      onChange={value => {
        setValue(value);

        const isAstChange = editor.operations.some(
          op => 'set_selection' !== op.type
        );
        if (isAstChange) {
          // save the value to the database
          const content = JSON.stringify(value);
          updateContent(id, content);
        }
      }
      }
    >
      { showBlockToolbar && 
        <BlockToolbar
          hideToolbar={ () => setShowBlockToolbar(false) }
          chooseBlock={ handleBlockToolbarChoice }
          getTextAfterLastSlash={ () => CustomEditor.getTextAfterLastSlash(editor)}
        />
      }
      <SpanToolbar
        chooseBlock={ handleBlockToolbarChoice }
        chooseColor={ handleColorChoice }
        getColorCode={ CustomEditor.getColorCode }
        toggleMark={ (mark) => CustomEditor.toggleMark(editor, mark) }
        isMarkActive={ (mark) => CustomEditor.isMarkActive(editor, mark) }
      />
      <Editable
        renderElement={ renderElement }
        renderLeaf={ renderLeaf }
        onKeyDown={event => {
          ///////////////////
          // BLOCK TOOLBAR //
          ///////////////////

          if (event.key === '/') {
            setShowBlockToolbar(true);
            setBlockToolbarFromSlash(true);
          }

          //////////////
          // COMMANDS //
          //////////////

          if (!event.metaKey) {
            return;
          }

          ///////////
          // SPANS //
          ///////////
          if (event.key === 'b') {
            event.preventDefault();
            CustomEditor.toggleBoldMark(editor);
          }
          if (event.key === 'i') {
            event.preventDefault();
            CustomEditor.toggleItalicMark(editor);
          }
          if (event.key === 'u') {
            event.preventDefault();
            CustomEditor.toggleUnderlineMark(editor);
          }
          if (event.key === 'S') {
            event.preventDefault();
            CustomEditor.toggleStrikethroughMark(editor);
          }
          if (event.key === 'k') {
            // TODO: link
          }
          if (event.key === 'e') {
            event.preventDefault();
            CustomEditor.toggleCodeMark(editor);
          }

          ////////////
          // BLOCKS //
          ////////////

          if (event.altKey) {
            switch (event.code) {
              case 'Digit1' || 'Numpad1':
                event.preventDefault();
                CustomEditor.setBlock(editor, 'h1');
                break;
              case 'Digit2' || 'Numpad2':
                event.preventDefault();
                CustomEditor.setBlock(editor, 'h2');
                break;
              case 'Digit3' || 'Numpad3':
                event.preventDefault();
                CustomEditor.setBlock(editor, 'h3');
                break;
              case 'Digit4' || 'Numpad4':
                event.preventDefault();
                CustomEditor.setBlock(editor, 'todoList');
                break;
              case 'Digit5' || 'Numpad5':
                event.preventDefault();
                CustomEditor.setBlock(editor, 'bulletList');
                break;
              case 'Digit6' || 'Numpad6':
                event.preventDefault();
                CustomEditor.setBlock(editor, 'orderedList');
                break;
              case 'Digit7' || 'Numpad7':
                event.preventDefault();
                CustomEditor.setBlock(editor, 'toggle'); // TODO: implement!
                break;
              case 'Digit8' || 'Numpad8':
                event.preventDefault();
                CustomEditor.setBlock(editor, 'code');
                break;
              case 'Digit9' || 'Numpad9':
                event.preventDefault();
                CustomEditor.setBlock(editor, 'page');
                break;
              case 'Digit0' || 'Numpad0':
                event.preventDefault();
                CustomEditor.setBlock(editor, 'paragraph');
                break;
              default:
                break;
            }
          }
        }}
      />
    </Slate>
  );
}

////////////
// BLOCKS //
////////////

const CodeElement = ( props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
}
const DefaultElement = (props) => {
  return (
    <p {...props.attributes}>
      {props.children}
    </p>
  );
}
const HeadingOneElement = (props) => {
  return (
    <h1 {...props.attributes}>
      {props.children}
    </h1>
  )
}
const HeadingTwoElement = (props) => {
  return (
    <h2 {...props.attributes}>
      {props.children}
    </h2>
  )
}
const HeadingThreeElement = (props) => {
  return (
    <h3 {...props.attributes}>
      {props.children}
    </h3>
  )
}
const HeadingFourElement = (props) => {
  return (
    <h4 {...props.attributes}>
      {props.children}
    </h4>
  )
}
const HeadingFiveElement = (props) => {
  return (
    <h5 {...props.attributes}>
      {props.children}
    </h5>
  )
}
const HeadingSixElement = (props) => {
  return (
    <h2 {...props.attributes}>
      {props.children}
    </h2>
  )
}
const TodoListElement = (props) => {
  return (
    <ul className="todoList" {...props.attributes}>
      {props.children}
    </ul>
  );
}
const OrderedListElement = (props) => {
  return (
    <ol {...props.attributes}>
      {props.children}
    </ol>
  );
}
const BulletListElement = (props) => {
  return (
    <ul {...props.attributes}>
      {props.children}
    </ul>
  );
}
const ListItemElement = (props) => {
  return (
    <li {...props.attributes}>
      {props.children}
    </li>
  );
}
const QuoteElement = (props) => {
  return (
    <blockquote {...props.attributes}>
      {props.children}
    </blockquote>
  )
}
const DividerElement = (props) => {
  return (
    <div {...props.attributes}>
      {props.children}
      <hr contentEditable={false} />
    </div>
  );
}
const CalloutElement = (props) => {
  return (
    <aside className="callout" {...props.attributes}>
      {props.children}
    </aside>
  )
}
const PageLinkElement = (props) => {
  return (
    <div {...props.attributes}>
      {props.children}
      <DynamicPageLink
        id={props.id}
        style={{ userSelect: "none" }}
        contentEditable={false}
        {...props.attributes}
      >
      </DynamicPageLink>
    </div>
  )
}

///////////
// SPANS //
///////////

const Leaf = props => {
  return (
    <span
      {...props.attributes}
      style={
        {
          fontWeight: props.leaf.bold ? 'bold' : 'normal',
          fontStyle: props.leaf.italic ? 'italic' : 'normal',
          textDecoration: props.leaf.underline ? 'underline' : 
            props.leaf.strikethrough ? 'line-through' : 'normal',
          fontFamily: props.leaf.code ? 'monospace' : 'inherit',
          color: props.leaf.color || 'inherit',
          backgroundColor: props.leaf.backgroundColor || 'inherit',
        }
      }
    >
      {props.children}
    </span>
  )
}


////////////////////////////////
// withMentions --> withPages //
////////////////////////////////
const withPages = editor => {
  const { isVoid } = editor

  editor.isVoid = element => {
    return element.type === 'page' ? true : isVoid(element)
  }

  return editor;
}
const withDividers = editor => {
  const { isVoid } = editor

  editor.isVoid = element => {
    return element.type === 'divider' ? true : isVoid(element)
  }

  return editor;
}


export default LiveBlock;