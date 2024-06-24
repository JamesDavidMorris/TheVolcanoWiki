import { useEffect, useState } from "react";
import ReactDOM from 'react-dom';

const Portal = ({ children }) => {
    const [portalNode] = useState(document.createElement('div'));

    useEffect (() => {
        document.body.appendChild(portalNode);
        return () => {
            document.body.removeChild(portalNode);
        };
    }, [portalNode]);

    return ReactDOM.createPortal(children, portalNode);
}

export default Portal;