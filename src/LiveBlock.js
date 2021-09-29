import { useState, useMemo } from 'react';
import { Slate, Editable, withReact } from 'slate-react';
import { createEditor } from 'slate';

const LiveBlock = (props) => {
  // props
  const { updateContent } = props;

  // state
  const editor = useMemo(() => withReact(createEditor()), []);

  // pull value from props
  const [value, setValue] = useState(
    JSON.parse(props.textContent)
  //   JSON.parse(props.textContent) || [
  //   {
  //     type: 'paragraph',
  //     children: [{ text: 'A line of text in a paragraph.' }],
  //   },
  // ]
  );

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={value => {
        setValue(value);

        const isAstChange = editor.operations.some(
          op => 'set_selection' !== op.type
        );
        if (isAstChange) {
          // save the value to the database
          const content = JSON.stringify(value);
          updateContent(content);
        }
      }
      }
    >
      <Editable />
    </Slate>
  );
}

export default LiveBlock;