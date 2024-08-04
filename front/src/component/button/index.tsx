import React from "react";
import "./index.css";

interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export default function Button({ children, className }: ButtonProps): JSX.Element {
  return (
    <button className={`form__button ${className}`} type="button">
      {children}
    </button>
  );
}