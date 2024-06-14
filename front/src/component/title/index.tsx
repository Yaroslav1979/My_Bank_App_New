import "./index.css";
import React from "react";

export default function Title({children}: {children?: React.ReactNode}): JSX.Element {
    return <h1 className="title"> {children} </h1>
}