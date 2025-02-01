import React from "react";
function ListGroup() {
  let items = ["New York", "Tokyo", "London", "Beijing"];
  //items = [];

  //const handleClick = (event) => console.log(event);

  // hook
  //useState;

  //const message = items.length === 0 ? <p>No item found</p> : null;
  return (
    <>
      <h1>List</h1>
      {items.length === 0 && <p>No item found</p>}
      <ul className="list-group">
        {items.map((item, index) => (
          <li className="list-group-item" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
