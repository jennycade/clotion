import { useEffect, useState } from 'react';

import './EmojiPicker.css';

import EmojiGroup from './EmojiGroup';

import { getTitles } from './helpers';

import emojiDb from './emoji.json';

const EmojiPicker = ( props ) => {
  // props
  const { handleIconClick } = props;

  // state
  const [emojis, setEmojis] = useState(emojiDb);
  const [groups, setGroups] = useState(getTitles(emojiDb, 'group'));
  const [filterText, setFilterText] = useState('');

  // useEffect -> reset groups when emojis changes
  useEffect(() => {

    const filterEmojis = ( filterText ) => {
      // TODO: make case-insensitive
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

  useEffect(() => {
    setGroups(getTitles(emojis, 'group'));
  }, [emojis])

  const handleFilterTextChange = (event) => {
    setFilterText(event.target.value);
  }

  return (
    <div className="emojiPicker">
      <header>
        <div className="titleBar">
          <span>Emoji</span>
          <span>😀 Random</span>
          <span>Remove</span>
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
  );
}

export default EmojiPicker;