"use client";
import ShareHero from '@/app/_components/ui/ShareHero'
import Sidebar from '@/app/_components/ui/Sidebar'
import React from 'react'
import { Toaster } from 'react-hot-toast'

function page() {
    return (
        <main className="flex">
			<Sidebar/>
			<ShareHero/>
			<Toaster position="top-right"/>
		</main>
    )
}

export default page