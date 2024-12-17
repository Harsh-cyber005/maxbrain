"use client";
import Hero from "./_components/ui/Hero";
import Sidebar from "./_components/ui/Sidebar";
import { Toaster } from 'react-hot-toast';
import { useAppContext } from "./context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
	const router = useRouter();
	const { heroKey } = useAppContext();

	useEffect(()=>{
		if(!localStorage.getItem('token')){
			router.replace('/auth/login');
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])

	return (
		<main className="flex">
			<Sidebar/>
			<Hero key={heroKey}/>
			<Toaster position="top-right"/>
		</main>
	);
}
