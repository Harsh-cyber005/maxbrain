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
import { DeleteIcon } from "@/app/_icons/DeleteIcon";
import { CrossIcon } from "@/app/_icons/CrossIcon";
import DeleteModalSelected from "./DeletedSelectedModal";
import ShareManyModal from "./ShareManyModal";

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

const dummy = [
	1, 2, 3, 4, 5, 6, 7, 8, 9
];

export default function Hero() {
	const [data, setData] = useState<dataType[]>([]);
	const { setModalOpen, setTotalContent, totalContent, setModalComponent, filter, setShare, setAuthName, authName, setShareLink, baseShareLink, setSidebarOpen, setToken, selected, selectActive, setSelectActive, setSelected, setHeroKey } = useAppContext();
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
			setHeroKey(Math.random());
		} catch (error) {
			console.log(error);
		}
	}

	async function deleteSelected() : Promise<number> {
		try {
			await axios.delete(`/content/selected`, {
				data: {
					contentIds: selected
				},
				headers: {
					'Authorization': localStorage.getItem('token')
				}
			});
			fetchData();
			setHeroKey(Math.random());
			return 1;
		} catch (error) {
			console.log(error);
			return 0;
		} finally {
			setSelectActive(false);
			setSelected([]);
		}
	}

	return (
		<div className="bg-background min-h-screen h-auto w-full ml-0 xs:ml-[96px] lg:ml-[300px]">
			<div className="xxs:p-10 p-5">
				<div className="flex justify-between items-center h-[42px] mb-10 overflow-y-hidden relative">
					{
						loading &&
						<div className="items-center justify-center text-[#3F3BD1] hidden xs:flex">
							<h1 className="text-2xl font-bold md:flex hidden mr-5">Loading...</h1>
							<Loader2 className="animate-spin stroke-2 size-6" />
						</div>
					}
					{
						!loading &&
						<div className="text-[#3F3BD1] hidden xs:flex cursor-pointer hover:text-[#403bd1db] duration-200">
							<h1 className="text-2xl font-bold md:flex hidden">{h1Display}</h1>
							<h1 className="text-2xl font-bold md:hidden hidden xs:flex">{authName}</h1>
						</div>
					}
					<div className={`lg:flex flex-col hidden justify-center items-center gap-3 absolute top-0 right-0 ${selectActive?"translate-y-[-52px]":""} duration-200`}>
						<div className="flex justify-start items-center gap-3">
							<Button text="Share Brain" variant="secondary" size="md" startIcon={<ShareIcon size="md" />} onClick={() => {
								setModalComponent(<ShareModal />);
								setModalOpen(true);
							}} />
							<Button text="Add Content" variant="primary" size="md" startIcon={<PlusIcon size="md" />} onClick={() => {
								setModalComponent(<CreateModal />);
								setModalOpen(true);
							}} />
						</div>
						<div className="flex justify-center items-center gap-3">
							<Button onClick={()=>{
								setSelectActive(false);
								setSelected([]);
							}} text="Cancel" variant="none" size="md" startIcon={<CrossIcon size="md"/>}/>
							<Button onClick={()=>{
								setModalComponent(<ShareManyModal/>)
								setModalOpen(true);
							}} text="Share" variant="primary" size="md" startIcon={<ShareIcon size="md" />}/>
							<Button onClick={()=>{
								setModalComponent(<DeleteModalSelected deleteSelected={deleteSelected}/>);
								setModalOpen(true);
							}} text="Delete" variant="danger" size="md" startIcon={<DeleteIcon size="md"/>}/>
						</div>
					</div>
					<div className="flex justify-start items-center gap-3 xs:hidden">
						<div onClick={() => {
							setSidebarOpen(true)
						}} className='hover:bg-gray-200 duration-200 p-2 rounded-md cursor-pointer'>
							<MenuIcon size='md' />
						</div>
						<h1 onClick={()=>{
							router.replace('/');
						}} className="text-xl font-bold cursor-pointer">duobrain</h1>
					</div>
					<div className={`xs:flex flex-col hidden justify-end items-end gap-3 lg:hidden absolute top-0 right-0 ${selectActive?"translate-y-[-45px]":"translate-y-[3px]"} duration-200`}>
						<div className="flex justify-start items-center gap-3">
							<Button text="" variant="secondary" size="md" startIcon={<ShareIcon size="md" />} onClick={() => {
								setModalComponent(<ShareModal />);
								setModalOpen(true);
							}} />
							<Button text="" variant="primary" size="md" startIcon={<PlusIcon size="md" />} onClick={() => {
								setModalComponent(<CreateModal />);
								setModalOpen(true);
							}} />
						</div>
						<div className="flex justify-center items-center gap-3">
							<Button onClick={()=>{
								setSelectActive(false);
								setSelected([]);
							}} text="" variant="none" size="md" startIcon={<CrossIcon size="md"/>}/>
							<Button onClick={()=>{
								setModalComponent(<ShareManyModal/>)
								setModalOpen(true)
							}} text="" variant="primary" size="md" startIcon={<ShareIcon size="md" />}/>
							<Button onClick={()=>{
								setModalComponent(<DeleteModalSelected deleteSelected={deleteSelected}/>);
								setModalOpen(true);
							}} text="" variant="danger" size="md" startIcon={<DeleteIcon size="md"/>}/>
						</div>
					</div>
					<div className={`flex flex-col justify-end items-end gap-3 xs:hidden absolute top-0 right-0 ${selectActive?"translate-y-[-45px]":"translate-y-[3px]"} duration-200`}>
						<div className="flex justify-start items-center gap-3">
							<Button text="" variant="secondary" size="square-md" startIcon={<ShareIcon size="md" />} onClick={() => {
								setModalComponent(<ShareModal />);
								setModalOpen(true);
							}} />
							<Button text="" variant="primary" size="square-md" startIcon={<PlusIcon size="md" />} onClick={() => {
								setModalComponent(<CreateModal />);
								setModalOpen(true);
							}} />
						</div>
						<div className="flex justify-center items-center gap-3">
							<Button onClick={()=>{
								setSelectActive(false);
								setSelected([]);
							}} text="" variant="none" size="square-md" startIcon={<CrossIcon size="md"/>}/>
							<Button onClick={()=>{
								setModalComponent(<DeleteModalSelected deleteSelected={deleteSelected}/>);
								setModalOpen(true);
							}} text="" variant="primary" size="square-md" startIcon={<ShareIcon size="md" />}/>
							<Button onClick={()=>{
								setModalComponent(<DeleteModalSelected deleteSelected={deleteSelected}/>);
								setModalOpen(true);
							}} text="" variant="danger" size="square-md" startIcon={<DeleteIcon size="md"/>}/>
						</div>
					</div>
				</div>
				{
					!loading ?
						<div className="flex flex-col xs:flex-row justify-center xs:justify-normal items-center xs:items-baseline flex-wrap gap-4 ">
							{
								data.map((item, index) => {
									if (filter === "" || filter === item.type) {
										const cardSelected = selected.includes(item._id);
										return <Card shared={false} id={item._id} key={index} title={item.title} link={item.link} type={item.type} content={item.content} tags={item.tags} date={item.date} deleteCard={deleteCard} selected={cardSelected} />
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
