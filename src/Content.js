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

  const INPUTTYPES = {
    'span': 'text',
    'title': 'text',
    'text': 'textarea',
    'date': 'date',
  }

  return (
    <div className="content">
      { editing && INPUTTYPES[element] === 'textarea' &&
        <textarea
          onChange={ handleContentChange }
          onBlur={ leaveEditingMode }
          autoFocus={ true }
          value={ content }
        />
      }

      { editing && INPUTTYPES[element] !== 'textarea' &&
        <input type={ INPUTTYPES[element] }
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