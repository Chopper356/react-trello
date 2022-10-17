import { useEffect, useState } from "react";

import "../styles/menu.scss";

function Menu(props) {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {

    const handleClick = (event) => {
      if (showMenu && !event.path.some(item => item.className === "dropdown-component")) {
        setShowMenu(false);
      }
    }

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick)
    };
  }, [showMenu]);

  return (
    <div className="dropdown-component">
      <div className="title" onClick={() => setShowMenu(!showMenu)}>
        {props.menuContent}
        {props.icon && <i className="far fa-ellipsis-h"></i>}
        <span>{props.menuText}</span>
      </div>

      <div className={`content ${showMenu ? 'show' : ''}`}>
        {
          showMenu &&
          props.children
        }
      </div>
    </div>
  );
}

export default Menu;