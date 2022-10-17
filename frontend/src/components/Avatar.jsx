import "../styles/header.scss"

function Avatar({ name, bgcolor = "white", color = "black" }) {
  return (
    <div className="avatar fs-4" style={{ backgroundColor: bgcolor, color }}>{name[0]}</div>
  );
}

export default Avatar;