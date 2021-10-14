import { useState, useMemo, useCallback } from 'react';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { createEditor, Editor, Transforms, Text, Element as SlateElement, Range } from 'slate';

import './LiveBlock.css';

// block components
import Todo from './Todo';

// toolbars
import BlockToolbar from './BlockToolbar';

const CustomEditor = {
  ///////////////
  // IS ACTIVE //
  ///////////////

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

  ////////////////
  // SET BLOCKS //
  ////////////////
  setBlock(editor, type) {
    const listTypes = ['todoList', 'orderedList', 'bulletList'];

    let options = {type: type}; // pass as-is for simple blocks. modify for lists and todos
    
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
  }
}

export { CustomEditor };

const LiveBlock = (props) => {
  // props
  const { id, updateContent } = props;

  // state
  const editor = useMemo(() => withReact(createEditor()), []);
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
          completed={props.completed}
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
      default:
        return <DefaultElement {...props} />
    }
  }, []);

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />
  }, [])

  /////////////
  // TOOLBAR //
  /////////////
  const handleBlockToolbarChoice = (blockType) => {
    CustomEditor.setBlock(editor, blockType);

    if (blockToolbarFromSlash) {
      CustomEditor.deleteToLastSlash(editor);
      // reset for next time
      setBlockToolbarFromSlash(false);
    }

    // hide toolbar
    setShowBlockToolbar(false);
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
const TodoListItemElement = (props) => {
  return (
    <Todo
      completed={props.completed}
      handleTodoClick={CustomEditor.handleTodoClick}
      {...props.attributes}
    >
      {props.children}
    </Todo>
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
        }
      }
    >
      {props.children}
    </span>
  )
}


export default LiveBlock;