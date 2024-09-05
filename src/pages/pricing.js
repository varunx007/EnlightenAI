import React, { useState } from 'react';
import Header from '../components/header';
import Footers from '../components/footers';
import { FreeType, FreeCost, FreeTime, MonthType, MonthTime, MonthCost, YearType, YearCost, YearTime } from '../constants';
import PricingPlan from '../components/pricing';
import { GiCancel } from "react-icons/gi";
import { FaRankingStar } from "react-icons/fa6";
import { FaInfinity } from "react-icons/fa6";
import { Button, Card } from 'flowbite-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Pricing = () => {

    const { state } = useLocation();
    const { header } = state || false;

    const freeData = `{"type": "${FreeType}", "cost": "${FreeCost}", "time": "${FreeTime}", "one": "Generate 5 Sub-Topics", "two": "Create Unlimited Course", "three": "Video & Theory Course", "four": "Lifetime access", "five": "Theory & Image Course"}`;
    const parsedFreeData = JSON.parse(freeData);

    const monthData = `{"type": "${MonthType}", "cost": "${MonthCost}", "time": "/${MonthTime}", "one": "Generate 10 Sub-Topics", "two": "Create Unlimited Course", "three": "Video & Theory Course", "four": "1 Month Access", "five": "Theory & Image Course"}`;
    const parsedMonthData = JSON.parse(monthData);

    const YearData = `{"type": "${YearType}", "cost": "${YearCost}", "time": "/${YearTime}", "one": "Generate 10 Sub-Topics", "two": "Create Unlimited Course", "three": "Video & Theory Course", "four": "1 Year Access", "five": "Theory & Image Course"}`;
    const parsedYearData = JSON.parse(YearData);

    const navigate = useNavigate();

    function redirectCancel() {
        navigate("/cancellation");
    }

    function redirectRefund() {
        navigate("/refund");
    }

    function redirectBilling() {
        navigate("/billing");
    }

    function redirectContact() {
        navigate("/contact");
    }

    const data = [
        { question: 'What is our cancellation policy ?', answer: <p>You can read our cancellation policy from <p className='text-blue-800 underline' onClick={redirectCancel}>here</p></p> },
        { question: 'What is our refund policy ?', answer: <p>You can read our refund policy from <p className='text-blue-800 underline' onClick={redirectRefund}>here</p></p> },
        { question: 'What is our subscription and billing policy ?', answer: <p>You can read our subscription and billing policy from <p className='text-blue-800 underline' onClick={redirectBilling}>here</p></p> },
        { question: 'What are the available payment gateways ?', answer: 'Our platform supports multiple payment gateways, including PayPal, and Razorpay.' },
    ];

    const [expandedItem, setExpandedItem] = useState(null);

    const handleExpand = (index) => {
        setExpandedItem(expandedItem === index ? null : index);
    };

    const style = {
        "root": {
            "base": "max-w-sm max-md:max-w-xs flex rounded-none border border-black bg-white shadow-none dark:border-white dark:bg-black m-4",
            "children": "flex h-full flex-col justify-center gap-3 p-5",
            "horizontal": {
                "off": "flex-col",
                "on": "flex-col md:max-w-xl md:flex-row"
            },
            "href": "hover:bg-white dark:hover:bg-black"
        },
        "img": {
            "base": "",
            "horizontal": {
                "off": "rounded-none",
                "on": "h-96 w-full rounded-none object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
            }

        }
    }

    return (
        <div className='h-screen flex flex-col'>
            <Header isHome={header} className="sticky top-0 z-50" />
            <div className='dark:bg-black flex-1'>
                <div className='flex-1 flex flex-col items-center justify-center'>
                    <h1 className="text-6xl font-black mt-14 max-md:text-3xl dark:text-white">Pricing Plan</h1>
                    <p className="text-center text-black mt-6 max-w-2xl font-medium max-md:text-xs dark:text-white">
                        Choose the Perfect Plan for Your Success
                    </p>
                    <div className="lg:flex py-14">

                        <div className="flex flex-col items-center justify-center lg:w-1/3 px-3  max-md:pt-4">
                            <PricingPlan data={parsedFreeData} />
                        </div>

                        <div className="flex flex-col items-center justify-center lg:w-1/3 px-3  max-md:pt-4">
                            <PricingPlan data={parsedMonthData} />
                        </div>

                        <div className="flex flex-col items-center justify-center lg:w-1/3 px-3 max-md:pt-4">
                            <PricingPlan data={parsedYearData} />
                        </div>
                    </div>
                    <div className="dark:bg-black pt-16">
                        <div className="flex items-center justify-center text-center">
                            <div className="text-4xl font-black dark:text-white max-md:text-2xl">Pricing Benefits</div>
                        </div>
                        <div className="lg:flex pt-10 max-md:py-14">

                            <Card key={1} theme={style}>
                                <FaInfinity className="text-4xl max-md:text-3xl dark:text-white" />
                                <h5 className='text-xl font-black tracking-tight text-black dark:text-white'>
                                    Flexible Pricing
                                </h5>
                                <p className='font-normal text-sm text-black dark:text-white'>Tailor costs to usage needs for optimal budgeting flexibility</p>
                            </Card>

                            <Card key={2} theme={style}>
                                <FaRankingStar className="text-4xl max-md:text-3xl dark:text-white" />
                                <h5 className='text-xl font-black tracking-tight text-black dark:text-white'>
                                    Upgrade Anytime
                                </h5>
                                <p className='font-normal text-sm text-black dark:text-white'>Seamlessly scale plans to match evolving requirements at any moment</p>
                            </Card>

                            <Card key={3} theme={style}>
                                <GiCancel className="text-4xl max-md:text-3xl  dark:text-white" />
                                <h5 className='text-xl font-black tracking-tight text-black dark:text-white'>
                                    Cancel Subscription Anytime
                                </h5>
                                <p className='font-normal text-sm text-black dark:text-white'>Terminate subscription anytime, providing ultimate flexibility and user control</p>
                            </Card>
                        </div>
                    </div>
                    <div className="flex items-center justify-center text-center flex-col px-6 max-md:px-2 pt-16">
                        <h1 className="text-4xl font-black dark:text-white max-md:text-2xl mb-10">Frequently asked questions</h1>
                        <ul>
                            {data.map((item, index) => (
                                <li key={index} className="mb-4">
                                    <Button
                                        className='w-96 max-sm:max-w-xs mb-6 items-start justify-start text-start border-black dark:border-white dark:bg-black dark:text-white bg-white text-black font-bold rounded-none  enabled:hover:bg-white enabled:focus:bg-white enabled:focus:ring-transparent dark:enabled:hover:bg-black dark:enabled:focus:bg-black dark:enabled:focus:ring-transparent'
                                        onClick={() => handleExpand(index)}
                                    >
                                        {data[index].question}
                                    </Button>
                                    {expandedItem === index && (
                                        <div className='max-w-sm max-sm:max-w-xs mb-6 items-start justify-start text-start border-black dark:border-white dark:bg-black dark:text-white bg-white text-black font-normal rounded-none enabled:hover:bg-white enabled:focus:bg-white enabled:focus:ring-transparent dark:enabled:hover:bg-black dark:enabled:focus:bg-black dark:enabled:focus:ring-transparent'>
                                            {item.answer}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex items-center justify-center text-center py-16 flex-col">
                        <div className="text-4xl font-black dark:text-white max-md:text-2xl">Still have questions?</div>
                        <Button className='max-w-xs my-10 items-center justify-center text-center border-black dark:border-white dark:bg-black dark:text-white bg-white text-black font-bold rounded-none w-full enabled:hover:bg-white enabled:focus:bg-white enabled:focus:ring-transparent dark:enabled:hover:bg-black dark:enabled:focus:bg-black dark:enabled:focus:ring-transparent' onClick={redirectContact}>Contact</Button>
                    </div>
                </div>
            </div>
            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Pricing;
