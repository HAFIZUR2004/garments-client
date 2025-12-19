import React from "react";
import { Link } from "react-router-dom";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin, FiGrid } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* ১. লোগো ও বর্ণনা */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold text-blue-500 flex items-center gap-2">
              <FiGrid size={28} /> GarmentsPro
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Leading the garment industry with smart tracking and production management. We ensure quality and timely delivery for every order.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-all duration-300">
                <FiFacebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-400 transition-all duration-300">
                <FiTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 transition-all duration-300">
                <FiInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-700 transition-all duration-300">
                <FiLinkedin size={18} />
              </a>
            </div>
          </div>

          {/* ২. কুইক লিঙ্কস */}
          <div>
            <h2 className="text-lg font-bold mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-blue-500 rounded-full"></span>
            </h2>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-blue-400 hover:translate-x-1 transition-all inline-block">About Us</Link>
              </li>
              <li>
                <Link to="/allproducts" className="text-gray-400 hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Products</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blue-400 hover:translate-x-1 transition-all inline-block">Contact</Link>
              </li>
            </ul>
          </div>

          {/* ৩. সাপোর্ট বা সার্ভিসেস */}
          <div>
            <h2 className="text-lg font-bold mb-6 relative inline-block">
              Support
              <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-blue-500 rounded-full"></span>
            </h2>
            <ul className="space-y-3">
              <li className="text-gray-400 hover:text-blue-400 cursor-pointer transition-all">Privacy Policy</li>
              <li className="text-gray-400 hover:text-blue-400 cursor-pointer transition-all">Terms & Conditions</li>
              <li className="text-gray-400 hover:text-blue-400 cursor-pointer transition-all">F.A.Q</li>
              <li className="text-gray-400 hover:text-blue-400 cursor-pointer transition-all">Support Center</li>
            </ul>
          </div>

          {/* ৪. কন্টাক্ট ইনফো */}
          <div>
            <h2 className="text-lg font-bold mb-6 relative inline-block">
              Contact Us
              <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-blue-500 rounded-full"></span>
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400">
                <FiMapPin className="text-blue-500 shadow-lg" size={20} />
                <span>123 Textile Ave, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FiPhone className="text-blue-500 shadow-lg" size={20} />
                <span>+880 1884369340</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FiMail className="text-blue-500 shadow-lg" size={20} />
                <span>hafiz68941@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* নিচের কপিরাইট অংশ */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} <span className="text-blue-500 font-semibold">GarmentsPro</span>. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">English (US)</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;