import { CrossIcon } from '@/app/_icons/CrossIcon'
import { useAppContext } from '@/app/context/AppContext';
import React from 'react'
import { Button } from './Button';
import toast from 'react-hot-toast';
import { DownloadIcon } from '@/app/_icons/DownloadIcon';
import { LoginIcon } from '@/app/_icons/LoginIcon';
import { useRouter } from 'next/navigation';

interface DownloadModalProps {
    username: string;
    mergeData: () => Promise<number>;
}

function DownloadModal({ username, mergeData }: DownloadModalProps) {
    const { setModalOpen, setModalComponent, totalContentShare, authName, setWantBack } = useAppContext();
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();
    return (
        <div className='bg-white p-5 mx-5 rounded-lg text-text max-w-[400px] flex flex-col gap-4'>
            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold'>Confirm Merging the Contents</h1>
                <div className='flex justify-center items-center cursor-pointer' onClick={() => {
                    setModalComponent(null);
                    setModalOpen(false);
                }}>
                    <CrossIcon size='md' />
                </div>
            </div>
            <div className='text-sm text-gray-700'>
                <p>
                    All the contents of {username}&apos;s brain will be merged with your contents. Are you sure ?
                </p>
            </div>
            <div>
                {
                    authName && 
                        <Button loading={loading} onClick={async ()=>{
                            try{
                                setLoading(true);
                                const status = await mergeData();
                                setLoading(false);
                                if(status === 200){
                                    toast.success("Contents Merged Successfully");
                                } else {
                                    toast.error("looks like you are merging your own contents");
                                }
                                setModalComponent(null);
                                setModalOpen(false);
                            } catch (error) {
                                console.log(error);
                                setLoading(false);
                                toast.error("Something went wrong");
                            }
                        }} variant='primary' size='md' text="Merge Contents" startIcon={<DownloadIcon size='md'/>} width='w-full'/>
                }
                {
                    !authName && 
                        <Button onClick={()=>{
                            setWantBack(true);
                            setModalComponent(null);
                            setModalOpen(false);
                            router.push('/auth/login');
                        }} variant='primary' size='md' text="Sign In First" startIcon={<LoginIcon size='md'/>} width='w-full'/>
                }
            </div>
            <div className='flex justify-center items-center'>
                <p className='text-sm text-gray-600'>{totalContentShare} Items will be Merged</p>
            </div>
        </div>
    )
}

export default DownloadModal