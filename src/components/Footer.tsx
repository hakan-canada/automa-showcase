
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/quote" className="text-muted-foreground hover:text-primary transition-colors">
                  Request Quote
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a 
                  href="mailto:quote@partssupplied.com" 
                  className="hover:text-primary transition-colors"
                >
                  quote@partssupplied.com
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">About Us</h3>
            <p className="text-muted-foreground">
              Providing quality industrial automation solutions and products from leading manufacturers.
            </p>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PartsSupplied. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
