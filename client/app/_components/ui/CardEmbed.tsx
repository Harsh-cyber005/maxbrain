"use client";

import React, { useEffect } from 'react'
import EmbeddedTweet from './EmbeddedTweet'
import { LinkIcon } from '@/app/_icons/LinkIcon';
import EmbeddedInstagram from './EmbeddedInstagram';
import EmbeddedPin from './EmbeddedPin';

interface CardEmbedProps {
    link?: string
    type: "tweet" | "youtube" | "document" | "link" | "instagram" | "pinterest"
}

function CardEmbed({ link, type }: CardEmbedProps) {
    const [youtubeVideoID, setYoutubeVideoID] = React.useState<string | null>(null)
    const [youtubeLink, setYoutubeLink] = React.useState<string>("")
    const [linkLink, setLinkLink] = React.useState<string>("")
    const [post, setPost] = React.useState<string>("")
    const [pin, setPin] = React.useState<string>("")

    const [tweetID, setTweetID] = React.useState<string>("")

    useEffect(() => {
        if(link && type === "youtube"){
            const id:string = link.split('/').pop() || '';
            setYoutubeVideoID(id);
        }
    },[link, type])

    useEffect(()=>{
        if(youtubeVideoID && type === "youtube"){
            setYoutubeLink(`https://www.youtube.com/embed/${youtubeVideoID}`)
        }
    },[youtubeVideoID, type])

    useEffect(()=>{
        if(link && type === "tweet"){
            const id:string = link.split('/').pop() || '';
            setTweetID(id);
        }
    },[link, type])

    useEffect(()=>{
        if(link && type === "link"){
            setLinkLink(link);
        }
    },[link, type])

    useEffect(()=>{
        if(link && type === "instagram"){
            setPost(link);
        }
    },[link, type])
    
    useEffect(()=>{
        if(link && type === "pinterest"){
            setPin(link);
        }
    },[link, type])
    
    return (
        <>
            {
                type === "youtube" && youtubeLink && (
                    <div className='rounded-md'>
                        <iframe className='w-full rounded-md' src={youtubeLink} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                    </div>
                )
            }
            {
                type === "tweet" && tweetID && (
                    <div className='overflow-y-scroll tweet-scroll'>
                        <EmbeddedTweet tweetId={tweetID} />
                    </div>
                )
            }
            {
                type === "instagram" && post && (
                    <div>
                        <EmbeddedInstagram url={post} />
                    </div>
                )
            }
            {
                type === "pinterest" && pin && (
                    <div>
                        <EmbeddedPin url={pin} />
                    </div>
                )
            }
            {
                type === "link" && linkLink && (
                    <div onClick={()=>{
                        window.open(linkLink, '_blank');
                    }} className='w-full h-[150.4px] cursor-pointer duration-200 bg-secondaryBtn hover:bg-secondaryBtn-hover rounded-md flex flex-col items-center justify-center'>
                        <LinkIcon size='lg' className='text-primaryBtn-hover font-bold size-10'/>
                        <p className='text-[#3F3BD1] w-1/2 overflow-hidden text-ellipsis text-nowrap'>{linkLink}</p>
                    </div>
                )
            }
        </>
    )
}

export default CardEmbed