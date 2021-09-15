// import { useRef } from 'react';

const EditBlock = ( props ) => {
  // props
  const { handleContentChange, content, leaveEditingMode } = props;

  // ref
  // const textAreaRef = useRef(null);

  return (
    <textarea
      // ref={ textAreaRef }
      onChange={ handleContentChange }
      onBlur={ leaveEditingMode }
      autoFocus={ true }
      value={ content }
    />
  );
}

export default EditBlock;