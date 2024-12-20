"use client";
import Hero from "./_components/ui/Hero";
import Sidebar from "./_components/ui/Sidebar";
import { Toaster } from 'react-hot-toast';
import { useAppContext } from "./context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function Home() {
	const router = useRouter();
	const { heroKey } = useAppContext();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		if (!localStorage.getItem('token')) {
			router.replace('/auth/login');
		} else {
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	return (
		loading ?
			<main>
				<div className="flex items-center justify-center h-screen">
					<Loader2 className="animate-spin stroke-2 size-6" />
				</div>
			</main> :
			<main className="flex">
				<Sidebar />
				<Hero key={heroKey} />
				<Toaster position="top-right" />
			</main>
	);
}
