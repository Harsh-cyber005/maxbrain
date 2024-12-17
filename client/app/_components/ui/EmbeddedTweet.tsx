"use client";
import dynamic from "next/dynamic";
import React from "react";

const TwitterTweetEmbed = dynamic(
    () => import("react-twitter-embed").then((mod) => mod.TwitterTweetEmbed),
    { ssr: false }
);

interface EmbeddedTweetProps {
    tweetId: string;
}

const EmbeddedTweet: React.FC<EmbeddedTweetProps> = ({ tweetId }) => {
    return (
        <div className="flex justify-center items-start h-[250px]">
            <TwitterTweetEmbed tweetId={tweetId}/>
        </div>
    );
};

export default EmbeddedTweet;
