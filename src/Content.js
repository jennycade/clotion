import { useState } from 'react';

import EditBlock from './EditBlock';

const Content = ( props ) => {
  // props
  // const {  } = props

  // state
  const [content, setContent] = useState(props.content)
  const [editing, setEditing] = useState(false);

  // switch to editing mode
  const enterEditingMode = () => {
    setEditing(true);
  }

  const leaveEditingMode = () => {
    setEditing(false);
  }

  // input
  const handleContentChange = ( event ) => {
    const newVal = event.target.value;
    setContent(newVal);
  }

  return (
    <div className="content">
      { editing && <EditBlock handleContentChange={handleContentChange} content={ content } leaveEditingMode={ leaveEditingMode } />}
      { !editing && <div className="content" onClick={ enterEditingMode }>{ content }</div> }
    </div>
  );
};

export default Content;