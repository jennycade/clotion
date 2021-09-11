const EmojiGroup = ( props ) => {
  // props
  const { group, emojis } = props;

  return (
    <div className="emojiGroup">
      <h1>{ group }</h1>
      <ul className="emojiGrid">
      { emojis.map((emoji) => {
        return (
          <li key={ emoji.codepoints }>
            { emoji.emoji + emoji.name}
          </li>
        );
      }) }
      </ul>
    </div>
  );
}

export default EmojiGroup;