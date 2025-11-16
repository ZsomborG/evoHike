import React from 'react';
import '../styles/ErrorMessage.css';

interface ErrorMessageProps {
  children: React.ReactNode;
}
const ErrorMessage: React.FC<ErrorMessageProps> = ({ children }) => {
  return <div className="error-message">{children}</div>;
};
export default ErrorMessage;
