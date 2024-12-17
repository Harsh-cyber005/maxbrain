import { CrossIcon } from '@/app/_icons/CrossIcon'
import { useAppContext } from '@/app/context/AppContext';
import React from 'react'
import { Button } from './Button';
import { DeleteIcon } from '@/app/_icons/DeleteIcon';
import toast from 'react-hot-toast';

interface DeleteModalProps {
    id: string;
    deleteCard: (id: string) => Promise<void>;
}

function DeleteModal({id, deleteCard}: DeleteModalProps) {
    const { setModalOpen, setModalComponent } = useAppContext();
    const [loading, setLoading] = React.useState(false);
    return (
        <div className='bg-white p-5 mx-5 rounded-lg text-text max-w-[400px] flex flex-col gap-4'>
            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold'>Confirm Delete</h1>
                <div className='flex justify-center items-center cursor-pointer' onClick={() => {
                    setModalComponent(null);
                    setModalOpen(false);
                }}>
                    <CrossIcon size='md' />
                </div>
            </div>
            <div className='text-sm text-gray-700'>
                <p>
                    This is a permanent action and cannot be undone. Are you sure you want to delete this content?
                </p>
            </div>
            <div>
                <Button loading={loading} onClick={()=>{
                    try{
                        setLoading(true);
                        deleteCard(id);
                        setLoading(false);
                        setModalComponent(null);
                        setModalOpen(false);
                        toast.success("Content deleted successfully");
                    } catch (error) {
                        console.log(error);
                        setLoading(false);
                        toast.error("Something went wrong");
                    }
                }} variant='danger' size='md' text="Delete" startIcon={<DeleteIcon size='md'/>} width='w-full'/>
            </div>
            <div className='flex justify-center items-center'>
                <p className='text-sm text-gray-600'>1 Item will be deleted</p>
            </div>
        </div>
    )
}

export default DeleteModal