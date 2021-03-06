import { useEffect, useState } from 'react';

import './EmojiPicker.css';

import Popup from './Popup';
import EmojiGroup from './EmojiGroup';

import { getTitles } from './helpers';

import emojiDb from './emoji.json';

const EmojiPicker = ( props ) => {
  // props
  const { handleIconClick, exit } = props;

  // state
  const [emojis, setEmojis] = useState(emojiDb);
  const [groups, setGroups] = useState(getTitles(emojiDb, 'group'));
  const [filterText, setFilterText] = useState('');

  
  useEffect(() => {

    const filterEmojis = ( filterText ) => {
      if (filterText !== '') {
        let text = filterText.toLocaleLowerCase();
        const filteredEmojis = emojiDb.filter((emoji) => emoji.name.includes(text) ||
          emoji.sub_group.includes(text));
        return filteredEmojis;
      }
      return emojiDb;
    }

    const filteredEmojis = filterEmojis(filterText);
    setEmojis(filteredEmojis);
    
  }, [filterText]);

  // useEffect -> reset groups when emojis changes
  useEffect(() => {
    setGroups(getTitles(emojis, 'group'));
  }, [emojis]);

  // functions
  const handleFilterTextChange = (event) => {
    setFilterText(event.target.value);
  }

  const selectRandomEmoji = () => {
    // choose randomly from all emojis, not filtered list
    const i = Math.floor( Math.random() * emojiDb.length );
    const newEmoji = emojiDb[i];
    
    handleIconClick(newEmoji.emoji);
  }

  return (
    <Popup exit={ exit }>
      <div className="emojiPicker">
        <header>
          <div className="titleBar">
            <span>
              <span>Emoji</span>
            </span>
            <span className="rightFlex">
              <span className="linklike" onClick={ selectRandomEmoji }>😀 Random</span>
              <span className="linklike" onClick={ () => handleIconClick('') }>Remove</span>
            </span>
          </div>

          <div className="inputArea">
            <input type="text" placeholder="Filter…" onChange={ handleFilterTextChange } />
          </div>

        </header>
        <div className="content">
        { groups.map((group) => {
            return (
              <EmojiGroup group={ group } key={ group } handleIconClick={ handleIconClick }
                emojis={ emojis.filter((emoji) => emoji.group === group ) }
              />
            );
          })
        }
        { emojis.length === 0 && 
          <p className="noResults">No results</p>
        }
        </div>


      </div>
    </Popup>
    
  );
}

export default EmojiPicker;