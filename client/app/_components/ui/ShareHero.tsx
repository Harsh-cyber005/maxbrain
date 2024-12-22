import { useEffect, useState } from "react";
import Card from "./Card";
import axios from "@/app/api/axios";
import { Button } from "./Button";
import { useAppContext } from "@/app/context/AppContext";
import { DownloadIcon } from "@/app/_icons/DownloadIcon";
import { useParams, useRouter } from "next/navigation";
import { ErrorIcon } from "@/app/_icons/ErrorIcon";
import DownloadModal from "./DownloadModal";
import { MenuIcon } from "@/app/_icons/MenuIcon";
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
    type: "youtube" | "tweet" | "document" | "link";
    content: string;
    tags: string[];
    date: dateType;
};

const dummy = [
    1, 2, 3, 4, 5, 6, 7, 8, 9
];

export default function ShareHero() {
    const params = useParams();
    const [shareID, setShareID] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const [user, setUser] = useState<string>("");
    const [h1Display, setH1Display] = useState<string>("Loading...");
    const [data, setData] = useState<dataType[]>([]);
    const { filter } = useAppContext();
    const router = useRouter();
    const { setModalOpen, setModalComponent, setTotalContentShare, setSidebarOpen, setAuthName } = useAppContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setShareID(params.shareID as string || "");
    }, [params]);

    async function fetchData() {
        try {
            const response = await axios.get(`/brain/${shareID}`);
            setUser(response.data.username);
            setData(response.data.contents);
        } catch (error) {
            setError(true);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    async function mergeData() {
        try {
            const response = await axios.post(`/brain/merge`, {
                contents: data,
                username: user,
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            return response.status || 400;
        } catch (error) {
            console.log(error);
            return 400;
        }
    }

    useEffect(() => {
        setAuthName(localStorage.getItem('authName') || "");
    }, [])

    useEffect(() => {
        setTotalContentShare(data.length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    useEffect(() => {
        if (!user) {
            return;
        }
        setH1Display(`Contents from ${user}'s Brain`);
    }, [user])

    useEffect(() => {
        if (!shareID) {
            return;
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shareID]);

    return (
        <div className="bg-background min-h-screen h-auto w-full ml-0 xs:ml-[96px] lg:ml-[300px]">
            <div className="xxs:p-10 p-5">
                {
                    !error &&
                    <div className="flex justify-between items-center pb-10">
                        {
                            loading &&
                            <div className="items-center justify-center text-[#5046E4] hidden xs:flex">
                                <h1 className="text-2xl font-bold md:flex hidden mr-5">Loading...</h1>
                                <Loader2 className="animate-spin stroke-2 size-6" />
                            </div>
                        }
                        {
                            !loading &&
                            <div onClick={() => {
                                router.replace('/');
                            }} className="hidden xs:flex text-[#5046E4] cursor-pointer">
                                <h1 className="text-2xl font-bold md:flex hidden">{h1Display}</h1>
                                <h1 className="text-2xl font-bold md:hidden hidden xs:flex">{user || "Shared Brain"}</h1>
                            </div>
                        }
                        <div className="flex justify-start items-center gap-3 xs:hidden">
                            <div onClick={() => {
                                setSidebarOpen(true)
                            }} className='hover:bg-gray-200 duration-200 p-2 rounded-md cursor-pointer'>
                                <MenuIcon size='md' />
                            </div>
                        </div>
                        <div onClick={() => {
                            setModalComponent(<DownloadModal username={user} mergeData={mergeData} />);
                            setModalOpen(true);
                        }} className="flex justify-center items-center gap-3 lg:hidden">
                            <Button
                                variant="primary"
                                size="md"
                                startIcon={<DownloadIcon size="md" />}
                            />
                        </div>
                        <div onClick={() => {
                            setModalComponent(<DownloadModal username={user} mergeData={mergeData} />);
                            setModalOpen(true);
                        }} className="lg:flex hidden justify-center items-center gap-3">
                            <Button
                                text="Add into your Brain"
                                variant="primary"
                                size="md"
                                startIcon={<DownloadIcon size="md" />}
                            />
                        </div>
                    </div>
                }
                {
                    loading ?
                        <div className="flex flex-col xs:flex-row justify-center xs:justify-normal items-center xs:items-baseline flex-wrap gap-4 ">
                            {
                                dummy.map((item: number) => {
                                    return <SkeletonCard key={item} />
                                })
                            }
                        </div> :
                    <div className="flex flex-col xs:flex-row justify-center xs:justify-normal items-center xs:items-baseline flex-wrap gap-4">
                        {data
                            .filter((item) => filter === "" || filter === item.type)
                            .map((item) => (
                                <Card
                                    id={item._id}
                                    key={item._id}
                                    title={item.title}
                                    link={item.link}
                                    type={item.type}
                                    content={item.content}
                                    tags={item.tags}
                                    date={item.date}
                                    shared={true}
                                />
                            ))}
                    </div>
                }
                {
                    error && <div className="text-red-700 text-2xl mt-5 stroke-[5px] px-20 pt-10">
                        <ErrorIcon size="lg" className="size-16" />
                        <h1>
                            Link is Invalid or Expired
                        </h1>
                    </div>
                }
            </div>
        </div>
    );
}
