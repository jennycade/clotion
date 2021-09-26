import { useState, useEffect } from 'react';

const LiveBlock = ( props ) => {
  // props
  const { textContent } = props;

  // state
  const [text, setText] = useState(textContent);
  const [blockType, setBlockType] = useState('p');

  // effect: update blockType when text changes
  useEffect(() => {
    const mdKeys = {
      '# ': 'h1',
      '## ': 'h2',
      '### ': 'h3',
      '#### ': 'h4',
      '##### ': 'h5',
      '###### ': 'h6',
    };
    // does text start with any key from mdKeys?
    for (const [md, tag] of Object.entries(mdKeys)) {
      if (typeof text === 'string') {
        if (text.search(md) === 0) {
          // change block type
          setBlockType(tag);
  
          // remove md from text
          const newText = Array.from(text).slice(md.length).join('');
          setText(newText);
        }
      }
      
    }
  }, [text]);

  // input
  const handleInput = (event) => {
    console.log('I got input')
    // update text
    // const oldText = text;
    // const newText = event.target.value;

    // setText(newText);

    // const mdKeys = {
    //   '# ': 'h1',
    //   '## ': 'h2',
    //   '### ': 'h3',
    //   '#### ': 'h4',
    //   '##### ': 'h5',
    //   '###### ': 'h6',
    // };

    // // does text start with any key from mdKeys?
    // for (const [md, tag] of Object.entries(mdKeys)) {
    //   if (newText.search(md) === 0) {
    //     // change block type
    //     setBlockType(tag);

    //     // remove md from text
    //     const newerText = newText.splice(0, md.length);
    //     setText(newerText);
    //   }
    // }
  }

  if (blockType === 'p') {
    return (
      <p contentEditable={true} suppressContentEditableWarning={true} onInput={handleInput} >
        { text }
      </p>
    );
  }
  if (blockType === 'h1') {
    return (
      <h1 contentEditable={true} suppressContentEditableWarning={true} onInput={handleInput} >
        { text }
      </h1>
    );
  }
  
}

export default LiveBlock;