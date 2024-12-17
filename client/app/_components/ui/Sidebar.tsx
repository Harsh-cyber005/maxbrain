import { BrainIcon } from '@/app/_icons/BrainIcon'
import React from 'react'
import SidebarItem from './SidebarItem'
import { TweeterIcon } from '@/app/_icons/Tweeter'
import { YoutubeIcon } from '@/app/_icons/Youtube'
import { DocumentIcon } from '@/app/_icons/DocumentIcon'
import { LinkIcon } from '@/app/_icons/LinkIcon'
import { useAppContext } from '@/app/context/AppContext'
import { FilterIcon } from '@/app/_icons/FilterIcon'
import { LogoutIcon } from '@/app/_icons/LogoutIcon'
import { InstagramIcon } from '@/app/_icons/Instagram'
import { PinterestIcon } from '@/app/_icons/Pinterest'
import { CrossIcon } from '@/app/_icons/CrossIcon'
import { useRouter } from 'next/navigation';

function Sidebar() {
    const {setFilter, filter, setAuthName, authName, sidebarOpen, setSidebarOpen} = useAppContext();
    const [x, setX] = React.useState(false);
    const router = useRouter();
    return (
        <div className={`lg:w-[300px] xs:w-max w-full py-7 px-5 h-screen fixed bg-white shadow-lg left-0 top-0 z-50 block xs:block ${sidebarOpen?"translate-x-0 xs:translate-x-0":"translate-x-[-100%] xs:translate-x-0"} transition-transform duration-300 ease-in-out`}>
            <div className='flex xs:justify-start justify-between items-center gap-3 px-3 cursor-pointer'>
                <BrainIcon className='size-8 hidden xs:flex' />
                <h1 className='text-xl font-bold lg:flex hidden'>Max Brain</h1>
                <h1 onClick={()=>{
                    router.replace('/')
                }} className='text-xl font-bold xs:hidden flex text-[#5046E4]'>{authName}</h1>
                <div onClick={()=>{
                    setSidebarOpen(false)
                }} className='hover:bg-gray-200 duration-200 p-2 rounded-md cursor-pointer xs:hidden'>
                    <CrossIcon size='md'/>
                </div>
            </div>
            <div className='lg:flex xs:hidden flex flex-col justify-between'>
                <div className='mt-5 flex flex-col'>
                    <SidebarItem onClick={()=>{
                        setSidebarOpen(false)
                        setFilter("")
                    }} title='All' icon={<FilterIcon size='md'/>} active={filter === ""}/>
                    <SidebarItem onClick={()=>{
                        setSidebarOpen(false)
                        setFilter("tweet")
                    }} title='Tweets' icon={<TweeterIcon size='md'/>} active={filter === "tweet"}/>
                    <SidebarItem onClick={()=>{
                        setSidebarOpen(false)
                        setFilter("youtube")
                    }} title='Videos' icon={<YoutubeIcon size='md'/>} active={filter === "youtube"}/>
                    <SidebarItem onClick={()=>{
                        setSidebarOpen(false)
                        setFilter("instagram")
                    }} title='Instagram posts' icon={<InstagramIcon size='md'/>} active={filter === "instagram"}/>
                    <SidebarItem onClick={()=>{
                        setSidebarOpen(false)
                        setFilter("pinterest")
                    }} title='Pinterest' icon={<PinterestIcon size='md'/>} active={filter === "pinterest"}/>
                    <SidebarItem onClick={()=>{
                        setSidebarOpen(false)
                        setFilter("document")
                    }} title='Documents' icon={<DocumentIcon size='md'/>} active={filter === "document"}/>
                    <SidebarItem onClick={()=>{
                        setSidebarOpen(false)
                        setFilter("link")
                    }} title='Links' icon={<LinkIcon size='md'/>} active={filter === "link"}/>
                </div>
                {
                    authName && 
                        <div>
                            <SidebarItem
                            onClick={()=>{
                                localStorage.removeItem('token')
                                localStorage.removeItem('authName')
                                setSidebarOpen(false)
                                window.location.reload()
                                setAuthName("")
                            }}
                            onMouseDown={
                                ()=>{
                                    setX(true)
                                }
                            } onMouseUp={
                                ()=>{
                                    setX(false)
                                }
                            } title='Logout' icon={<LogoutIcon size='md'/>} active={x}/>
                        </div>
                }
            </div>
            <div className='xs:flex hidden flex-col justify-between lg:hidden'>
                <div className='mt-5 flex flex-col'>
                    <SidebarItem onClick={()=>{
                        setSidebarOpen(false)
                        setFilter("")
                    }} icon={<FilterIcon size='md'/>} active={filter === ""}/>
                    <SidebarItem onClick={()=>{
                        setSidebarOpen(false)
                        setFilter("tweet")
                    }} icon={<TweeterIcon size='md'/>} active={filter === "tweet"}/>
                    <SidebarItem onClick={()=>{
                        setSidebarOpen(false)
                        setFilter("youtube")
                    }} icon={<YoutubeIcon size='md'/>} active={filter === "youtube"}/>
                    <SidebarItem onClick={()=>{
                        setSidebarOpen(false)
                        setFilter("instagram")
                    }} icon={<InstagramIcon size='md'/>} active={filter === "instagram"}/>
                    <SidebarItem onClick={()=>{
                        setSidebarOpen(false)
                        setFilter("pinterest")
                    }} icon={<PinterestIcon size='md'/>} active={filter === "pinterest"}/>
                    <SidebarItem onClick={()=>{
                        setSidebarOpen(false)
                        setFilter("document")
                    }} icon={<DocumentIcon size='md'/>} active={filter === "document"}/>
                    <SidebarItem onClick={()=>{
                        setSidebarOpen(false)
                        setFilter("link")
                    }} icon={<LinkIcon size='md'/>} active={filter === "link"}/>
                </div>
                {
                    authName && 
                        <div>
                            <SidebarItem
                            onClick={()=>{
                                localStorage.removeItem('token')
                                localStorage.removeItem('authName')
                                setSidebarOpen(false)
                                window.location.reload()
                                setAuthName("")
                            }}
                            onMouseDown={
                                ()=>{
                                    setX(true)
                                }
                            } onMouseUp={
                                ()=>{
                                    setX(false)
                                }
                            } icon={<LogoutIcon size='md'/>} active={x}/>
                        </div>
                }
            </div>
        </div>
    )
}

export default Sidebar