import { CrossIcon } from '@/app/_icons/CrossIcon'
import { useAppContext } from '@/app/context/AppContext';
import React from 'react'
import { Button } from './Button';
import { CopyIcon } from '@/app/_icons/CopyIcon';

function ShareOneModal() {
    const { setModalOpen, setModalComponent } = useAppContext();
    return (
        <div className='bg-white p-5 mx-5 rounded-lg text-text max-w-[400px] flex flex-col gap-4'>
            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold'>Share Item</h1>
                <div className='flex justify-center items-center cursor-pointer' onClick={() => {
                    setModalComponent(null);
                    setModalOpen(false);
                }}>
                    <CrossIcon size='md' />
                </div>
            </div>
            <div className='text-sm text-gray-700'>
                <p>
                    Share this current Item. They will be able to Import your contents into their own Second Brain.
                </p>
            </div>
            <div>
                <Button variant='primary' size='md' text="Share Item (Under Development)" startIcon={<CopyIcon size='md'/>} width='w-full'/>
            </div>
            <div className='flex justify-center items-center'>
                <p className='text-sm text-gray-600'>This item will be shared</p>
            </div>
        </div>
    )
}

export default ShareOneModal