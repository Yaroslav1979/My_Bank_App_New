import "./index.css";
import React from "react";


export default function Button({children}: {children?: React.ReactNode}): JSX.Element {
    return (    
       <button className="form__button" type="submit">{children}</button> 
   )
}