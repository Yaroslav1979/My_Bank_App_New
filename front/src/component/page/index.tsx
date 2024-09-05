import React from 'react';

import ArrowBack from "../arrow-back";
import "./index.css";


interface ComponentProps {
  pageTitle?: string; // Позначаємо, що pageTitle необов'язковий
  children: React.ReactNode; // Діти обов'язкові
}

export default function Component({ pageTitle, children }: ComponentProps) {
  return (
    <div className="page-wrapper"> 
    
      <div className="page">
        <ArrowBack /> 
        <p className='page-title'>{pageTitle} </p> 
      </div> 

      {children} 
    </div>
  );
}