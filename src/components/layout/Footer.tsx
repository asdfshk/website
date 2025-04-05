
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full border-t border-border py-6 mt-16">
      <div className="container flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="font-mono text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} <span className="text-primary">John Connor</span>
          </p>
        </div>
        
        <div className="flex space-x-6">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
            GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">
            LinkedIn
          </a>
          <a href="mailto:john.connor@example.com" className="text-muted-foreground hover:text-primary">
            Email
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
