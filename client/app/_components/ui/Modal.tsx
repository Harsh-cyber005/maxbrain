import { useAppContext } from '@/app/context/AppContext';
import React from 'react';
import ReactDOM from 'react-dom';

interface PortalProps {
    children: React.ReactNode;
}

const Modal: React.FC<PortalProps> = ({children}) => {
    const { modalOpen } = useAppContext();

    if (!modalOpen) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className="fixed inset-0 min-h-screen h-auto overflow-hidden bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
            {children}
        </div>,
        document.getElementById('portal') as HTMLElement
    );
};

export default Modal;
