const Todo = (props) => {
  // props
  // const { completed, handleTodoClick } = props;

  return (
    <li className='todo'
      {...props.attributes}
      
    >
      {props.children}
    </li>
  );
}

export default Todo;