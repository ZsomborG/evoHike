import React from "react";
import "../styles/Button.css";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}
const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button className="my-button" onClick={onClick}>
      {children}
    </button>
  );
};
export default Button;