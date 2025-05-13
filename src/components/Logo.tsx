import React from "react";

type LogoProps = {
  className?: string;
  small?: boolean;
};

const Logo: React.FC<LogoProps> = ({ className = "", small = false }) => {
  const size = small ? "h-10" : "h-16";

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/favicon.png"
        alt="Abraham Adesanya Polytechnic Logo"
        className={`${size} w-auto`}
      />
      <div className="ml-2">
        <h2
          className={`${
            small ? "text-lg" : "text-2xl"
          } font-bold text-aapoly-purple leading-tight`}
        >
          SIWES Connect
        </h2>
        <p className={`${small ? "text-xs" : "text-sm"} text-aapoly-gray`}>
          Abraham Adesanya Polytechnic
        </p>
      </div>
    </div>
  );
};

export default Logo;
