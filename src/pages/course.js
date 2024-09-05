import { Drawer, Navbar, Sidebar } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import LogoComponent from '../components/LogoComponent';
import { FiMenu, FiX } from 'react-icons/fi';
import DarkModeToggle from '../components/DarkModeToggle';
import TruncatedText from '../components/TruncatedText';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import StyledText from '../components/styledText';
import YouTube from 'react-youtube';
import { toast } from 'react-toastify';
import { logo, name, serverURL } from '../constants';
import axios from 'axios';
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Course = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [key, setkey] = useState('');
    const { state } = useLocation();
    const { mainTopic, type, courseId, end } = state || {};
    const jsonData = JSON.parse(sessionStorage.getItem('jsonData'));
    const storedTheme = sessionStorage.getItem('darkMode');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selected, setSelected] = useState('');
    const [theory, setTheory] = useState('');
    const [media, setMedia] = useState('');
    const [percentage, setPercentage] = useState(0);
    const [isComplete, setIsCompleted] = useState(false);
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const handleOnClose = () => setIsOpenDrawer(false);

    const CountDoneTopics = () => {
        let doneCount = 0;
        let totalTopics = 0;

        jsonData[mainTopic.toLowerCase()].forEach((topic) => {

            topic.subtopics.forEach((subtopic) => {

                if (subtopic.done) {
                    doneCount++;
                }
                totalTopics++;
            });
        });
        const completionPercentage = Math.round((doneCount / totalTopics) * 100);
        setPercentage(completionPercentage);
        if (completionPercentage >= '100') {
            setIsCompleted(true);
        }
    }

    const opts = {
        height: '390',
        width: '640',
    };

    const optsMobile = {
        height: '250px',
        width: '100%',
    };

    async function finish() {
        if (sessionStorage.getItem('first') === 'true') {
            if (!end) {
                const today = new Date();
                const formattedDate = today.toLocaleDateString('en-GB');
                navigate('/certificate', { state: { courseTitle: mainTopic, end: formattedDate } });
            } else {
                navigate('/certificate', { state: { courseTitle: mainTopic, end: end } });
            }

        } else {
            const dataToSend = {
                courseId: courseId
            };
            try {
                const postURL = serverURL + '/api/finish';
                const response = await axios.post(postURL, dataToSend);
                if (response.data.success) {
                    const today = new Date();
                    const formattedDate = today.toLocaleDateString('en-GB');
                    sessionStorage.setItem('first', 'true');
                    sendEmail(formattedDate);
                } else {
                    finish()
                }
            } catch (error) {
                finish()
            }
        }
    }

    async function sendEmail(formattedDate) {
        const userName = sessionStorage.getItem('mName');
        const email = sessionStorage.getItem('email');
        const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="initial-scale=1.0">
            <title>Certificate of Completion</title>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap">
            <style>
            body {
                font-family: 'Roboto', sans-serif;
                text-align: center;
                background-color: #fff;
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
        
            .certificate {
                border: 10px solid #000;
                max-width: 600px;
                margin: 20px auto;
                padding: 50px;
                background-color: #fff;
                position: relative;
                color: #000;
                text-align: center;
            }
        
            h1 {
                font-weight: 900;
                font-size: 24px;
                margin-bottom: 10px;
            }
        
            h4 {
                font-weight: 900;
                text-align: center;
                font-size: 20px;
            }
        
            h2 {
                font-weight: 700;
                font-size: 18px;
                margin-top: 10px;
                margin-bottom: 5px;
                text-decoration: underline;
            }
        
            h3 {
                font-weight: 700;
                text-decoration: underline;
                font-size: 16px;
                margin-top: 5px;
                margin-bottom: 10px;
            }
        
            p {
                font-weight: 400;
                line-height: 1.5;
            }
        
            img {
                width: 40px;
                height: 40px;
                margin-right: 10px;
                text-align: center;
                align-self: center;
            }
            </style>
        </head>
        <body>
        
        <div class="certificate">
        <h1>Certificate of Completion 🥇</h1>
        <p>This is to certify that</p>
        <h2>${userName}</h2>
        <p>has successfully completed the course on</p>
        <h3>${mainTopic}</h3>
        <p>on ${formattedDate}.</p>
    
        <div class="signature">
            <img src=${logo}>
            <h4>${name}</h4>
        </div>
    </div>
        
        </body>
        </html>`;

        try {
            const postURL = serverURL + '/api/sendcertificate';
            await axios.post(postURL, { html, email }).then(res => {
                navigate('/certificate', { state: { courseTitle: mainTopic, end: formattedDate } });
            }).catch(error => {
                navigate('/certificate', { state: { courseTitle: mainTopic, end: formattedDate } });
            });

        } catch (error) {
            navigate('/certificate', { state: { courseTitle: mainTopic, end: formattedDate } });
        }

    }

    useEffect(() => {
        loadMessages()
        const CountDoneTopics = () => {
            let doneCount = 0;
            let totalTopics = 0;

            jsonData[mainTopic.toLowerCase()].forEach((topic) => {

                topic.subtopics.forEach((subtopic) => {

                    if (subtopic.done) {
                        doneCount++;
                    }
                    totalTopics++;
                });
            });
            const completionPercentage = Math.round((doneCount / totalTopics) * 100);
            setPercentage(completionPercentage);
            if (completionPercentage >= '100') {
                setIsCompleted(true);
            }
        }

        if (!mainTopic) {
            navigate("/create");
        } else {
            if (percentage >= '100') {
                setIsCompleted(true);
            }

            const mainTopicData = jsonData[mainTopic.toLowerCase()][0];
            const firstSubtopic = mainTopicData.subtopics[0];
            firstSubtopic.done = true
            setSelected(firstSubtopic.title)
            setTheory(firstSubtopic.theory)

            if (type === 'video & text course') {
                setMedia(firstSubtopic.youtube);
            } else {
                setMedia(firstSubtopic.image)

            }
            sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
            CountDoneTopics();

        }

    }, []);

    const handleSelect = (topics, sub) => {

        const mTopic = jsonData[mainTopic.toLowerCase()].find(topic => topic.title === topics);
        const mSubTopic = mTopic?.subtopics.find(subtopic => subtopic.title === sub);

        if (mSubTopic.theory === '' || mSubTopic.theory === undefined || mSubTopic.theory === null) {
            if (type === 'video & text course') {

                const query = `${mSubTopic.title} ${mainTopic} in english`;
                const id = toast.loading("Please wait...")
                sendVideo(query, topics, sub, id, mSubTopic.title);

            } else {

                const prompt = `Explain me about this subtopic of ${mainTopic} with examples :- ${mSubTopic.title}. Please Strictly Don't Give Additional Resources And Images.`;
                const promptImage = `Example of ${mSubTopic.title} in ${mainTopic}`;
                const id = toast.loading("Please wait...")
                sendPrompt(prompt, promptImage, topics, sub, id);

            }
        } else {
            setSelected(mSubTopic.title)

            setTheory(mSubTopic.theory)
            if (type === 'video & text course') {
                setMedia(mSubTopic.youtube);
            } else {
                setMedia(mSubTopic.image)
            }
        }

    };

    async function sendPrompt(prompt, promptImage, topics, sub, id) {
        const dataToSend = {
            prompt: prompt,
        };
        try {
            const postURL = serverURL + '/api/generate';
            const res = await axios.post(postURL, dataToSend);
            const generatedText = res.data.text;
            const htmlContent = generatedText;
            try {
                const parsedJson = htmlContent;
                sendImage(parsedJson, promptImage, topics, sub, id);
            } catch (error) {
                sendPrompt(prompt, promptImage, topics, sub, id)
            }

        } catch (error) {
            sendPrompt(prompt, promptImage, topics, sub, id)
        }
    }

    async function sendImage(parsedJson, promptImage, topics, sub, id) {
        const dataToSend = {
            prompt: promptImage,
        };
        try {
            const postURL = serverURL + '/api/image';
            const res = await axios.post(postURL, dataToSend);
            try {
                const generatedText = res.data.url;
                sendData(generatedText, parsedJson, topics, sub, id);
            } catch (error) {
                sendImage(parsedJson, promptImage, topics, sub, id)
            }

        } catch (error) {
            sendImage(parsedJson, promptImage, topics, sub, id)
        }
    }

    async function sendData(image, theory, topics, sub, id) {

        const mTopic = jsonData[mainTopic.toLowerCase()].find(topic => topic.title === topics);
        const mSubTopic = mTopic?.subtopics.find(subtopic => subtopic.title === sub);
        mSubTopic.theory = theory
        mSubTopic.image = image;
        setSelected(mSubTopic.title)

        toast.update(id, { render: "Done!", type: "success", isLoading: false, autoClose: 3000, hideProgressBar: false, closeOnClick: true });
        setTheory(theory)
        if (type === 'video & text course') {
            setMedia(mSubTopic.youtube);
        } else {
            setMedia(image)
        }
        mSubTopic.done = true;
        updateCourse();
    }

    async function sendDataVideo(image, theory, topics, sub, id) {

        const mTopic = jsonData[mainTopic.toLowerCase()].find(topic => topic.title === topics);
        const mSubTopic = mTopic?.subtopics.find(subtopic => subtopic.title === sub);
        mSubTopic.theory = theory
        mSubTopic.youtube = image;
        setSelected(mSubTopic.title)

        toast.update(id, { render: "Done!", type: "success", isLoading: false, autoClose: 3000, hideProgressBar: false, closeOnClick: true });
        setTheory(theory)
        if (type === 'video & text course') {
            setMedia(image);
        } else {
            setMedia(mSubTopic.image)
        }
        mSubTopic.done = true;
        updateCourse();

    }

    async function updateCourse() {
        CountDoneTopics();
        sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
        const dataToSend = {
            content: JSON.stringify(jsonData),
            courseId: courseId
        };
        try {
            const postURL = serverURL + '/api/update';
            await axios.post(postURL, dataToSend);
        } catch (error) {
            updateCourse()
        }
    }

    async function sendVideo(query, mTopic, mSubTopic, id, subtop) {
        const dataToSend = {
            prompt: query,
        };
        try {
            const postURL = serverURL + '/api/yt';
            const res = await axios.post(postURL, dataToSend);

            try {
                const generatedText = res.data.url;
                sendTranscript(generatedText, mTopic, mSubTopic, id, subtop);
            } catch (error) {
                sendVideo(query, mTopic, mSubTopic, id, subtop)
            }

        } catch (error) {
            sendVideo(query, mTopic, mSubTopic, id, subtop)
        }
    }

    async function sendTranscript(url, mTopic, mSubTopic, id, subtop) {
        const dataToSend = {
            prompt: url,
        };
        try {
            const postURL = serverURL + '/api/transcript';
            const res = await axios.post(postURL, dataToSend);

            try {
                const generatedText = res.data.url;
                const allText = generatedText.map(item => item.text);
                const concatenatedText = allText.join(' ');
                const prompt = `Summarize this theory in a teaching way :- ${concatenatedText}.`;
                sendSummery(prompt, url, mTopic, mSubTopic, id);
            } catch (error) {
                const prompt = `Explain me about this subtopic of ${mainTopic} with examples :- ${subtop}. Please Strictly Don't Give Additional Resources And Images.`;
                sendSummery(prompt, url, mTopic, mSubTopic, id);
            }

        } catch (error) {
            const prompt = `Explain me about this subtopic of ${mainTopic} with examples :- ${subtop}.  Please Strictly Don't Give Additional Resources And Images.`;
            sendSummery(prompt, url, mTopic, mSubTopic, id);
        }
    }

    async function sendSummery(prompt, url, mTopic, mSubTopic, id) {
        const dataToSend = {
            prompt: prompt,
        };
        try {
            const postURL = serverURL + '/api/generate';
            const res = await axios.post(postURL, dataToSend);
            const generatedText = res.data.text;
            const htmlContent = generatedText;
            try {
                const parsedJson = htmlContent;
                sendDataVideo(url, parsedJson, mTopic, mSubTopic, id);
            } catch (error) {
                sendSummery(prompt, url, mTopic, mSubTopic, id)
            }

        } catch (error) {
            sendSummery(prompt, url, mTopic, mSubTopic, id)
        }
    }

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleOpenClose = (keys) => {
        setIsOpen(!isOpen)
        setkey(keys);
    };

    const defaultMessage = `<p>Hey there! I'm your AI teacher. If you have any questions about your ${mainTopic} course, whether it's about videos, images, or theory, just ask me. I'm here to clear your doubts.</p>`;
    const defaultPrompt = `I have a doubt about this topic :- ${mainTopic}. Please clarify my doubt in very short :- `;

    const loadMessages = async () => {
        try {
            const jsonValue = sessionStorage.getItem(mainTopic);
            if (jsonValue !== null) {
                setMessages(JSON.parse(jsonValue));
            } else {
                const newMessages = [...messages, { text: defaultMessage, sender: 'bot' }];
                setMessages(newMessages);
                await storeLocal(newMessages);
            }
        } catch (error) {
            loadMessages();
        }
    };

    const sendMessage = async () => {
        if (newMessage.trim() === '') return;

        const userMessage = { text: newMessage, sender: 'user' };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        await storeLocal(updatedMessages);
        setNewMessage('');

        let mainPrompt = defaultPrompt + newMessage;
        const dataToSend = { prompt: mainPrompt };
        const url = serverURL + '/api/chat';

        try {
            const response = await axios.post(url, dataToSend);

            if (response.data.success === false) {
                sendMessage();
            } else {
                const botMessage = { text: response.data.text, sender: 'bot' };
                const updatedMessagesWithBot = [...updatedMessages, botMessage];
                setMessages(updatedMessagesWithBot);
                await storeLocal(updatedMessagesWithBot);
            }
        } catch (error) {

        }
    };

    async function storeLocal(messages) {
        try {
            sessionStorage.setItem(mainTopic, JSON.stringify(messages));
        } catch (error) {
            sessionStorage.setItem(mainTopic, JSON.stringify(messages));
        }
    }


    const style = {
        "root": {
            "base": "h-full",
            "collapsed": {
                "on": "w-16",
                "off": "w-64"
            },
            "inner": "no-scrollbar h-full overflow-y-auto overflow-x-hidden rounded-none border-black dark:border-white md:border-r  bg-white py-4 px-3 dark:bg-black"
        }
    }

    const renderTopicsAndSubtopics = (topics) => {
        try {
            return (
                <div>
                    {topics.map((topic) => (
                        <Sidebar.ItemGroup key={topic.title}>
                            <div className="relative inline-block text-left " >
                                <button
                                    onClick={() => handleOpenClose(topic.title)}
                                    type="button"
                                    className="inline-flex text-start text-base w-64 font-bold  text-black dark:text-white"
                                >
                                    {topic.title}
                                    <IoIosArrowDown className="-mr-1 ml-2 h-3 w-3 mt-2" />
                                </button>

                                {isOpen && key === topic.title && (
                                    <div className="origin-top-right mt-2 pr-4">
                                        <div
                                            className="py-1"
                                            role="menu"
                                            aria-orientation="vertical"
                                            aria-labelledby="options-menu"
                                        >
                                            {topic.subtopics.map((subtopic) => (
                                                <p
                                                    key={subtopic.title}

                                                    onClick={() => handleSelect(topic.title, subtopic.title)}
                                                    className="flex py-2 text-sm flex-row items-center font-normal text-black dark:text-white  text-start"
                                                    role="menuitem"
                                                >
                                                    {subtopic.title}
                                                    {subtopic.done === true ? <FaCheck className='ml-2' size={12} /> : <></>}
                                                </p>

                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Sidebar.ItemGroup>
                    ))}
                </div>
            );
        } catch (error) {
            return (
                <div>
                    {topics.map((topic) => (
                        <Sidebar.ItemGroup key={topic.Title}>
                            <div className="relative inline-block text-left " >
                                <button
                                    onClick={() => handleOpenClose(topic.Title)}
                                    type="button"
                                    className="inline-flex text-start text-base w-64 font-bold  text-black dark:text-white"
                                >
                                    {topic.Title}
                                    <IoIosArrowDown className="-mr-1 ml-2 h-3 w-3 mt-2" />
                                </button>

                                {isOpen && key === topic.Title && (
                                    <div className="origin-top-right mt-2 pr-4">
                                        <div
                                            className="py-1"
                                            role="menu"
                                            aria-orientation="vertical"
                                            aria-labelledby="options-menu"
                                        >
                                            {topic.Subtopics.map((subtopic) => (
                                                <p
                                                    key={subtopic.Title}
                                                    onClick={() => handleSelect(topic.Title, subtopic.Title)}
                                                    className="flex py-2 flex-row text-sm items-center font-normal text-black dark:text-white  text-start"
                                                    role="menuitem"
                                                >
                                                    {subtopic.Title}
                                                    {subtopic.done === true ? <FaCheck className='ml-2' size={12} /> : <></>}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Sidebar.ItemGroup>
                    ))}
                </div>
            );
        }
    };

    return (
        <>
            {!mainTopic ? <></>
                :
                <div>
                    <div onClick={() => setIsOpenDrawer(true)} className="m-5 fixed bottom-4 right-4 z-40 w-12 h-12 bg-black text-white rounded-full flex justify-center items-center shadow-md dark:text-black dark:bg-white">
                        <IoChatbubbleEllipses size={20} />
                    </div>
                    <div className="flex bg-white dark:bg-black md:hidden pb-10 overflow-y-auto">
                        <div className={`fixed inset-0 bg-black opacity-50 z-50 ${isSidebarOpen ? 'block' : 'hidden'}`} onClick={toggleSidebar}></div>
                        <div className="flex-1 flex flex-col overflow-hidden">

                            <div>
                                <Navbar fluid className='py-3 dark:bg-black bg-white border-black dark:border-white md:border-b'>
                                    <Navbar.Brand className='ml-1'>

                                        {isComplete ?
                                            <p onClick={finish} className='mr-3 underline text-black dark:text-white font-normal'>Certificate</p>
                                            :
                                            <div className='w-7 h-7 mr-3'>
                                                <CircularProgressbar
                                                    value={percentage}
                                                    text={`${percentage}%`}
                                                    styles={buildStyles({
                                                        rotation: 0.25,
                                                        strokeLinecap: 'butt',
                                                        textSize: '20px',
                                                        pathTransitionDuration: 0.5,
                                                        pathColor: storedTheme === "true" ? '#fff' : '#000',
                                                        textColor: storedTheme === "true" ? '#fff' : '#000',
                                                        trailColor: storedTheme === "true" ? 'grey' : '#d6d6d6',
                                                    })}
                                                />
                                            </div>
                                        }

                                        <TruncatedText text={mainTopic} len={6} />
                                    </Navbar.Brand>
                                    <div className='flex md:hidden justify-center items-center'>
                                        <DarkModeToggle className='inline-flex items-center md:hidden' />
                                        {isSidebarOpen ? (
                                            <FiX
                                                onClick={toggleSidebar}
                                                className='mx-2'
                                                size={20}
                                                color={sessionStorage.getItem('darkMode') === 'true' ? 'white' : 'black'}
                                            />
                                        ) : (
                                            <FiMenu
                                                onClick={toggleSidebar}
                                                className='mx-2'
                                                size={20}
                                                color={sessionStorage.getItem('darkMode') === 'true' ? 'white' : 'black'}
                                            />
                                        )}
                                    </div>
                                    <Navbar.Collapse>
                                        <div className='hidden md:flex justify-center items-center mb-2 mt-2'>
                                            <DarkModeToggle />
                                        </div>
                                    </Navbar.Collapse>
                                </Navbar>

                            </div>

                            <Sidebar
                                aria-label="Default sidebar example"
                                theme={style}
                                className={`md:border-r md:border-black md:dark:border-white dark:bg-black fixed inset-y-0 left-0 w-64  bg-white z-50 overflow-y-auto transition-transform transform lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                            >
                                <LogoComponent isDarkMode={storedTheme} />
                                <Sidebar.Items className='mt-6'>

                                    {jsonData && renderTopicsAndSubtopics(jsonData[mainTopic.toLowerCase()])}

                                </Sidebar.Items>
                            </Sidebar>
                            <div className='mx-5 overflow-y-auto bg-white dark:bg-black'>
                                <p className='font-black text-black dark:text-white text-lg'>{selected}</p>

                                <div className='overflow-hidden mt-5 text-black dark:text-white text-base pb-10 max-w-full'>
                                    {type === 'video & text course' ?
                                        <div>
                                            <YouTube key={media} className='mb-5' videoId={media} opts={optsMobile} />
                                            <StyledText text={theory} />
                                        </div>

                                        :
                                        <div>
                                            <StyledText text={theory} />
                                            <img className='overflow-hidden p-10' src={media} alt="Media" />
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-row overflow-y-auto h-screen max-md:hidden'>
                        <Sidebar
                            theme={style}
                            aria-label="Default sidebar example">
                            <LogoComponent isDarkMode={storedTheme} />
                            <Sidebar.Items className='mt-6'>

                                {jsonData && renderTopicsAndSubtopics(jsonData[mainTopic.toLowerCase()])}

                            </Sidebar.Items>
                        </Sidebar>
                        <div className='overflow-y-auto flex-grow flex-col'>
                            <Navbar fluid className='py-3 dark:bg-black bg-white border-black dark:border-white md:border-b'>
                                <Navbar.Brand className='ml-1'>
                                    {isComplete ?
                                        <p onClick={finish} className='mr-3 underline text-black dark:text-white font-normal'>Download Certificate</p> :
                                        <div className='w-8 h-8 mr-3'>
                                            <CircularProgressbar
                                                value={percentage}
                                                text={`${percentage}%`}
                                                styles={buildStyles({
                                                    rotation: 0.25,
                                                    strokeLinecap: 'butt',
                                                    textSize: '20px',
                                                    pathTransitionDuration: 0.5,
                                                    pathColor: storedTheme === "true" ? '#fff' : '#000',
                                                    textColor: storedTheme === "true" ? '#fff' : '#000',
                                                    trailColor: storedTheme === "true" ? 'grey' : '#d6d6d6',
                                                })}
                                            />
                                        </div>
                                    }
                                    <TruncatedText text={mainTopic} len={10} />
                                </Navbar.Brand>
                                <Navbar.Collapse>
                                    <div className='hidden md:flex justify-center items-center mb-2 mt-2'>
                                        <DarkModeToggle />
                                    </div>
                                </Navbar.Collapse>
                            </Navbar>
                            <div className='px-5 bg-white dark:bg-black pt-5'>
                                <p className='font-black text-black dark:text-white text-xl'>{selected}</p>

                                <div className='overflow-hidden mt-5 text-black dark:text-white text-base pb-10 max-w-full'>

                                    {type === 'video & text course' ?
                                        <div>
                                            <YouTube key={media} className='mb-5' videoId={media} opts={opts} />
                                            <StyledText text={theory} />
                                        </div>

                                        :
                                        <div>
                                            <StyledText text={theory} />
                                            <img className='overflow-hidden p-10' src={media} alt="Media" />
                                        </div>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                    <Drawer open={isOpenDrawer} className='z-50 no-scrollbar bg-white dark:bg-black' position="right" onClose={handleOnClose}>
                        <div style={{ height: 'calc(100% - 50px)', overflowY: 'auto' }} className='no-scrollbar'>
                            {messages.map((msg, index) => (
                                <div key={index} style={{ alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start', display: 'flex', flexDirection: 'column', }}>
                                    <div style={{ borderBottomLeftRadius: 5, borderBottomRightRadius: 5, borderTopLeftRadius: msg.sender === 'user' ? 5 : 0, borderTopRightRadius: msg.sender === 'user' ? 0 : 5, overflow: 'hidden' }}>
                                        {msg.sender === 'user' ?
                                            <div style={{ backgroundColor: storedTheme === 'true' ? '#F9F9F9' : '#282C34', padding: 16, color: storedTheme === 'true' ? '#01020A' : '#fff', margin: 4 }} className='text-black dark:text-white text-xs' dangerouslySetInnerHTML={{ __html: msg.text }} />
                                            :
                                            <div style={{ backgroundColor: storedTheme === 'true' ? '#01020A' : '#F9F9F9', padding: 16, color: storedTheme === 'true' ? '#fff' : '#01020A', margin: 4 }} className='text-black dark:text-white text-xs ' dangerouslySetInnerHTML={{ __html: msg.text }} />
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='flex flex-row mt-4'>
                            <input value={newMessage} placeholder='Ask Something...' onChange={(e) => setNewMessage(e.target.value)} className='h-12 focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white' type="text" />
                            <div onClick={sendMessage} className='h-12 text-black  dark:text-white ml-2 content-center'>
                                <IoSend size={20} />
                            </div>
                        </div>
                    </Drawer>
                </div>
            }
        </>
    );
};


export default Course;