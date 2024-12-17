import { CrossIcon } from '@/app/_icons/CrossIcon'
import { useAppContext } from '@/app/context/AppContext';
import React from 'react'
import { Button } from './Button';
import { CopyIcon } from '@/app/_icons/CopyIcon';
import axios from '@/app/api/axios';
import toast from 'react-hot-toast';
import { ShareIcon } from '@/app/_icons/ShareIcon';
import { StopIcon } from '@/app/_icons/StopIcon';

function ShareModal() {
    const { setModalOpen, totalContent, setModalComponent, share, setShare, baseShareLink, setShareLink, shareLink } = useAppContext();
    const [loading, setLoading] = React.useState(false);

    async function shareBrain() {
        try {
            setLoading(true);
            const response = await axios.post('/brain/share', {
                share: true
            },{
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            setLoading(false);
            setShare(true);
            setShareLink(baseShareLink+response.data.shareableLink);
            toast.success('Brain Shared Successfully');
        } catch (error) {
            console.log(error);
            setLoading(false);
            setShare(false);
            setShareLink('');
            toast.error('Failed to Share Brain');
        }
    }

    async function stopSharing() {
        try {
            setLoading(true);
            await axios.post('/brain/share', {
                share: false
            },{
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            setLoading(false);
            setShare(false);
            setShareLink('');
            toast.success('Brain Sharing Stopped Successfully');
        } catch (error) {
            console.log(error);
            setLoading(false);
            setShare(true);
            toast.error('Failed to Stop Sharing Brain');
        }
    }
    return (
        <div className='bg-white p-5 mx-5 rounded-lg text-text max-w-[400px] flex flex-col gap-4'>
            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold'>Share Your Second Brain</h1>
                <div className='flex justify-center items-center cursor-pointer' onClick={() => {
                    setModalComponent(null);
                    setModalOpen(false);
                }}>
                    <CrossIcon size='md' />
                </div>
            </div>
            <div className='text-sm text-gray-700'>
                <p>
                    Share your Entire collection of notes, documents, tweets and videos with others. They will be able to Import your contents into their own Second Brain.
                </p>
            </div>
            {
                !share &&
                <div className='flex gap-2'>
                    <Button loading={loading} onClick={shareBrain} variant='primary' size='md' text="Share Brain" startIcon={<ShareIcon size='md'/>} width='w-full'/>
                </div>
            }
            {
                share &&
                <div className='flex gap-2'>
                    <Button loading={loading} onClick={stopSharing} variant='danger' size='md' text="Stop Sharing" startIcon={<StopIcon size='md'/>} width='w-full'/>
                    <Button onClick={async ()=>{
                        console.log(shareLink);
                        await navigator.clipboard.writeText(shareLink);
                        toast.success('Link Copied to Clipboard');
                    }} variant='secondary' size='md' text="Copy Link" startIcon={<CopyIcon size='md'/>} width='w-full xs:flex hidden'/>
                    <Button onClick={async ()=>{
                        console.log(shareLink);
                        await navigator.clipboard.writeText(shareLink);
                        toast.success('Link Copied to Clipboard');
                    }} variant='secondary' size='md' startIcon={<CopyIcon size='md'/>} width='w-max flex xs:hidden'/>
                </div>
            }
            {/* <div>
                <Button variant='secondary' size='md' text="Share a Part of Brain (Under Development)" startIcon={<CopyIcon size='md'/>} width='w-full'/>
            </div> */}
            <div className='flex justify-center items-center'>
                <p className='text-sm text-gray-600'>{totalContent} {share?"Items are being shared":"Items will be shared"}</p>
            </div>
        </div>
    )
}

export default ShareModal