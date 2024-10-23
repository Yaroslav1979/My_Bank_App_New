import React from "react";
import "./index.css";

interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function Button({ children, className, onClick, type = "button", disabled = false }: ButtonProps): JSX.Element {
  return (
    <button className={`form__button ${className}`} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
}