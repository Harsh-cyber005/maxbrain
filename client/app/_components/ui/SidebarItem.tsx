import React, { ReactElement } from 'react'

interface SidebarItemProps {
    title?: string;
    icon: ReactElement;
    active: boolean;
    onClick?: () => void;
    onMouseDown?: () => void;
    onMouseUp?: () => void;
}

function SidebarItem({ title,icon, active, onClick, onMouseDown, onMouseUp }: SidebarItemProps) {
    return (
        <div onMouseDown={onMouseDown} onMouseUp={onMouseUp} onClick={onClick} className='cursor-pointer'>
            <div className={`flex justify-start xs:justify-center lg:justify-start items-center gap-3 py-3 px-3 text-gray-700 rounded-md ${active?"bg-gray-200":"hover:bg-gray-100"}`}>
                {icon}
                {
                    title &&
                    <h1 className='text-md font-semibold'>{title}</h1>
                }
            </div>
        </div>
    )
}

export default SidebarItem