import { DeleteIcon } from '@/app/_icons/DeleteIcon'
import { DocumentIcon } from '@/app/_icons/DocumentIcon'
import { ShareIcon } from '@/app/_icons/ShareIcon'
import React from 'react'
import CardText from './CardText'
import CardEmbed from './CardEmbed'
import { YoutubeIcon } from '@/app/_icons/Youtube'
import { TweeterIcon } from '@/app/_icons/Tweeter'
import CardDocument from './CardDocument'
import Tag from './Tag'
import DeleteModal from './DeleteModal'
import { useAppContext } from '@/app/context/AppContext'
import ShareOneModal from './ShareOneModal'
import { LinkIcon } from '@/app/_icons/LinkIcon'
import { InstagramIcon } from '@/app/_icons/Instagram'
import { PinterestIcon } from '@/app/_icons/Pinterest'
import CardDescription from './CardDescription'

interface dateType {
    day: string;
    month: string;
    year: string;
}

interface CardProps {
    id: string
    title: string
    link?: string
    type: "tweet" | "youtube" | "document" | "link" | "instagram" | "pinterest"
    content?: string
    tags?: string[]
    date: dateType
    deleteCard?: (id: string) => Promise<void>
    shared: boolean
}

function Card({ id, title, link, type, content, tags, date, deleteCard, shared }: CardProps) {
    const { setModalComponent, setModalOpen } = useAppContext();
    return (
        <div className='bg-white rounded-md hover:bg-gray-50 border-gray-200 border-2 border-solid w-[310px] p-5 flex flex-col gap-5 h-[450px]'>
            <div className='w-full flex flex-col gap-5 h-[359px]'>
                <div className={shared?"flex items-center justify-start":"flex items-center justify-between"}>
                    <div className='flex w-[40px] justify-start items-center'>
                        {
                            type === "youtube" && <YoutubeIcon size='md' />
                        }
                        {
                            type === "tweet" && <TweeterIcon size='md' />
                        }
                        {
                            type === "document" && <DocumentIcon size='md' />
                        }
                        {
                            type === "link" && <LinkIcon size='md' />
                        }
                        {
                            type === "instagram" && <InstagramIcon size='md' />
                        }
                        {
                            type === "pinterest" && <PinterestIcon size='md' />
                        }
                    </div>
                    <CardText title={title} />
                    {
                        !shared && 
                        <div className='w-[80px] justify-end items-center gap-4 flex'>
                            <div onClick={()=>{
                                setModalComponent(<ShareOneModal />);
                                setModalOpen(true);
                            }} className='hover:text-primaryBtn duration-150 cursor-pointer'>
                                <ShareIcon size='md'/>
                            </div>
                            <div onClick={async ()=>{
                                if (deleteCard) {
                                    setModalComponent(<DeleteModal id={id} deleteCard={deleteCard} />);
                                    setModalOpen(true);
                                }
                            }} className='hover:text-red-500 duration-150 cursor-pointer'>
                                <DeleteIcon size='md'/>
                            </div>
                        </div>
                    }
                </div>
                <CardEmbed type={type} link={link} />
                {
                    type === "document" && <CardDocument content={content} />
                }
                {
                    (type !== "tweet" && type !=="document") && <CardDescription content={content} />
                }
                <div className='flex gap-2 items-center flex-wrap'>
                    {
                        tags?.map((tag, index) => {
                            return (
                                <Tag key={index} tag={tag} />
                            )
                        })
                    }
                </div>
            </div>
            <div>
                <p className='text-sm text-gray-500 mt-2'>Added on {date.day}/{date.month}/{date.year}</p>
            </div>
        </div>
    )
}

export default Card