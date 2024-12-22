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
    const [usernameEmpty, setUsernameEmpty] = useState(true);
    const [emptyUsernamePrompt, setEmptyUsernamePrompt] = useState(false);
    const [passwordEmpty, setPasswordEmpty] = useState(true);
    const [emptyPasswordPrompt, setEmptyPasswordPrompt] = useState(false);
    const [email, setEmail] = useState('');
    const [emptyEmail, setEmptyEmail] = useState(true);
    const [emptyEmailPrompt, setEmptyEmailPrompt] = useState(false);
    const [otp, setOtp] = useState('');
    const [emptyOtp, setEmptyOtp] = useState(true);
    const [emptyOtpPrompt, setEmptyOtpPrompt] = useState(false);

    const [otpSent, setOtpSent] = useState(false);

    const { setAuthName } = useAppContext();

    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [loadingOtp, setLoadingOtp] = useState(false);

    async function handleSendOtp() {
        if (usernameEmpty) {
            setEmptyUsernamePrompt(true);
            if (passwordEmpty) {
                setEmptyPasswordPrompt(true);
                if (emptyEmail) {
                    setEmptyEmailPrompt(true);
                }
            }
            if (emptyEmail) {
                setEmptyEmailPrompt(true);
            }
            return;
        }
        if (passwordEmpty) {
            setEmptyPasswordPrompt(true);
            if (usernameEmpty) {
                setEmptyUsernamePrompt(true);
                if (emptyEmail) {
                    setEmptyEmailPrompt(true);
                }
            }
            if (emptyEmail) {
                setEmptyEmailPrompt(true);
            }
            return;
        }
        if (emptyEmail) {
            setEmptyEmailPrompt(true);
            if (usernameEmpty) {
                setEmptyUsernamePrompt(true);
                if (passwordEmpty) {
                    setEmptyPasswordPrompt(true);
                }
            }
            if (passwordEmpty) {
                setEmptyPasswordPrompt(true);
            }
            return;
        }
        try {
            setLoadingOtp(true);
            const response = await axios.post('/email', {
                emailAddress: email,
                userName: username
            });
            const data = response.data;
            if (response.status === 200) {
                toast.success('OTP sent successfully');
            } else {
                toast.error(data.message);
            }
            setLoadingOtp(false);
            setOtpSent(true);
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
            setLoadingOtp(false);
            return;
        }
    }

    async function handleSignup() {
        if(emptyOtp) {
            setEmptyOtpPrompt(true);
            return;
        }
        if (usernameEmpty) {
            setEmptyUsernamePrompt(true);
            if (passwordEmpty) {
                setEmptyPasswordPrompt(true);
                if (emptyEmail) {
                    setEmptyEmailPrompt(true);
                }
            }
            if (emptyEmail) {
                setEmptyEmailPrompt(true);
            }
            return;
        }
        if (passwordEmpty) {
            setEmptyPasswordPrompt(true);
            if (usernameEmpty) {
                setEmptyUsernamePrompt(true);
                if (emptyEmail) {
                    setEmptyEmailPrompt(true);
                }
            }
            if (emptyEmail) {
                setEmptyEmailPrompt(true);
            }
            return;
        }
        if (emptyEmail) {
            setEmptyEmailPrompt(true);
            if (usernameEmpty) {
                setEmptyUsernamePrompt(true);
                if (passwordEmpty) {
                    setEmptyPasswordPrompt(true);
                }
            }
            if (passwordEmpty) {
                setEmptyPasswordPrompt(true);
            }
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post('/signup', {
                username,
                password,
                email,
                otp
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

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (localStorage.getItem('token')) {
            router.replace('/');
        }
    }, [])

    useEffect(() => {
        if (username.length > 0) {
            setUsernameEmpty(false);
            setEmptyUsernamePrompt(false);
        } else {
            setUsernameEmpty(true);
        }
    }, [username]);

    useEffect(() => {
        if (password.length > 0) {
            setPasswordEmpty(false);
            setEmptyPasswordPrompt(false);
        } else {
            setPasswordEmpty(true);
        }
    }, [password]);

    useEffect(() => {
        if (email.length > 0) {
            setEmptyEmail(false);
            setEmptyEmailPrompt(false);
        } else {
            setEmptyEmail(true);
        }
    }, [email]);

    useEffect(() => {
        if (otp.length > 0) {
            setEmptyOtp(false);
            setEmptyOtpPrompt(false);
        } else {
            setEmptyOtp(true);
        }
    }, [otp]);

    return (
        <div className="flex flex-col md:flex-row justify-center items-center md:min-h-screen md:h-screen h-max bg-[#F3F3F5]">
            <div className="md:w-[50%] h-full w-full">
                <Image src='/authwall.jpg' className='h-full w-full object-cover' alt='login' width={1920} height={1080} />
            </div>
            <div className="flex items-center justify-center md:w-[50%] w-full h-max md:h-full py-20 md:py-0">
                <div className={`w-full max-w-[30rem] lg:max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md flex`}>
                    <div className='min-w-full space-y-6 '>
                        <h2 className="text-xl font-bold text-center text-gray-800">Create a New Account</h2>
                        <div>
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                name='username'
                                id='username'
                                value={username}
                                placeholder={emptyUsernamePrompt ? "Please Enter the username" : 'Enter your username'}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`w-full border p-2 rounded-md ${emptyUsernamePrompt ? 'border-red-500 placeholder-red-500' : 'placeholder-gray-400 border-gray-300'}`}
                            />
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name='email'
                                id='email'
                                value={email}
                                placeholder={emptyEmailPrompt ? "Please Enter the email" : 'Enter your email'}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full border p-2 rounded-md ${emptyEmailPrompt ? 'border-red-500 placeholder-red-500' : 'placeholder-gray-400 border-gray-300'}`}
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name='password'
                                id='password'
                                value={password}
                                placeholder={emptyPasswordPrompt ? "Please Enter the password" : 'Enter your password'}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full border p-2 rounded-md ${emptyPasswordPrompt ? 'border-red-500 placeholder-red-500' : 'placeholder-gray-400 border-gray-300'}`}
                            />
                        </div>
                        {otpSent && <div>
                            <label htmlFor="otp">OTP</label>
                            <input
                                type="text"
                                name='otp'
                                id='otp'
                                value={otp}
                                placeholder={emptyOtpPrompt ? "Please Enter the otp" : 'Enter the otp'}
                                onChange={(e) => setOtp(e.target.value)}
                                className={`w-full border p-2 rounded-md ${emptyOtpPrompt ? 'border-red-500 placeholder-red-500' : 'placeholder-gray-400 border-gray-300'}`}
                            />
                        </div>}
                        <div className='flex lg:flex-row flex-col gap-2'>
                            <Button loading={loadingOtp} onClick={() => {
                                handleSendOtp();
                            }} text={otpSent?"Resend OTP":'Send OTP'} size='md' width='w-full' variant='primary' startIcon={<LoginIcon size='md' />} />
                            {otpSent && <Button loading={loading} onClick={() => {
                                handleSignup();
                            }} text='Sign Up' size='md' width='w-full' variant='secondary' startIcon={<LoginIcon size='md' />} />}
                        </div>
                        <div>
                            <p className="text-center text-gray-600">Already have an account? <span onClick={() => {
                                router.replace('/auth/login');
                            }} className="text-blue-600 cursor-pointer hover:text-blue-950">Sign In</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster position="bottom-right" />
        </div>
    );
};

export default Signup;
