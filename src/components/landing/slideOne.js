import React from 'react';
import slide from '../../res/img/slideOne.png'
import { useNavigate } from "react-router-dom";

const SlideOne = () => {

    const navigate = useNavigate();

    function redirectSignIn() {
        navigate("/signin");
    }
    function redirectSignUp() {
        navigate("/signup");
    }


    return (
        <div className="flex flex-col items-center dark:bg-black">

            <h1 className="text-6xl font-black mt-20 max-md:text-3xl dark:text-white">Ai Course Generator</h1>

            <p className="text-center text-black mt-6 max-w-2xl font-medium max-md:text-xs dark:text-white">
                Revolutionize your learning journey with our AI Course Generator SaaS
                Effortlessly create engaging and personalized courses tailored to your needs
            </p>

            <div className="flex space-x-4 mb-4 mt-6">
                <button onClick={redirectSignIn} className="border-black text-black border px-3 py-2 font-medium dark:border-white dark:text-white">
                    SignIn
                </button>
                <button onClick={redirectSignUp} className="bg-black text-white px-3 py-2 font-medium dark:bg-white dark:text-black">
                    SignUp
                </button>
            </div>

            <img
                src={slide}
                alt="Your Alt Text"
                className="w-full max-w-screen-xl mx-auto my-10 md:my-10"
            />
        </div>
    );
};

export default SlideOne;
