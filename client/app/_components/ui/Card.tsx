import { DeleteIcon } from '@/app/_icons/DeleteIcon'
import { DocumentIcon } from '@/app/_icons/DocumentIcon'
import React, { useEffect, useRef } from 'react'
import CardText from './CardText'
import CardEmbed from './CardEmbed'
import { YoutubeIcon } from '@/app/_icons/Youtube'
import { TweeterIcon } from '@/app/_icons/Tweeter'
import CardDocument from './CardDocument'
import Tag from './Tag'
import DeleteModal from './DeleteModal'
import { useAppContext } from '@/app/context/AppContext'
import { LinkIcon } from '@/app/_icons/LinkIcon'
import { InstagramIcon } from '@/app/_icons/Instagram'
import { PinterestIcon } from '@/app/_icons/Pinterest'
import CardDescription from './CardDescription'
import { MenuIcon } from '@/app/_icons/MenuIcon'
import { SelectIcon } from '@/app/_icons/SelectIcon'
import { ShareIcon } from '@/app/_icons/ShareIcon'
import ShareManyModal from './ShareManyModal'

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
    selected?: boolean
}

function Card({ id, title, link, type, content, tags, date, deleteCard, shared, selected }: CardProps) {
    const { setModalComponent, setModalOpen, selectActive, setSelectActive, setSelected } = useAppContext();
    const [showDropdown, setShowDropdown] = React.useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const menuButtonRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node) &&
            menuButtonRef.current &&
            !menuButtonRef.current.contains(event.target as Node)
        ) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleToggleIncludeInSelected = () => {
        setSelected((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    return (
        <div onClick={()=>{
            if(selectActive){
                handleToggleIncludeInSelected();
            }
        }} style={{
            '--random-delay': `${Math.random() * 0.3}s`
        } as React.CSSProperties} className={`${selected?"bg-gray-50":"bg-white hover:bg-gray-50"} rounded-md  border-gray-200 border-2 border-solid w-[310px] p-5 flex flex-col gap-5 h-[450px] shadow-lg ${selectActive? !selected? "":"shiver" :""} overflow-y-scroll overflow-x-hidden tweet-scroll`}>
            <div className='w-full flex flex-col gap-5 h-[359px]'>
                <div className={shared ? "flex items-center justify-start h-[24px]" : "flex items-center justify-between h-[24px]"}>
                    <div className='flex w-[40px] justify-start items-center'>
                        {type === "youtube" && <YoutubeIcon size='md' />}
                        {type === "tweet" && <TweeterIcon size='md' />}
                        {type === "document" && <DocumentIcon size='md' />}
                        {type === "link" && <LinkIcon size='md' />}
                        {type === "instagram" && <InstagramIcon size='md' />}
                        {type === "pinterest" && <PinterestIcon size='md' />}
                    </div>
                    <CardText title={title} />
                    {!shared && (
                        <div className='w-[80px] justify-end items-center gap-4 flex relative'>
                            {!selectActive && <div
                                onClick={async () => {
                                    if (deleteCard) {
                                        setModalComponent(<DeleteModal id={id} deleteCard={deleteCard} />);
                                        setModalOpen(true);
                                    }
                                }}
                                className='hover:text-red-500 duration-150 cursor-pointer'
                            >
                                <DeleteIcon size='md' />
                            </div>}
                            {!selectActive && <div
                                ref={menuButtonRef}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDropdown((prev) => !prev);
                                }}
                                className='hover:text-primaryBtn duration-150 cursor-pointer'
                            >
                                <MenuIcon size='md' />
                            </div>}
                            {!selectActive && <div
                                ref={dropdownRef}
                                className={`absolute z-[1000] flex-col bottom-0 right-0 translate-y-full border-gray-200 border-2 border-solid bg-white rounded-md shadow-md ${
                                    showDropdown ? 'flex' : 'hidden'
                                } select-none`}
                            >
                                <div onClick={(e)=>{
                                    e.stopPropagation();
                                    handleToggleIncludeInSelected();
                                    setSelectActive(true);
                                    setShowDropdown(false);
                                }} className='cursor-pointer px-4 py-2 w-[150px] rounded-t-md hover:bg-secondaryBtn duration-150 flex justify-start items-center gap-2'>
                                    <SelectIcon size='md' />
                                    select
                                </div>
                                <div onClick={(e)=>{
                                    e.stopPropagation();
                                    handleToggleIncludeInSelected();
                                    setSelectActive(true);
                                    setShowDropdown(false);
                                    setModalComponent(<ShareManyModal/>);
                                    setModalOpen(true);
                                }} className='cursor-pointer px-4 py-2 w-[150px] rounded-b-md hover:bg-secondaryBtn duration-150 flex justify-start items-center gap-2'>
                                    <ShareIcon size='md' />
                                    share
                                </div>
                            </div>}
                            {
                                selectActive && <div onClick={(e)=>{
                                    e.stopPropagation();
                                    handleToggleIncludeInSelected();
                                }} className={`rounded-full ${selected?"bg-black text-white":""} hover:bg-gray-300 hover:text-white hover:duration-100 hover:scale-90 cursor-pointer`}>
                                    <SelectIcon size='lg' />
                                </div>
                            }
                        </div>
                    )}
                </div>
                <CardEmbed type={type} link={link} />
                {type === "document" && <CardDocument content={content} />}
                {(type !== "tweet" && type !== "document") && <CardDescription content={content} />}
                <div className='flex gap-2 items-center flex-wrap'>
                    {tags?.map((tag, index) => (
                        <Tag key={index} tag={tag} />
                    ))}
                </div>
            </div>
            <div>
                <p className='text-sm text-gray-500 mt-2'>Added on {date.day}/{date.month}/{date.year}</p>
            </div>
        </div>
    );
}

export default Card