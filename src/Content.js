import { useState } from 'react';
import Block from './Block';

import EditBlock from './EditBlock';

const Content = ( props ) => {
  // props
  const { handleContentChange, updateContent, content } = props

  // state
  const [editing, setEditing] = useState(false);

  // switch to editing mode
  const enterEditingMode = () => {
    setEditing(true);
  }

  const leaveEditingMode = () => {
    setEditing(false);
    updateContent();
  }

  return (
    <div className="content">
      { editing && <EditBlock handleContentChange={handleContentChange} content={ content } leaveEditingMode={ leaveEditingMode } />}
      { (!editing) && <Block enterEditingMode={ enterEditingMode } content={ content } /> }
    </div>
  );
};

export default Content;