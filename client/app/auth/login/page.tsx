"use client";
import { Button } from '@/app/_components/ui/Button';
import { LoginIcon } from '@/app/_icons/LoginIcon';
import axios from '@/app/api/axios';
import { useAppContext } from '@/app/context/AppContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

const Signin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    const { authName, wantBack, setWantBack, setAuthName, setToken } = useAppContext();

    const [loading, setLoading] = useState(false);

    async function handleSignin() {
        try {
            setLoading(true);
            const response = await axios.post('/signin', {
                username,
                password
            });
            const data = response.data;
            if (response.status === 200) {
                if(typeof window === 'undefined') return;
                toast.success('Signed in successfully');
                localStorage.setItem('token', data.token);
                setToken(data.token);
                setAuthName(username);
                localStorage.setItem('authName', username);
                if (wantBack) {
                    setWantBack(false);
                    router.back();
                    setLoading(false);
                }
                else {
                    setTimeout(() => {
                        router.replace('/');
                        setLoading(false);
                    }, 1000);
                }
            } else {
                toast.error(data.message);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
            setLoading(false);
            return;
        }
    }

    useEffect(() => {
        setUsername(authName);
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('token')) {
                router.replace('/');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="flex flex-col md:flex-row justify-center items-center min-h-[1000px] md:min-h-screen h-screen bg-[#F3F3F5]">
            <div className="md:w-[50%] h-full w-full">
                <Image src='/authwall.jpg' className='h-full w-full object-cover' alt='login' width={1920} height={1080} />
            </div>
            <div className="flex items-center justify-center md:w-[50%] w-full h-full md:h-full">
                <div className="w-full max-w-[20rem] lg:max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-center text-gray-800">Welcome Back !</h2>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name='username'
                            id='username'
                            value={username}
                            placeholder='Enter your username'
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border p-2 border-gray-300 rounded-md placeholder-gray-400"
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name='password'
                            id='password'
                            value={password}
                            placeholder='Enter your password'
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md placeholder-gray-400"
                        />
                    </div>
                    <Button loading={loading} onClick={() => {
                        handleSignin();
                    }} text='Sign in' size='md' width='w-full' variant='primary' startIcon={<LoginIcon size='md' />} />
                    <div>
                        <p className="text-center text-gray-600">Don&apos;t have an account? <span onClick={() => {
                            setWantBack(false);
                            router.replace('/auth/signup');
                        }} className="text-blue-600 cursor-pointer hover:text-blue-950">Sign Up</span></p>
                    </div>
                </div>
            </div>
            <Toaster position="bottom-right" />
        </div>
    );
};

export default Signin;
