import React from "react";
import "./index.css";

interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function Button({ children, className, type = "button", disabled = false }: ButtonProps): JSX.Element {
  return (
    <button className={`form__button ${className}`} type={type} disabled={disabled}>
      {children}
    </button>
  );
}