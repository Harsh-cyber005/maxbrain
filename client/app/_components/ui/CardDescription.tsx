import React from 'react'

interface CardDescriptionProps {
    content: string | undefined
}

function CardDescription({ content }: CardDescriptionProps) {
    return (
        <div className='text-sm'>{content}</div>
    )
}

export default CardDescription