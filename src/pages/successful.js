import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import Footers from '../components/footers';
import { serverURL } from '../constants';
import axios from 'axios';
import { Spinner } from 'flowbite-react';
import SubscriptionDetails from '../components/subscriptionDetails';

const Successful = () => {

    const [jsonData, setJsonData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [method, setMethod] = useState('');

    useEffect(() => {
        getDetails();
    }, []);

    async function getDetails() {
        const dataToSend = {
            uid: sessionStorage.getItem('uid')
        };
        try {
            const postURL = serverURL + '/api/subscriptiondetail';
            await axios.post(postURL, dataToSend).then(res => {
                setJsonData(res.data.session);
                setMethod(res.data.method);
                setIsLoading(false);
                sendUpdate();
            });
        } catch (error) {
            //DO NOTHING
        }
    }

    async function sendUpdate() {
        const currentUrl = window.location.href;
        const urlParams = new URLSearchParams(currentUrl);
        let subscriptionId = '';
        urlParams.forEach((value, key) => {
            if (key.includes('subscription_id')) {
                subscriptionId = value;
            }
        });
        const dataToSend = {
            id: subscriptionId,
            mName: sessionStorage.getItem('mName'),
            email: sessionStorage.getItem('email'),
            user: sessionStorage.getItem('uid'),
            plan: sessionStorage.getItem('type')
        };
        try {
            const postURL = serverURL + '/api/paypalupdateuser';
            await axios.post(postURL, dataToSend);
        } catch (error) {
            //ERROR
        }

    }

    return (
        <div className='h-screen flex flex-col'>
            <Header isHome={true} className="sticky top-0 z-50" />
            <div className='dark:bg-black flex-1'>
                <div className='flex-1 flex flex-col items-center justify-center py-8'>
                    <p className='text-center font-black text-4xl text-black dark:text-white'>Thank You🎉</p>
                    <p className='text-center font-normal text-black py-4 dark:text-white'><strong>{sessionStorage.getItem('mName')}</strong> you have Modifed your plan to {sessionStorage.getItem('type')}.<br></br> You will be charged ${sessionStorage.getItem('price')} From {sessionStorage.getItem('billing')}.</p>
                    {isLoading && <>
                        <div className="text-center py-10 w-screen flex items-center justify-center">
                            <Spinner size="xl" className='fill-black dark:fill-white' />
                        </div>
                    </>}
                    {!isLoading && <SubscriptionDetails jsonData={jsonData} plan={sessionStorage.getItem('type')} method={method} />}
                </div>
            </div>
            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Successful;
