import { useState } from 'react';

const Content = ( props ) => {
  // props
  const { handleContentChange, updateContent, content, element } = props

  // state
  const [editing, setEditing] = useState(false);

  // switch to editing mode
  const enterEditingMode = () => {
    setEditing(true);
  }

  const leaveEditingMode = (event) => {
    setEditing(false);
    updateContent(event);
  }

  const inputTextElements = [ 'span', ];

  return (
    <div className="content">
      { editing && element !== 'h1' && !inputTextElements.includes(element) &&
        <textarea
          onChange={ handleContentChange }
          onBlur={ leaveEditingMode }
          autoFocus={ true }
          value={ content }
        />
      }
      { editing && element === 'h1' &&
        <h1><input type="text"
          onChange={ handleContentChange }
          onBlur={ leaveEditingMode }
          autoFocus={ true }
          value={ content }
        /></h1>
      }
      { editing && inputTextElements.includes(element) &&
        <input type="text"
          onChange={ handleContentChange }
          onBlur={ leaveEditingMode }
          autoFocus={ true }
          value={ content }
        />
      }

      { (!editing) &&
        <div className="block" onClick={ enterEditingMode } >
          { props.children }
        </div>
      }
    </div>
  );
};

export default Content;