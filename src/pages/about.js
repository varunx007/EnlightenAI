import React from 'react';
import Header from '../components/header';
import Footers from '../components/footers';
import slide from '../res/img/about.svg'
import { useNavigate } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { company, name } from '../constants';

const About = () => {

    const navigate = useNavigate();

    function redirectContact() {
        navigate("/contact");
    }

    return (
        <div className='h-screen flex flex-col'>
            <Header isHome={false} className="sticky top-0 z-50" />
            <div className='dark:bg-black flex-1'>
                <div className='flex-1 flex flex-col items-center justify-center px-3'>
                    <h1 className="text-6xl font-black mt-14 max-md:text-3xl dark:text-white">About</h1>
                    <p className="text-center text-black mt-6 max-w-2xl font-medium max-md:text-xs dark:text-white">
                        Welcome to {name}, the cutting-edge AI Course generator brought to you by {company}!
                    </p>
                </div>
                <div className="px-7 max-md:px-3 justify-center items-center pb-10 dark:bg-black mt-14 ">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2 h-full p-4 flex flex-col items-center md:items-start justify-center">
                            <h2 className="text-4xl font-black mb-2 max-md:text-2xl dark:text-white" >About Us</h2>
                            <p className="text-black mb-2 mt-2 max-md:text-center max-md:text-xs dark:text-white">
                                At {company}, we believe in the transformative power of education and the endless possibilities that Artificial Intelligence unlocks.
                                That's why we've developed {name}, a revolutionary SaaS product designed to make course creation seamless, efficient, and intelligent.
                            </p>
                        </div>
                        <div className="md:w-1/2 h-full">
                            <img
                                src={slide}
                                alt="Your Alt Text"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
                <div className='flex-1 flex flex-col items-center justify-center px-20 max-md:px-3'>
                    <h1 className="text-center text-4xl font-black mt-14 max-md:text-2xl dark:text-white">Our Mission</h1>
                    <p className="text-black mb-2 mt-8 text-center max-md:text-xs dark:text-white">
                        Empowering educators, professionals, and organizations to create exceptional learning experiences effortlessly is at the heart of what we do. {name} embodies our commitment to leveraging AI technology to simplify the course development process and unlock new realms of educational excellence.
                        Founded with a passion for innovation, {company} has been on a journey to redefine the intersection of education and technology. Our team of experts, driven by a shared vision, has dedicated years to create {name} as a testament to our commitment to advancing the field of online learning.
                        At {company}, quality is non-negotiable. {name} is the result of meticulous development, incorporating the latest advancements in AI technology to provide you with a tool that exceeds expectations.
                    </p>
                </div>
                <div className='flex-1 flex flex-col items-center justify-center px-20 max-md:px-3'>
                    <h1 className="text-center text-4xl font-black mt-20 max-md:text-2xl dark:text-white">Join Us on the Learning Journey</h1>
                    <p className="text-black mb-2 mt-8 text-center max-md:text-xs dark:text-white">
                        Embark on a journey of innovation and educational excellence with {name}. Whether you're an educator, a professional, or an organization looking to elevate your learning programs, {company} is here to support you every step of the way.
                    </p>
                    <Button onClick={redirectContact} className='max-w-xs my-10 items-center justify-center text-center border-black dark:border-white dark:bg-black dark:text-white bg-white text-black font-bold rounded-none w-full enabled:hover:bg-white enabled:focus:bg-white enabled:focus:ring-transparent dark:enabled:hover:bg-black dark:enabled:focus:bg-black dark:enabled:focus:ring-transparent'>Contact</Button>
                </div>
            </div>
            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default About;
