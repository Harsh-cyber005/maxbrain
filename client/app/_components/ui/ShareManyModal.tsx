import { CrossIcon } from '@/app/_icons/CrossIcon'
import { useAppContext } from '@/app/context/AppContext';
import React from 'react'
import { Button } from './Button';
import { CopyIcon } from '@/app/_icons/CopyIcon';
import axios from '@/app/api/axios';
import toast from 'react-hot-toast';
import { ShareIcon } from '@/app/_icons/ShareIcon';
import { StopIcon } from '@/app/_icons/StopIcon';

function ShareManyModal() {
    const { setModalOpen, setModalComponent, selected, setSelectActive, setSelected, shareMany, setShareMany, shareManyLink, setShareManyLink, baseShareManyLink } = useAppContext();
    const [loading, setLoading] = React.useState(false);

    async function startShareMany() {
		try {
            setLoading(true);
			const response = await axios.post('/brain/share/selected', {
				contentids: selected,
				share: true
			},{
				headers: {
					'Authorization': localStorage.getItem('token')
				}
			})
            setLoading(false);
            setShareMany(true);
            setShareManyLink(baseShareManyLink+response.data.shareableLink);
            toast.success('Contents Shared Successfully');
		} catch (error) {
			console.log(error);
            setLoading(false);
            setShareMany(false);
            setShareManyLink('');
            toast.error('Failed to Share Contents');
		}
	}

	async function stopShareMany(){
		try {
            setLoading(true);
			await axios.post('/brain/share/selected', {
				contentids: selected,
				share: false
			},{
				headers: {
					'Authorization': localStorage.getItem('token')
				}
			})
            setLoading(false);
            setShareMany(false);
            setShareManyLink('');
            toast.success('Contents Sharing Stopped Successfully');
		} catch (error) {
			console.log(error);
            setLoading(false);
            setShareMany(true);
            toast.error('Failed to Stop Sharing Contents');
		}
	}

    return (
        <div className='bg-white p-5 mx-5 rounded-lg text-text max-w-[400px] flex flex-col gap-4'>
            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold'>Share Item</h1>
                <div className='flex justify-center items-center cursor-pointer' onClick={() => {
                    setModalComponent(null);
                    setModalOpen(false);
                    setSelectActive(false);
                    setSelected([]);
                }}>
                    <CrossIcon size='md' />
                </div>
            </div>
            <div className='text-sm text-gray-700'>
                <p>
                    Share contents. Other users will be able to Import your contents into their own duoBrain.
                </p>
            </div>
            {
                !shareMany &&
                <div className='flex gap-2'>
                    <Button loading={loading} onClick={startShareMany} variant='primary' size='md' text="Share Brain" startIcon={<ShareIcon size='md'/>} width='w-full'/>
                </div>
            }
            {
                shareMany &&
                <div className='flex gap-2'>
                    <Button loading={loading} onClick={stopShareMany} variant='danger' size='md' text="Stop Sharing" startIcon={<StopIcon size='md'/>} width='w-full'/>
                    <Button onClick={async ()=>{
                        await navigator.clipboard.writeText(shareManyLink);
                        toast.success('Link Copied to Clipboard');
                    }} variant='secondary' size='md' text="Copy Link" startIcon={<CopyIcon size='md'/>} width='w-full xs:flex hidden'/>
                    <Button onClick={async ()=>{
                        console.log(shareManyLink);
                        await navigator.clipboard.writeText(shareManyLink);
                        toast.success('Link Copied to Clipboard');
                    }} variant='secondary' size='md' startIcon={<CopyIcon size='md'/>} width='w-max flex xs:hidden'/>
                </div>
            }
            <div className='flex justify-center items-center'>
                <p className='text-sm text-gray-600'>{selected.length} {shareMany?"Items are being shared":"Items will be shared"}</p>
            </div>
        </div>
    )
}

export default ShareManyModal