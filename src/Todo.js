const Todo = (props) => {
  // props
  const { completed, handleTodoClick } = props;

  return (
    <li className='todo'
      {...props.attributes}
      
    >
      <input
        type='checkbox'
        checked={ completed }
        style={{ userSelect: "none" }}
        contentEditable={false}
        onChange={event => handleTodoClick(event.target.checked, props.element) }
      />
      {props.children}
    </li>
  );
}

export default Todo;