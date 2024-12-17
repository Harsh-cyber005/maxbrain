import { CrossIcon } from '@/app/_icons/CrossIcon';
import { useAppContext } from '@/app/context/AppContext';
import React, { useEffect, useState } from 'react'
import { Button } from './Button';
import { PlusIcon } from '@/app/_icons/PlusIcon';
import axios from '@/app/api/axios';
import toast from 'react-hot-toast';

interface formDataType {
    type: string;
    title: string;
    content: string;
    link: string;
    tags: string[];
}

function CreateModal() {
    const { setModalComponent, setModalOpen, setHeroKey } = useAppContext();
    const [formData, setFormData] = useState<formDataType>({
        type: "",
        title: "",
        content: "",
        link: "",
        tags: [],
    });
    const [contentDisabled, setContentDisabled] = useState(false);
    const [linkDisabled, setLinkDisabled] = useState(false);
    const [linkPlaceholder, setLinkPlaceholder] = useState("Link");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        setFormData({ ...formData, [name]: value });
    };

    const handleTagsChange = (tag: string) => {
        setFormData({ ...formData, tags: [...formData.tags, tag] });
    };

    useEffect(() => {
        if (formData.type === "tweet") {
            setContentDisabled(true);
            setLinkDisabled(false);
            setLinkPlaceholder("Tweet Link");
        } else if (formData.type === "document") {
            setLinkDisabled(true);
            setContentDisabled(false);
            setLinkPlaceholder("Link");
        } else if (formData.type === "youtube") {
            setContentDisabled(false);
            setLinkDisabled(false);
            setLinkPlaceholder("YouTube Link");
        } else if (formData.type === "link") {
            setContentDisabled(false);
            setLinkDisabled(false);
            setLinkPlaceholder("Link");
        } else if (formData.type === "instagram") {
            setContentDisabled(false);
            setLinkDisabled(false);
            setLinkPlaceholder("Instagram Post Link");
        } else if (formData.type === "pinterest") {
            setContentDisabled(false);
            setLinkDisabled(false);
            setLinkPlaceholder("Pinterest Link");
        }
    }, [formData]);

    const [selectedOption, setSelectedOption] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [tagFocused, setTagFocused] = useState(false);
    const [newTag, setNewTag] = useState("");

    const [loading, setLoading] = useState(false);

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    useEffect(()=>{
        setFormData({...formData, type: selectedOption});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[selectedOption])

    useEffect(()=>{
        document.addEventListener("click", () => {
            setIsOpen(false);
        })
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter" && newTag.trim() !== "" && tagFocused) {
                handleTagsChange(newTag);
                setNewTag("");
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("click", () => {
                setIsOpen(false);
            })
            document.removeEventListener("keydown", handleKeyDown);
        }
    })

    async function handlePostContent() {
        try {
            setLoading(true);
            await axios.post("/content", {
                title: formData.title,
                content: formData.content,
                link: formData.link,
                tags: formData.tags,
                type: formData.type,
            },{
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            setLoading(false);
            toast.success("Content added successfully");
            setHeroKey((prev) => prev + 1);
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error("Something went wrong");
        }
    }

    return (
        <div className='bg-white p-5 mx-5 rounded-lg text-text w-[600px] flex flex-col gap-4'>
            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold'>Create a new Content</h1>
                <div className='flex justify-center items-center cursor-pointer' onClick={() => {
                    setModalComponent(null);
                    setModalOpen(false);
                }}>
                    <CrossIcon size='md' />
                </div>
            </div>
            <form className="mx-auto w-full space-y-2">
                <div onClick={(e)=>{
                    e.stopPropagation();
                }} className="relative w-full">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full border-2 border-gray-300 rounded-md shadow-sm px-4 py-2 text-left bg-white focus:border-black flex justify-between items-center"
                    >
                        {selectedOption || "Select an option"}
                        <span className="float-right">
                            <svg className={`w-5 h-5 transition-transform transform ${isOpen ? "rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </button>
                    {isOpen && (
                        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                            <li onClick={() => handleOptionSelect("document")} className='px-4 py-2 hover:bg-gray-200 cursor-pointer'>document</li>
                            <li onClick={() => handleOptionSelect("link")} className='px-4 py-2 hover:bg-gray-200 cursor-pointer'>link</li>
                            <li onClick={() => handleOptionSelect("youtube")} className='px-4 py-2 hover:bg-gray-200 cursor-pointer'>youtube</li>
                            <li onClick={() => handleOptionSelect("tweet")} className='px-4 py-2 hover:bg-gray-200 cursor-pointer'>tweet</li>
                            <li onClick={() => handleOptionSelect("instagram")} className='px-4 py-2 hover:bg-gray-200 cursor-pointer'>instagram</li>
                            <li onClick={() => handleOptionSelect("pinterest")} className='px-4 py-2 hover:bg-gray-200 cursor-pointer'>pinterest</li>
                        </ul>
                    )}
                </div>

                <div>
                    <label htmlFor="title" className="block font-medium">Title</label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        placeholder="New Content"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                    />
                </div>

                <div>
                    <label htmlFor="content" className={`block font-medium ${contentDisabled ? "text-gray-400 select-none" : ""}`}>Content {contentDisabled ? "( Disabled for Tweet )" : ""}</label>
                    <textarea
                        id="content"
                        name="content"
                        placeholder="Description"
                        disabled={contentDisabled}
                        value={formData.content}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2 resize-none disabled:bg-gray-100 disabled:text-gray-200 tweet-scroll"
                    />
                </div>

                <div>
                    <label htmlFor="link" className={`block font-medium ${linkDisabled?"text-gray-400 select-none":""}`}>Link {linkDisabled ? "( Disabled for Document )" : ""}</label>
                    <input
                        id="link"
                        name="link"
                        type="text"
                        placeholder={linkPlaceholder}
                        disabled={linkDisabled}
                        value={formData.link}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2 disabled:bg-gray-100 disabled:text-gray-200"
                    />
                </div>

                <div>
                    <label htmlFor="tags" className="block font-medium">Enter the tags for your content</label>
                    <div className={`flex justify-center items-center rounded ${tagFocused?"border-2 border-black border-solid px-[7px]":"border py-[1px] px-[8px]"} text-gray-400 overflow-x-scroll tweet-scroll`}>
                        <div className='flex justify-center items-center'>
                            {
                                formData.tags.map((tag, index) => {
                                    return (
                                        <div key={index} onClick={()=>{
                                            setFormData({...formData, tags: formData.tags.filter((item) => item !== tag)});
                                        }} className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-sm mr-2 cursor-pointer hover:bg-gray-200 duration-75">
                                            {tag}
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <input
                            onFocus={() => setTagFocused(true)}
                            onBlur={() => setTagFocused(false)}
                            id="tags"
                            name="tags"
                            type="text"
                            placeholder="Enter your tags ( Press Enter to add )"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            className="w-full focus:outline-none rounded p-2"
                        />
                    </div>
                </div>
            </form>
            <div>
                <Button loading={loading} onClick={()=>{
                    console.log(formData);
                    handlePostContent();
                }} variant='primary' size='md' text="Create" startIcon={<PlusIcon size='md' />} width='w-full' />
            </div>
            <div className='flex justify-center items-center'>
                <p className='text-sm text-gray-600'>press create to add content</p>
            </div>
        </div>
    )
}

export default CreateModal