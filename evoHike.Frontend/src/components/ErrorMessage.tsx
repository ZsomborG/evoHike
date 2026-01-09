import React from 'react';
import '../styles/ErrorMessage.css';

interface ErrorMessageProps {
  children: React.ReactNode;
}
function ErrorMessage({ children }: ErrorMessageProps) {
  return <div className="error-message">{children}</div>;
}
export default ErrorMessage;
