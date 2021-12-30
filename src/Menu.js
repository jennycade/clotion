import './Menu.css';

const Menu = (props) => {
  // props
  const { menuItems, choose, className } = props;

  // arr menuItems = [
  // 	{
  //    id,
  // 		displayText,
  //    displayIcon, // optional
  // 		onChoose, // or use choose(id) if not defined
  //    moreButton, // JSX!
  // 		category // optional (currently not used)
  // 	},
  // 	...
  // ]

  // categories?
  // let categories;

  // if (menuItems.length > 0 && Object.keys(menuItems[0]).includes('category')) {
  //   // get all categories
  //   categories = menuItems.map(item => item.category);
  //   // remove duplicates
  //   categories = [...new Set(categories)];
  // }

  return (
    <ul className={className ? className : 'menu'}>
      {
        menuItems.map(item => {

          // className based on what elements are there to rendered
          let liClassName = '';
          if (!!item.displayIcon && item.moreButton) {
            liClassName = 'iconNameButtonGrid';
          } else if (!!item.displayIcon) {
            liClassName = 'grid';
          } else if (!! item.moreButton) {
            liClassName = 'rightButtonGrid';
          }

          const handleClick = !!item.onChoose ? item.onChoose : () => choose(item.id)
          
          return (
            <li
              key={item.id}
              className={liClassName}
              onClick={ handleClick }
            >
              {/* ICON */}
              {!! item.displayIcon && 
                <span className='icon'>
                  {item.displayIcon}
                </span>
              }
              {/* TEXT */}
              <span>
                {item.displayText}
              </span>
              {/* MORE BUTTON */}
              { !! item.moreButton &&
                item.moreButton
              }
            </li>
          )
        })
      }
    </ul>
  )
}

export default Menu;