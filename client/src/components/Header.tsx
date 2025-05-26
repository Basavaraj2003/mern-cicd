
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  return (
    <header className="bg-background shadow-sm border-b border-border">
      <div className="container mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/">
                <h1 className="text-2xl font-bold text-primary">
                  Matrix<span className="text-secondary">Code</span>
                </h1>
              </Link>
            </div>
            <div className="ml-4">
              <Badge variant="outline" className="text-xs font-medium text-muted-foreground">
                v1.0.0
              </Badge>
            </div>
          </div>
          <nav className="flex space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 text-sm font-medium ${
                location.pathname === '/' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-foreground hover:text-primary'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className={`px-3 py-2 text-sm font-medium ${
                location.pathname === '/dashboard' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-foreground hover:text-primary'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              to="/docs" 
              className={`px-3 py-2 text-sm font-medium ${
                location.pathname === '/docs' 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-foreground hover:text-primary'
              }`}
            >
              Docs
            </Link>
            <a href="#" className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary">
              Help
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
