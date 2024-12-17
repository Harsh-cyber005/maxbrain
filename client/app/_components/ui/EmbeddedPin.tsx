"use client";
import React from "react";
import { PinterestEmbed } from 'react-social-media-embed';

interface EmbeddedPinterestProps {
    url: string;
}

const EmbeddedPinterest: React.FC<EmbeddedPinterestProps> = ({ url }) => {
    return (
        <div className="w-full flex justify-center items-center overflow-hidden rounded-[28px]">
            <PinterestEmbed
                url={url}
                height={200}
            />
        </div>
    );
};

export default EmbeddedPinterest;
