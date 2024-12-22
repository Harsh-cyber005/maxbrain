"use client";
import ShareHeroMany from '@/app/_components/ui/ShareHeroMany';
import Sidebar from '@/app/_components/ui/Sidebar'
import React from 'react'
import { Toaster } from 'react-hot-toast'

function page() {
    return (
        <main className="flex">
			<Sidebar/>
			<ShareHeroMany/>
			<Toaster position="top-right"/>
		</main>
    )
}

export default page