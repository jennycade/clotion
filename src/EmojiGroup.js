const EmojiGroup = ( props ) => {
  // props
  const { group, emojis, handleIconClick } = props;

  return (
    <div className="emojiGroup">
      <h1>{ group }</h1>
      <ul className="emojiGrid">
      { emojis.map((emoji) => {
        return (
          <li key={ emoji.codepoints } onClick={ () => handleIconClick(emoji.emoji) } >
            { /* onHover --> show emoji.name */ }
            { emoji.emoji }
            
          </li>
        );
      }) }
      </ul>
    </div>
  );
}

export default EmojiGroup;