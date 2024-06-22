import { Link } from 'react-router-dom';
import globeIcon from '../images/Globe.png';
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
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/services">Services</Link>
        </div>
      </div>

  </footer>
  );
}
