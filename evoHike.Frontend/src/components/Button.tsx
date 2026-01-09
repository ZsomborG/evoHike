import React from 'react';
import '../styles/Button.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}
function Button({ children, onClick }: ButtonProps) {
  return (
    <button className="my-button" onClick={onClick}>
      {children}
    </button>
  );
}
export default Button;
