
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

interface RoleNavigationProps {
  title: string;
  subtitle?: string;
}

const RoleNavigation: React.FC<RoleNavigationProps> = ({ title, subtitle }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo />
          <h1 className="text-3xl font-bold text-aapoly-dark mt-6">{title}</h1>
          {subtitle && <p className="text-aapoly-gray mt-2">{subtitle}</p>}
        </div>
        
        <div className="space-y-4 animate-fade-in">
          <Button 
            onClick={() => navigate('/login/student')} 
            className="w-full py-6 bg-aapoly-purple hover:bg-aapoly-purple/90 text-lg"
          >
            Student Login
          </Button>
          
          <Button 
            onClick={() => navigate('/login/supervisor')} 
            className="w-full py-6 bg-aapoly-gold hover:bg-aapoly-gold/90 text-aapoly-dark text-lg"
          >
            Supervisor Login
          </Button>
          
          <Button 
            onClick={() => navigate('/login/coordinator')} 
            className="w-full py-6 bg-aapoly-dark hover:bg-aapoly-dark/90 text-lg"
          >
            Coordinator Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleNavigation;
