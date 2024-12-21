import React from 'react'

interface CardDocumentProps {
    content: string | undefined
}

function CardDocument({ content }: CardDocumentProps) {
    return (
        <div className='text-sm whitespace-pre-wrap h-[266.8px] overflow-y-scroll border-2 rounded-md p-2'>{content}</div>
    )
}

export default CardDocument