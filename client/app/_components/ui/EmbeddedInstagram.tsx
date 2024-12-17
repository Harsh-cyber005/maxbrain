"use client";
import React from "react";
import { InstagramEmbed } from 'react-social-media-embed';

interface EmbeddedInstagramProps {
    url: string;
}

const EmbeddedInstagram: React.FC<EmbeddedInstagramProps> = ({ url }) => {
    return (
        <div className="w-full flex justify-center border border-solid border-gray-200 rounded-lg hover:brightness-95 duration-200 overflow-hidden">
            <InstagramEmbed
                url={url}
                height={200}
                captioned
            />
        </div>
    );
};

export default EmbeddedInstagram;
