// import React from "react";
// import "./index.css";

// interface FormLinkProps {
//   text: string; 
//   linkText: string; 
//   linkHref: string; 
// }

// const FormLink: React.FC<FormLinkProps> = ({ text, linkText, linkHref }) => {
//   return (
//     <div className="form-link">
//       <p className="form-link__text">
//         {text}
//         <a href={linkHref} className="form-link__link">
//           {linkText}
//         </a>
//       </p>
//     </div>
//   );
// };

// export default FormLink;


import React from "react";
import { Link } from "react-router-dom";
import "./index.css";

interface FormLinkProps {
  text: string; 
  linkText: string; 
  linkHref: string; 
}

const FormLink: React.FC<FormLinkProps> = ({ text, linkText, linkHref }) => {
  return (
    <div className="form-link">
      <p className="form-link__text">
        {text}
        <Link to={linkHref} className="form-link__link">
          {linkText}
        </Link>
      </p>
    </div>
  );
};

export default FormLink;
