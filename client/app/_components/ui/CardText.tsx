import React from 'react'

interface CardTextProps {
    title: string
}

function CardText({title}: CardTextProps) {

    return (
        <div className='flex w-[150px] justify-start items-start gap-2 relative'>
            <div className='font-semibold text-sm cursor-default text-nowrap overflow-hidden text-ellipsis'>
                {title}
            </div>
        </div>
    )
}

export default CardText