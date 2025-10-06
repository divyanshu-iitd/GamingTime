import React from "react";


const Header = ({ title, username }) => {
  return (
    <header className="header">
      <h1>{title}</h1>
      <h3>Welcome, {username}!</h3>
      <hr />
    </header>
  );
};

export default Header;
