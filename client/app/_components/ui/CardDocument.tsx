import React from 'react'

interface CardDocumentProps {
    content: string | undefined
}

function CardDocument({ content }: CardDocumentProps) {
    return (
        <div className='text-sm'>{content}</div>
    )
}

export default CardDocument