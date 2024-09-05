import React, { useState } from 'react';
import Header from '../components/header';
import Footers from '../components/footers';
import { Button, Label } from 'flowbite-react';
import { AiOutlineLoading } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { serverURL } from '../constants';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {

    const [mName, setName] = useState(sessionStorage.getItem('mName'));
    const [email, setEmail] = useState(sessionStorage.getItem('email'));
    const [password, setPassword] = useState('');
    const [processing, setProcessing] = useState(false);

    const navigate = useNavigate();
    function redirectSubscription() {
        navigate("/subscription");
    }

    const showToast = async (msg) => {
        setProcessing(false);
        toast(msg, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined
        });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!email || !mName) {
            showToast('Please fill in all required fields');
            return;
        }
        setProcessing(true);
        const uid = sessionStorage.getItem('uid');
        const postURL = serverURL + '/api/profile';
        try {
            const response = await axios.post(postURL, { email, mName, password, uid });
            if (response.data.success) {
                showToast(response.data.message);
                sessionStorage.setItem('email', email);
                sessionStorage.setItem('mName', mName);
                setProcessing(false)
            } else {
                showToast(response.data.message);
            }
        } catch (error) {
            showToast('Internal Server Error');
        }
    }

    return (
        <div className='h-screen flex flex-col'>
            <Header isHome={true} className="sticky top-0 z-50" />
            <div className='dark:bg-black flex-1'>
                <div className='flex-1 flex items-center justify-center py-10 flex-col'>
                    <form onSubmit={handleSubmit} className="md:w-2/5 w-4/5 m-auto py-4 no-scrollbar ">
                        <p className='text-center font-black text-4xl text-black dark:text-white'>Profile</p>
                        <div className='py-6'>
                            <div className='mb-6'>
                                <div className="mb-2 block">
                                    <Label className="font-bold text-black dark:text-white" htmlFor="name1" value="Name" />
                                </div>
                                <input value={mName} onChange={(e) => setName(e.target.value)} className='focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white' id="name1" type="text" />
                            </div>
                            <div className='mb-6'>
                                <div className="mb-2 block">
                                    <Label className="font-bold text-black dark:text-white" htmlFor="email1" value="Email" />
                                </div>
                                <input value={email} onChange={(e) => setEmail(e.target.value)} className='focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white' id="email1" type="email" />
                            </div>
                            <div className='mb-14'>
                                <div className="mb-2 block">
                                    <Label className="font-bold text-black dark:text-white" htmlFor="password1" value="New Password" />
                                </div>
                                <input value={password} onChange={(e) => setPassword(e.target.value)} className='focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white' id="password1" type="password" />
                            </div>
                            <Button isProcessing={processing} processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />} className='items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none w-full enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent' type="submit">Submit</Button>
                            <Button onClick={redirectSubscription} className='my-6 items-center justify-center text-center border-black dark:border-white dark:bg-black dark:text-white bg-white text-black font-bold rounded-none w-full enabled:hover:bg-white enabled:focus:bg-white enabled:focus:ring-transparent dark:enabled:hover:bg-black dark:enabled:focus:bg-black dark:enabled:focus:ring-transparent'>Manage Subscriptions</Button>
                        </div>

                    </form>
                </div>
            </div>
            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Profile;
