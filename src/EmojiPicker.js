import { useEffect, useState } from 'react';

import './EmojiPicker.css';

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
  }, [emojis]);

  // event listener for clicking outside the picker --> close it
  useEffect(() => {
    const escape = (event) => {
      // console.table(); // return to this part!!!!!!!
      if (event.target.classList.contains('page')) { // clicked outside the image and menu
        exit();
      }
    }
    window.addEventListener('click', escape);
    // clean up
    return () => {
      window.removeEventListener('click', escape);
    }
  });

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
  );
}

export default EmojiPicker;