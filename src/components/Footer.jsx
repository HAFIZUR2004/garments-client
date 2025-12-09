// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        
        {/* Logo & Description */}
        <div className="mb-6 md:mb-0">
          <h1 className="text-2xl font-bold">GarmentsTracker</h1>
          <p className="text-gray-400 mt-2 max-w-xs">
            Manage orders, monitor production, and ensure timely delivery.
          </p>
        </div>

        {/* Useful Links */}
        <div className="flex flex-col md:flex-row gap-6">
          <div>
            <h2 className="font-semibold mb-2">Useful Links</h2>
            <ul>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/all-products" className="text-gray-400 hover:text-white">
                  Products
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} GarmentsTracker. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
