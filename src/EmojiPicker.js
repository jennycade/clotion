import { useState } from 'react';

import './EmojiPicker.css';

import { getTitles } from './helpers';

import emojiDb from './emoji.json';

const EmojiPicker = ( props ) => {
  // state
  const [emojis, setEmojis] = useState(emojiDb);
  const [groups, setGroups] = useState(getTitles(emojiDb, 'group'));

  // useEffect -> reset groups when emojis changes  

  return (
    <div className="emojiPicker">
      <header>
        <div className="titleBar">
          <span>Emoji</span>
          <span>😀 Random</span>
          <span>Remove</span>
        </div>

        <div className="inputArea">
          <input type="text" placeholder="Filter…" />
        </div>

      </header>
      <div className="content">
        
      </div>


    </div>
  );
}

export default EmojiPicker;