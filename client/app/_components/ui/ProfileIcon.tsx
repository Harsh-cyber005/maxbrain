/* eslint-disable react-hooks/exhaustive-deps */
import { useAppContext } from '@/app/context/AppContext'
import React from 'react'
import clsx from 'clsx';

export default function ProfileIcon() {
    const { initial, fromColor, toColor } = useAppContext();
    const [open, setOpen] = React.useState(false);

    const dynClass = clsx("flex items-center justify-center w-10 h-10 bg-gradient-to-br rounded-full cursor-pointer hover:brightness-90 duration-200", fromColor, toColor)
    return (
        <div className='relative'>
            <div onClick={()=>{
                setOpen(!open)
            }} className={dynClass}>
                <span className="text-white font-bold text-lg select-none">{initial}</span>
            </div>
            {
                open && 
                    <div className='absolute z-[1000] flex-col bottom-0 right-0 translate-y-full border-gray-200 border-2 border-solid bg-white rounded-md shadow-md'>
                        <div className='cursor-pointer px-4 py-2 w-[150px] rounded-t-md hover:bg-secondaryBtn duration-150 flex justify-start items-center gap-2'>
                            Logout
                        </div>
                    </div>
            }
        </div>
    )
}