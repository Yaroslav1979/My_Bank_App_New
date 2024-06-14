import ArrowBack from  "./../arrow-back" 
import "./index.css";

export default function Component({children}) {
    return <div className="page"> 
    <ArrowBack />
    {children} 
    </div>
}