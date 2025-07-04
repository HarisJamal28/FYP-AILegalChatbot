// Summary: This file contains the layout of the website. It includes the header, footer and the main content of the website.
import { useLocation } from "react-router-dom";

import Header from '../Header/MiniHeader.jsx';
import FullHeader from '../Header/NewHeader.jsx';
import MainHeader from '../Header/MainHeader.jsx';
import Footer from '../Footer/footerlegal.jsx';
import NewFooter from '../Footer/NewFooter.jsx';
import Routers from '../../Router/routes.jsx';
import InfoCards from '../Cards/Cards.jsx';
import './layout.css';

const Layout = () => {
  const location = useLocation();

  // List of paths where you want to hide headers and footers
  const noHeaderPaths = ["/chatbot"];
  const hideHeaders = noHeaderPaths.includes(location.pathname);

  return (
    <div className="relative"> {/* Make this container relative */}
      {!hideHeaders && (
        <>
          <Header />
          <FullHeader />
          {/* <MainHeader /> */}

          {/* Social Media Icons */}
          <div className="fixed top-1/3 right-0 transform -translate-y-1/2 hidden md:flex flex-col space-y-4 p-2 z-50">
            <a
              href="#"
              className="bg-green-600 text-white hover:bg-green-700 w-12 h-12 flex items-center justify-center shadow-md transition flip-on-hover"
              style={{ clipPath: 'circle(50%)' }}
            >
              <i className="fab fa-facebook-f text-xl"></i>
            </a>
            <a
              href="#"
              className="bg-green-600 text-white hover:bg-green-700 w-12 h-12 flex items-center justify-center shadow-md transition flip-on-hover"
              style={{ clipPath: 'circle(50%)' }}
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a
              href="#"
              className="bg-green-600 text-white hover:bg-green-700 w-12 h-12 flex items-center justify-center shadow-md transition flip-on-hover"
              style={{ clipPath: 'circle(50%)' }}
            >
              <i className="fab fa-twitter text-xl"></i>
            </a>
          </div>
        </>
      )}

      {/* Main Content */}
      <Routers />

      {/* Conditionally show footer */}
      {!hideHeaders && <NewFooter />}
    </div>
  );
};

export default Layout;
