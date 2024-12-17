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

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const {setAuthName} = useAppContext();

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    async function handleSignup() {
        try{
            setLoading(true);
            const response = await axios.post('/signup', {
                username,
                password
            });
            const data = response.data;
            if (response.status === 200) {
                toast.success('Signed up successfully, login to continue');
                setAuthName(username);
                router.replace('/auth/login');
            } else {
                toast.error(data.message);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
            setLoading(false);
            return;
        }
    }

    useEffect(()=>{
        if(typeof window === 'undefined') return;
        if(localStorage.getItem('token')){
            router.replace('/');
        }
    },[])

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
                        handleSignup();
                    }} text='Sign up' size='md' width='w-full' variant='primary' startIcon={<LoginIcon size='md' />} />
                    <div>
                        <p className="text-center text-gray-600">Already have an account? <span onClick={()=>{
                            router.replace('/auth/login');
                        }} className="text-blue-600 cursor-pointer hover:text-blue-950">Sign In</span></p>
                    </div>
                </div>
            </div>
            <Toaster position="bottom-right" />
        </div>
    );
};

export default Signup;
