import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/header';
import Footers from '../components/footers';
import { Button, Label, Select } from 'flowbite-react';
import axios from 'axios';
import { amountInZarOne, amountInZarTwo, name, paypalEnabled, paypalPlanIdOne, paypalPlanIdTwo, paystackEnabled, paystackPlanIdOne, paystackPlanIdTwo, razorpayEnabled, razorpayPlanIdOne, razorpayPlanIdTwo, serverURL, stripeEnabled, stripePlanIdOne, stripePlanIdTwo } from '../constants';
import { useLocation, useNavigate } from 'react-router-dom';
import countryList from 'react-select-country-list'
import { toast } from 'react-toastify';

const Payment = () => {

    const [email, setEmail] = useState(sessionStorage.getItem('email'));
    const [address, setAdress] = useState('');
    const [mName, setName] = useState(sessionStorage.getItem('mName'));
    const [lastName, setLastName] = useState('');
    const [post, setPost] = useState('');
    const [country, setCountry] = useState('');
    const [admin, setAdmin] = useState('');
    const options = useMemo(() => countryList().getData(), [])
    const { state } = useLocation();
    const { plan } = state || {};
    const navigate = useNavigate();

    useEffect(() => {

        if (!plan) {
            navigate("/pricing");
        }

    }, []);

    async function startPaystack() {
        if (!email || !mName || !lastName || !post || !address || !country || !admin) {
            showToast('Please fill in all required fields');
            return;
        }
        let planId = paystackPlanIdTwo;
        let amountInZar = amountInZarTwo;
        if (plan === 'Monthly Plan') {
            planId = paystackPlanIdOne;
            amountInZar = amountInZarOne;
        }
        const dataToSend = {
            planId: planId,
            amountInZar,
            email: email
        };
        try {
            const postURL = serverURL + '/api/paystackpayment';
            const res = await axios.post(postURL, dataToSend);
            sessionStorage.setItem('paystack', res.data.id);
            sessionStorage.setItem('method', 'paystack');
            sessionStorage.setItem('plan', plan);

            window.location.href = res.data.url;

        } catch (error) {
            //DO NOTHING
        }
    }

    async function startStripe() {
        if (!email || !mName || !lastName || !post || !address || !country || !admin) {
            showToast('Please fill in all required fields');
            return;
        }
        let planId = stripePlanIdTwo;
        if (plan === 'Monthly Plan') {
            planId = stripePlanIdOne;
        }
        const dataToSend = {
            planId: planId
        };
        try {
            const postURL = serverURL + '/api/stripepayment';
            const res = await axios.post(postURL, dataToSend);
            sessionStorage.setItem('stripe', res.data.id);
            sessionStorage.setItem('method', 'stripe');
            sessionStorage.setItem('plan', plan);
            window.location.href = res.data.url;

        } catch (error) {
            //DO NOTHING
        }
    }

    async function startRazorpay() {

        if (!email || !mName || !lastName || !post || !address || !country || !admin) {
            showToast('Please fill in all required fields');
            return;
        }

        let fullAddress = address + ' ' + admin + ' ' + post + ' ' + country;
        let planId = razorpayPlanIdTwo;
        if (plan === 'Monthly Plan') {
            planId = razorpayPlanIdOne;
        }
        const dataToSend = {
            plan: planId,
            email: email,
            fullAddress: fullAddress
        };
        try {
            const postURL = serverURL + '/api/razorpaycreate';
            const res = await axios.post(postURL, dataToSend);
            sessionStorage.setItem('method', 'razorpay');
            sessionStorage.setItem('plan', plan);
            window.open(res.data.short_url, '_blank');
            navigate('/pending', { state: { sub: res.data.id, link: res.data.short_url } });
        } catch (error) {
            //DO NOTHING
        }
    }

    async function startPayPal() {

        if (!email || !mName || !lastName || !post || !address || !country || !admin) {
            showToast('Please fill in all required fields');
            return;
        }

        let planId = paypalPlanIdTwo;
        if (plan === 'Monthly Plan') {
            planId = paypalPlanIdOne;
        }

        const dataToSend = {
            planId: planId,
            email: email,
            name: mName,
            lastName: lastName,
            post: post,
            address: address,
            country: country,
            brand: name,
            admin: admin
        };
        try {
            const postURL = serverURL + '/api/paypal';
            const res = await axios.post(postURL, dataToSend);

            sessionStorage.setItem('method', 'paypal');
            sessionStorage.setItem('plan', plan);

            const links = res.data.links;
            const approveLink = links.find(link => link.rel === "approve");
            const approveHref = approveLink ? approveLink.href : null;
            window.location.href = approveHref;

        } catch (error) {
            startPayPal()
        }
    }


    const showToast = async (msg) => {
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

    return (
        <div className='h-screen flex flex-col'>
            <Header isHome={true} className='sticky top-0 z-50' />
            <div className='dark:bg-black flex-1'>
                <div className='flex-1 flex items-center justify-center py-10'>
                    <form className="max-w-sm m-auto py-4 no-scrollbar">
                        <p className='text-center font-black text-4xl text-black dark:text-white'>Payment</p>
                        <p className='text-center font-normal text-black py-4 dark:text-white'>Enter your details and select payment gateway to continue</p>
                        <div className='py-6'>
                            <div className='mb-6'>
                                <div className="mb-2 block">
                                    <Label className="font-bold text-black dark:text-white" htmlFor="email1" value="Email" />
                                </div>
                                <input value={email} onChange={(e) => setEmail(e.target.value)} className='focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white' id="email1" type="email" />
                            </div>
                            <div className='mb-6'>
                                <div className="mb-2 block">
                                    <Label className="font-bold text-black dark:text-white" htmlFor="name1" value="First Name" />
                                </div>
                                <input value={mName} onChange={(e) => setName(e.target.value)} className='focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white' id="name1" type="text" />
                            </div>
                            <div className='mb-6'>
                                <div className="mb-2 block">
                                    <Label className="font-bold text-black dark:text-white" htmlFor="name2" value="Last Name" />
                                </div>
                                <input onChange={(e) => setLastName(e.target.value)} className='focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white' id="name2" type="text" />
                            </div>
                            <div className='mb-6'>
                                <div className="mb-2 block">
                                    <Label className="font-bold text-black dark:text-white" htmlFor="address1" value="Address" />
                                </div>
                                <input onChange={(e) => setAdress(e.target.value)} className='focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white' id="address1" type="text" />
                            </div>
                            <div className='mb-6'>
                                <div className="mb-2 block">
                                    <Label className="font-bold text-black dark:text-white" htmlFor="post1" value="Postal Code" />
                                </div>
                                <input onChange={(e) => setPost(e.target.value)} className='focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white' id="post1" type="number" />
                            </div>
                            <div className='mb-6'>
                                <div className="mb-2 block">
                                    <Label className="font-bold text-black dark:text-white" htmlFor="code1" value="Country Code" />
                                </div>
                                <Select
                                    class='rounded-none border-black focus:ring-black focus:border-black border  font-normal bg-white  block w-full dark:bg-black dark:border-white dark:text-white'
                                    value={country} onChange={(e) => {
                                        const selectedValue = e.target.value;
                                        const selectedOption = options.find(
                                            (country) => country.value === selectedValue
                                        );
                                        setCountry(selectedOption.value);
                                        setAdmin(selectedOption.label)
                                    }}>
                                    {options.map((country) => (
                                        <option key={country.value} value={country.value}>
                                            {country.label}
                                        </option>
                                    ))}
                                </Select>
                            </div>
                            {stripeEnabled ? <Button className='my-2 items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none w-full enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent' onClick={startStripe}>Stripe</Button>
                                : <></>}
                            {paypalEnabled ? <Button className='my-2 items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none w-full enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent' onClick={startPayPal}>PayPal</Button>
                                : <></>}
                            {razorpayEnabled ? <Button className='my-2 items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none w-full enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent' onClick={startRazorpay}>Razorpay</Button>
                                : <></>}
                            {paystackEnabled ? <Button className='my-2 items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none w-full enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent' onClick={startPaystack}>Paystack</Button>
                                : <></>}
                        </div>
                    </form>
                </div>
            </div>
            <Footers className='sticky bottom-0 z-50' />
        </div>
    );
};

export default Payment;
