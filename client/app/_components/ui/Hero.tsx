import { useEffect, useState } from "react";
import Card from "./Card";
import axios from "@/app/api/axios";
import { Button } from "./Button";
import { PlusIcon } from "@/app/_icons/PlusIcon";
import { ShareIcon } from "@/app/_icons/ShareIcon";
import { useAppContext } from "@/app/context/AppContext";
import ShareModal from "./ShareModal";
import CreateModal from "./CreateModal";
import { MenuIcon } from "@/app/_icons/MenuIcon";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import SkeletonCard from "./SkeletonCard";

interface dateType {
	day: string;
	month: string;
	year: string;
};

interface dataType {
	_id: string;
	title: string;
	link: string;
	type: "youtube" | "tweet" | "document" | "link" | "instagram" | "pinterest";
	content: string;
	tags: string[];
	date: dateType;
};

const dummy = localStorage.getItem('dummy') ? JSON.parse(localStorage.getItem('dummy') as string) : [
	1, 2, 3, 4, 5, 6, 7, 8, 9
];

export default function Hero() {
	const [data, setData] = useState<dataType[]>([]);
	const { setModalOpen, setTotalContent, totalContent, setModalComponent, filter, setShare, setAuthName, authName, setShareLink, baseShareLink, setSidebarOpen, setToken } = useAppContext();
	const router = useRouter();
	const [h1Display, setH1Display] = useState("Loading...");
	const [loading, setLoading] = useState(true);

	async function fetchData() {
		if (typeof window === "undefined") return;
		try {
			const response = await axios.get("/content", {
				headers: {
					'Authorization': localStorage.getItem('token')
				}
			});
			setData(response.data?.contents);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	async function getShare() {
		if (typeof window === "undefined") return;
		try {
			const response = await axios.get('/user', {
				headers: {
					'Authorization': localStorage.getItem('token')
				}
			});
			setShare(response.data.share);
			setAuthName(response.data.username);
			setShareLink(baseShareLink + response.data.shareLink);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		if (typeof window === "undefined") return;
		if (localStorage.getItem('token')) {
			getShare();
			fetchData();
			setToken(localStorage.getItem('token') || "");
			setAuthName(localStorage.getItem('authName') || "");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (totalContent === 0) {
			setH1Display("No Content Found");
		} else {
			setH1Display("Your Contents, " + authName);
		}
	}, [authName, totalContent])

	useEffect(() => {
		setTotalContent(data.length);
		if (data.length > 0) {
			let i = 1;
			const dummy = data.map(() => {
				return i++;
			});
			localStorage.setItem('dummy', JSON.stringify(dummy));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	async function deleteCard(id: string) {
		try {
			await axios.delete(`/content`, {
				data: {
					contentId: id
				},
				headers: {
					'Authorization': localStorage.getItem('token')
				}
			});
			fetchData();
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<div className="bg-background min-h-screen h-auto w-full ml-0 xs:ml-[96px] lg:ml-[300px]">
			<div className="xxs:p-10 p-5">
				<div className="flex justify-between items-center pb-10">
					{
						loading &&
						<div className="flex items-center justify-center text-[#3F3BD1]">
							<h1 className="text-2xl font-bold md:flex hidden mr-5">Loading...</h1>
							<Loader2 className="animate-spin stroke-2 size-6" />
						</div>
					}
					{
						!loading &&
						<div onClick={() => {
							router.replace('/');
						}} className="text-[#3F3BD1] hidden xs:flex cursor-pointer">
							<h1 className="text-2xl font-bold md:flex hidden">{h1Display}</h1>
							<h1 className="text-2xl font-bold md:hidden hidden xs:flex">{authName}</h1>
						</div>
					}
					<div className="lg:flex hidden justify-center items-center gap-3">
						<Button text="Share Brain" variant="secondary" size="md" startIcon={<ShareIcon size="md" />} onClick={() => {
							setModalComponent(<ShareModal />);
							setModalOpen(true);
						}} />
						<Button text="Add Content" variant="primary" size="md" startIcon={<PlusIcon size="md" />} onClick={() => {
							setModalComponent(<CreateModal />);
							setModalOpen(true);
						}} />
					</div>
					<div className="flex justify-start items-center gap-3 xs:hidden">
						<div onClick={() => {
							setSidebarOpen(true)
						}} className='hover:bg-gray-200 duration-200 p-2 rounded-md cursor-pointer'>
							<MenuIcon size='md' />
						</div>
					</div>
					<div className="flex justify-end items-center gap-3 lg:hidden">
						<Button text="" variant="secondary" size="md" startIcon={<ShareIcon size="md" />} onClick={() => {
							setModalComponent(<ShareModal />);
							setModalOpen(true);
						}} />
						<Button text="" variant="primary" size="md" startIcon={<PlusIcon size="md" />} onClick={() => {
							setModalComponent(<CreateModal />);
							setModalOpen(true);
						}} />
					</div>
				</div>
				{
					!loading ?
						<div className="flex flex-col xs:flex-row justify-center xs:justify-normal items-center xs:items-baseline flex-wrap gap-4 ">
							{
								data.map((item, index) => {
									if (filter === "" || filter === item.type) {
										return <Card shared={false} id={item._id} key={index} title={item.title} link={item.link} type={item.type} content={item.content} tags={item.tags} date={item.date} deleteCard={deleteCard} />
									}
								})
							}
						</div> :
						<div className="flex flex-col xs:flex-row justify-center xs:justify-normal items-center xs:items-baseline flex-wrap gap-4 ">
							{
								dummy.map((item: number) => {
									return <SkeletonCard key={item} />
								})
							}
						</div>
				}
			</div>
		</div>
	);
}