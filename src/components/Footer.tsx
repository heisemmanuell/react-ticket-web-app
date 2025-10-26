import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">        
        <div className=" text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Ticket Web App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;