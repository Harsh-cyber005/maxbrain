import { Loader2 } from 'lucide-react'
import React from 'react'

export default function SkeletonCard() {
    return (
        <div className='bg-white rounded-md hover:bg-gray-50 border-gray-200 border-2 border-solid w-[310px] p-5 flex justify-center items-center gap-5 h-[450px]'>
            <Loader2 className="animate-spin stroke-2 size-6" />
        </div>
    )
}