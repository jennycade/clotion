import { useState, useMemo, useCallback } from 'react';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor, Editor, Transforms, Text } from 'slate';

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

  // blocks

  toggleCodeBlock(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor)
    Transforms.setNodes(
      editor,
      { type: isActive ? null : 'code' },
      { match: n => Editor.isBlock(editor, n) }
    )
  },
}


const LiveBlock = (props) => {
  // props
  const { id, updateContent } = props;

  // state
  const editor = useMemo(() => withReact(createEditor()), []);

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
  // HOTKEYS //
  /////////////

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
      <Editable
        renderElement={ renderElement }
        renderLeaf={ renderLeaf }
        onKeyDown={event => {
          if (!event.metaKey) {
            return;
          }

          switch (event.key) {
            ////////////
            // BLOCKS //
            ////////////
            case '`': {
              // prevent the '`' from being inserted by default.
              event.preventDefault();
              CustomEditor.toggleCodeBlock(editor);
              break;
            }
            ///////////
            // SPANS //
            ///////////
            case 'b': {
              event.preventDefault();
              CustomEditor.toggleBoldMark(editor);
              break;
            }
            case 'i': {
              event.preventDefault();
              CustomEditor.toggleItalicMark(editor);
              break;
            }
            case 'u': {
              event.preventDefault();
              CustomEditor.toggleUnderlineMark(editor);
              break;
            }
            case 's': {
              event.preventDefault();
              CustomEditor.toggleStrikethroughMark(editor);
              break;
            }
            case 'e': {
              event.preventDefault();
              CustomEditor.toggleCodeMark(editor);
              break;
            }
            default: {
              return;
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