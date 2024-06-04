// import '../styles/styles.css';

const Header = () => {
  return (
    <header className="header-style">
      <h1>Todo Website</h1>
      <nav>
        <ul className="ul-style">
          <li className="li-style">
            <a href="#" className="link-style">My Page</a>
          </li>
          <li className="li-style">
            <button className="button-style-header">Logout</button>
          </li>
          <li className="li-style">
            <a href="/login" className="link-style">Login</a>
          </li>
          <li className="li-style">
            <a href="/register" className="link-style">Register</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
