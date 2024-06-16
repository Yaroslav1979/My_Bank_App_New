import "./index.css";
import React from "react";


export default function Subtitle({children}: {children?: React.ReactNode}): JSX.Element {
    return (
    <div>
        <h1 className="subtitle"> {children}</h1>    
    </div>
)
}