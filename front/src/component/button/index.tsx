import React from "react";
import "./index.css";

interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset"; // Додано можливість налаштування типу кнопки
}

export default function Button({ children, className, type = "button" }: ButtonProps): JSX.Element {
  return (
    <button className={`form__button ${className}`} type={type}>
      {children}
    </button>
  );
}