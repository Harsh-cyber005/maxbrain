import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./context/AppContext";
import Portal from "./_components/ui/Portal";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Second Brain App",
	description: "Add and manage important contents to your second brain",
	icons: [
		{
			href: "/favicon.svg",
			url: "/favicon.svg"
		}
	],
	keywords: ["second brain", "notes", "knowledge management", "note-taking", "max-brain", "maxbrain", "productivity"],
	authors: [{ name: "harshmax" }]
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<AppProvider>
			<html lang="en">
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					<div id="portal">
						<Portal />
					</div>
					<main>{children}</main>
				</body>
			</html>
		</AppProvider>
	);
}
