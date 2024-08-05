import { Link } from 'react-router-dom';
import "../styles/footer.scss"

export default function Footer() {
  return (
    <footer>

      <div>
        <div className="footer-left">
          <Link to="">Created by:</Link>
          <Link to="">Mattias Lindblad</Link>
          <Link to="">Marcus Karlsson</Link>
        </div>
        
        <div className="footer-right">
          <Link to="/home">Home</Link>
          <Link to="/register">Register</Link>
          <Link to="/support">Support</Link>
          <Link to="/admin">Admin Panel</Link>
        </div>
      </div>

  </footer>
  );
}
