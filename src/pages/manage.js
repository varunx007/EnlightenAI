import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import Footers from '../components/footers';
import { Button, Spinner } from 'flowbite-react';
import { MonthCost, MonthType, YearCost, YearType, paypalPlanIdOne, paypalPlanIdTwo, serverURL } from '../constants';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SubscriptionDetails from '../components/subscriptionDetails';
import { AiOutlineLoading } from 'react-icons/ai';
import { toast } from 'react-toastify';
import SubscriptionDetailsRazorpay from '../components/subscriptionDetailsRazorpay';
import SubscriptionDetailsStripe from '../components/subscriptionDetailsStripe';
import SubscriptionDetailsPayStack from '../components/subscriptionDetailsPayStack';

const Manage = () => {

    const [jsonData, setJsonData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [method, setMethod] = useState('');
    const [processing, setProcessing] = useState(false);
    const [processing2, setProcessing2] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (sessionStorage.getItem('type') === 'free') {
            navigate("/pricing");
        } else {
            getDetails();
        }
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
                sessionStorage.setItem('method', res.data.method);
                setIsLoading(false);
            });
        } catch (error) {
            //DO NOTHING
        }
    }

    const showToast = async (msg) => {
        setProcessing(false);
        setProcessing2(false);
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

    async function modifySubscription() {
        if (method === 'paypal') {
            let planName = sessionStorage.getItem('type');
            let planId;
            let planPrice;
            if (planName === YearType) {
                planPrice = MonthCost;
                planId = paypalPlanIdOne;
                planName = MonthType;
                sessionStorage.setItem('type', planName);
                sessionStorage.setItem('price', planPrice);
            } else {
                planId = paypalPlanIdTwo;
                planName = YearType;
                planPrice = YearCost;
                sessionStorage.setItem('type', planName);
                sessionStorage.setItem('price', planPrice);
            }
            const dataToSend = {
                id: sessionStorage.getItem('subscriberId'),
                idPlan: planId,
            };
            try {
                setProcessing2(true);
                const postURL = serverURL + '/api/paypalupdate';
                const res = await axios.post(postURL, dataToSend);
                const links = res.data.links;
                const approveLink = links.find(link => link.rel === "approve");
                const approveHref = approveLink ? approveLink.href : null;
                window.location.href = approveHref;
            } catch (error) {
                modifySubscription();
            }
        } else {
            showToast("You cannot modify the plan because you have not subscribed via paypal");
        }
    }

    async function cancelSubscription() {
        const dataToSend = {
            id: jsonData.id
        };
        try {
            setProcessing(true);
            if (method === 'stripe') {
                const postURL = serverURL + '/api/stripecancel';
                await axios.post(postURL, dataToSend).then(res => {
                    showToast("Subscription Cancelled");
                    sessionStorage.setItem('type', 'free');
                    navigate("/pricing");
                });
            } else if (method === 'paypal') {
                const postURL = serverURL + '/api/paypalcancel';
                await axios.post(postURL, dataToSend).then(res => {
                    showToast("Subscription Cancelled");
                    sessionStorage.setItem('type', 'free');
                    navigate("/pricing");
                });
            } else if (method === 'paystack') {
                const dataToSends = {
                    code: jsonData.subscription_code,
                    token: jsonData.email_token,
                    email: sessionStorage.getItem('email')
                };
                const postURL = serverURL + '/api/paystackcancel';
                await axios.post(postURL, dataToSends).then(res => {
                    showToast("Subscription Cancelled");
                    sessionStorage.setItem('type', 'free');
                    navigate("/pricing");
                });
            } else {
                const postURL = serverURL + '/api/razorpaycancel';
                await axios.post(postURL, dataToSend).then(res => {
                    showToast("Subscription Cancelled");
                    sessionStorage.setItem('type', 'free');
                    navigate("/pricing");
                });
            }
        } catch (error) {
            cancelSubscription();
        }
    }

    return (
        <div className='h-screen flex flex-col'>
            <Header isHome={true} className="sticky top-0 z-50" />
            <div className='dark:bg-black flex-1'>
                <div className='flex-1 flex flex-col items-center justify-center py-8'>
                    <p className='text-center font-black text-4xl text-black dark:text-white'>Subscription</p>
                    {isLoading && <>
                        <div className="text-center py-10 w-screen flex items-center justify-center">
                            <Spinner size="xl" className='fill-black dark:fill-white' />
                        </div>
                    </>}
                    {method === 'stripe' ?
                        <>{!isLoading && <SubscriptionDetailsStripe jsonData={jsonData} plan={sessionStorage.getItem('type')} method={method} />}</>
                        :
                        <>{method === 'paystack' ?
                            <>{!isLoading && <SubscriptionDetailsPayStack jsonData={jsonData} plan={sessionStorage.getItem('type')} method={method} />}</>
                            :
                            <>{method === 'paypal' ? <>{!isLoading && <SubscriptionDetails jsonData={jsonData} plan={sessionStorage.getItem('type')} method={method} />}</> : <>{!isLoading && <SubscriptionDetailsRazorpay jsonData={jsonData} plan={sessionStorage.getItem('type')} method={method} />}</>}</>
                        }
                        </>
                    }
                    <div className='max-w-md'>
                        <Button isProcessing={processing} processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />} className='my-2 items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none w-full enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent' onClick={cancelSubscription}>Cancel Subscription</Button>
                    </div>
                    <div className='max-w-md'>
                        <Button isProcessing={processing2} processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />} className='my-2 items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none w-full enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent' onClick={modifySubscription}>Modify Subscription</Button>
                    </div>
                </div>
            </div>
            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Manage;
