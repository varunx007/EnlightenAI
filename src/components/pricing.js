import React from 'react';
import { Card } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

const PricingPlan = (props) => {

    const navigate = useNavigate();
    function redirectPayment() {
        if (sessionStorage.getItem('auth') === null || sessionStorage.getItem('type') === 'free') {
            navigate('/payment', { state: { plan: props.data.type } });
        } else {
            navigate('/subscription');
        }
    }

    return (
        <Card className='max-w-sm shadow-none border border-black rounded-none mt-3 px-14 py-5 dark:bg-black dark:border-white'>
            <h5 className="mb-4 text-3xl max-md:text-2xl font-black text-black dark:text-white text-center">{props.data.type}</h5>
            <div className="flex items-baseline text-gray-900 dark:text-white text-center justify-center">
                <span className="text-3xl max-md:text-2xl font-semibold ">£</span>
                <span className="text-5xl max-md:text-3xl font-extrabold tracking-tight">{props.data.cost}</span>
                <span className="ml-1 text-xl font-normal text-black dark:text-white">{props.data.time}</span>
            </div>
            <ul className="my-7 space-y-5">
                <li className="flex space-x-3">
                    <svg
                        className="h-5 w-5 shrink-0 text-black dark:text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-base max-md:text-xs font-normal leading-tight text-black dark:text-white">{props.data.one}</span>
                </li>
                <li className="flex space-x-3">
                    <svg
                        className="h-5 w-5 shrink-0 text-black dark:text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-base max-md:text-xs font-normal leading-tight text-black dark:text-white">
                        {props.data.four}
                    </span>
                </li>
                <li className="flex space-x-3">
                    <svg
                        className="h-5 w-5 shrink-0 text-black dark:text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-base max-md:text-xs font-normal leading-tight text-black dark:text-white">
                        {props.data.five}
                    </span>
                </li>

                {props.data.type === 'Free Plan' ?

                    <>
                        <li className="flex space-x-3 line-through decoration-gray-500">
                            <svg
                                className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-base max-md:text-xs font-normal leading-tight text-black dark:text-white">{props.data.two}</span>
                        </li>
                        <li className="flex space-x-3 line-through decoration-black">
                            <svg
                                className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-base max-md:text-xs font-normal leading-tight text-black dark:text-white">{props.data.three}</span>
                        </li>
                    </>

                    :

                    <>
                        <li className="flex space-x-3">
                            <svg
                                className="h-5 w-5 shrink-0 text-black dark:text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-base max-md:text-xs font-normal leading-tight text-black dark:text-white">
                                {props.data.two}
                            </span>
                        </li>
                        <li className="flex space-x-3">
                            <svg
                                className="h-5 w-5 shrink-0 text-black dark:text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-base max-md:text-xs font-normal leading-tight text-black dark:text-white">
                                {props.data.three}
                            </span>
                        </li>
                    </>

                }


            </ul>
            <button
                onClick={redirectPayment}
                className="inline-flex w-full justify-center dark:bg-white dark:text-black bg-black px-5 py-2.5 text-center text-sm font-bold text-white "
            >{sessionStorage.getItem('auth') === null || sessionStorage.getItem('type') === 'free' ? "Get Started" : "Modify Plan"}
            </button>
        </Card>
    );
};

export default PricingPlan;
