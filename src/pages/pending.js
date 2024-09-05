import React, { useState } from 'react';
import Header from '../components/header';
import Footers from '../components/footers';
import { serverURL, websiteURL } from '../constants';
import axios from 'axios';
import { AiOutlineLoading } from 'react-icons/ai';
import { Button } from 'flowbite-react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const Pending = () => {

    const { state } = useLocation();
    const { sub, link } = state || {};
    const [processing, setProcessing] = useState(false);

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

    async function refresh() {
        const dataToSend = {
            sub: sub
        };
        try {
            setProcessing(true);
            const postURL = serverURL + '/api/razorapypending';
            await axios.post(postURL, dataToSend).then(res => {
                if (res.data.status === 'active') {
                    setProcessing(true);
                    const approveHref = websiteURL + '/success?subscription_id=' + sub;
                    window.location.href = approveHref;
                } else if (res.data.status === 'expired' || res.data.status === 'cancelled') {
                    const approveHref = websiteURL + '/failed';
                    window.location.href = approveHref;
                }
                else {
                    showToast("Payment is still pending");
                }
            });
        } catch (error) {
            //DO NOTHING
        }
    }

    function redirect() {
        window.open(link, '_blank');
    }

    return (
        <div className='h-screen flex flex-col'>
            <Header isHome={true} className="sticky top-0 z-50" />
            <div className='dark:bg-black flex-1'>
                <div className='flex-1 flex flex-col items-center justify-center py-8'>
                    <p className='text-center font-black text-4xl text-black dark:text-white'>Payment Pending</p>
                    <p className='text-center font-normal text-black py-4 dark:text-white'><strong>{sessionStorage.getItem('mName')}</strong> please make the payment.</p>
                    <Button onClick={redirect} className='items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none max-w-sm enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent'>Payment Link</Button>
                    <Button onClick={refresh} isProcessing={processing} processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />} className='mt-2 items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none max-w-sm enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent'>Verify Payment</Button>
                </div>
            </div>
            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Pending;
