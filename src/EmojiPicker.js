import './EmojiPicker.css';

const EmojiPicker = ( props ) => {

  

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
        <h1>People</h1>
      </div>


    </div>
  );
}

export default EmojiPicker;