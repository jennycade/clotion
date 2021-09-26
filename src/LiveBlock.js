import { useReducer } from 'react';

// reducer
const reducer = (content, action) => {
  if (action.type === 'updateText') {
    const newContent = {...content};
    content.text = action.payload;
    return newContent;
  }
}

const LiveBlock = ( props ) => {
  // props
  const { textContent } = props;

  

  // useReducer
  const [state, dispatch] = useReducer(reducer, {text: textContent, blockType: 'p'});

  // updating
  const handleInput = (e) => {
    const newContent = e.target.innerHtml;
    dispatch({
      type: 'updateText',
      payload: newContent,
    });
  }

  if (state.blockType === 'p') {
    return (
      <p contentEditable={true} suppressContentEditableWarning={true} onInput={handleInput} >
        { state.text }
      </p>
    );
  }
  if (state.blockType === 'h1') {
    return (
      <h1 contentEditable={true} suppressContentEditableWarning={true} onInput={handleInput} >
        { state.text }
      </h1>
    );
  }
  return (
    <p>Something has gone wrong.</p>
  );
  
}

export default LiveBlock;