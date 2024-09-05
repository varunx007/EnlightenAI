import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import Footers from '../components/footers';
import { Button, Label, Radio } from 'flowbite-react';
import { AiOutlineLoading } from 'react-icons/ai';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { serverURL } from '../constants';

const Create = () => {

    const maxSubtopics = 5;
    const [formValues, setFormValues] = useState([{ sub: "" }]);
    const [processing, setProcessing] = useState(false);
    const [selectedValue, setSelectedValue] = useState('4');
    const [selectedType, setSelectedType] = useState('Text & Image Course');
    const [paidMember, setPaidMember] = useState(false);
    const [lableText, setLableText] = useState('For free member sub topics is limited to 5');
    const navigate = useNavigate();

    useEffect(() => {

        if (sessionStorage.getItem('type') !== 'free') {
            setPaidMember(true);
            setLableText('Select number of sub topics')
        }

    }, []);

    let handleChange = (i, e) => {
        let newFormValues = [...formValues];
        newFormValues[i][e.target.name] = e.target.value;
        setFormValues(newFormValues);
    }

    let addFormFields = () => {
        if (formValues.length < maxSubtopics) {
            setFormValues([...formValues, { sub: "" }]);
        } else {
            showToast('You can only add 5 sub topics');
        }
    }

    let removeFormFields = () => {
        let newFormValues = [...formValues];
        newFormValues.pop();
        setFormValues(newFormValues);
    }

    const showPaidToast = async () => {
        if (!paidMember) {
            toast("For paid members only", {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            });
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

    const handleSubmit = (event) => {
        event.preventDefault();
        const subtopics = [];
        setProcessing(true);
        formValues.forEach(subtopic => {
            subtopics.push(subtopic.subtopic);
        });

        const mainTopic = document.getElementById('topic1').value;

        if (!mainTopic.trim()) {
            setProcessing(false);
            showToast('Please fill in all required fields');
            return;
        }

        if (subtopics.length === 0) {
            setProcessing(false);
            showToast('Please fill in all required fields');
            return;
        }

        const prompt = `Generate a list of Strict ${selectedValue} topics and any number sub topic for each topic for main title ${mainTopic.toLowerCase()}, everything in single line. Those ${selectedValue} topics should Strictly include these topics :- ${subtopics.join(', ').toLowerCase()}. Strictly Keep theory, youtube, image field empty. Generate in the form of JSON in this format {
            "${mainTopic.toLowerCase()}": [
       {
       "title": "Topic Title",
       "subtopics": [
        {
        "title": "Sub Topic Title",
        "theory": "",
        "youtube": "",
        "image": "",
        "done": false
        },
        {
        "title": "Sub Topic Title",
        "theory": "",
        "youtube": "",
        "image": "",
        "done": false
        }
       ]
       },
       {
       "title": "Topic Title",
       "subtopics": [
        {
        "title": "Sub Topic Title",
        "theory": "",
        "youtube": "",
        "image": "",
        "done": false
        },
        {
        "title": "Sub Topic Title",
        "theory": "",
        "youtube": "",
        "image": "",
        "done": false
        }
       ]
       }
      ]
      }`;

        sendPrompt(prompt, mainTopic, selectedType)

    };

    async function sendPrompt(prompt, mainTopic, selectedType) {
        const dataToSend = {
            prompt: prompt,
        };
        try {
            const postURL = serverURL + '/api/prompt';
            const res = await axios.post(postURL, dataToSend);
            const generatedText = res.data.generatedText;
            const cleanedJsonString = generatedText.replace(/```json/g, '').replace(/```/g, '');
            try {
                const parsedJson = JSON.parse(cleanedJsonString);
                setProcessing(false);
                navigate('/topics', { state: { jsonData: parsedJson, mainTopic: mainTopic.toLowerCase(), type: selectedType.toLowerCase() } });
            } catch (error) {
                sendPrompt(prompt, mainTopic, selectedType)
            }

        } catch (error) {
            sendPrompt(prompt, mainTopic, selectedType)
        }
    }

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleRadioChangeType = (event) => {
        setSelectedType(event.target.value);
    };

    return (
        <div className='h-screen flex flex-col'>
            <Header isHome={true} className="sticky top-0 z-50" />

            <div className='dark:bg-black flex-1'>

                <div className='flex-1 flex items-center justify-center py-10'>

                    <form onSubmit={handleSubmit} className="max-w-sm m-auto py-4 no-scrollbar">
                        <p className='text-center font-black text-4xl text-black dark:text-white'>Generate Course</p>
                        <p className='text-center font-normal text-black py-4 dark:text-white'>Type the topic on which you want to Generate course.<br />
                            Also, you can enter a list of subtopics, which are the specifics you want to learn.</p>
                        <div className='py-6'>
                            <div className='mb-6'>
                                <div className="mb-2 block">
                                    <Label className="font-bold text-black dark:text-white" htmlFor="topic1" value="Topic" />
                                </div>
                                <input className='focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white' id="topic1" type="text" />
                            </div>
                            <div className='mb-6'>
                                <div className="mb-2 block">
                                    <Label className="font-bold text-black dark:text-white" htmlFor="subtopic" value="Sub Topic" />
                                </div>
                                {formValues.map((element, index) => (
                                    <div key={index}>
                                        <input onChange={e => handleChange(index, e)} className='focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none block w-full dark:bg-black dark:border-white dark:text-white mb-6' id="subtopic" type="text" />
                                    </div>
                                ))}
                            </div>

                            <Button type="button" onClick={() => addFormFields()} className='mb-6 items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none w-full enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent'>Add Sub-Topic</Button>

                            {formValues.length > 1 && (
                                <Button type="button" onClick={() => removeFormFields()} className='mb-6 items-center justify-center text-center border-black dark:border-white dark:bg-black dark:text-white bg-white text-black font-bold rounded-none w-full enabled:hover:bg-white enabled:focus:bg-white enabled:focus:ring-transparent dark:enabled:hover:bg-black dark:enabled:focus:bg-black dark:enabled:focus:ring-transparent'>Remove Sub-Topic</Button>
                            )}

                            <Label className="font-bold text-black dark:text-white" htmlFor="nosubtopic" value={lableText} />
                            <fieldset className="flex max-w-md flex-col gap-4 mt-2">
                                <div className="flex items-center gap-2 px-2 h-11 focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none w-full dark:bg-black dark:border-white dark:text-white">
                                    <Radio onChange={handleRadioChange} className='text-black border-black dark:text-white dark:border-white dark:focus:text-black focus:ring-black dark:focus:ring-white dark:focus:bg-black ' id="4" name="value" value="4" defaultChecked />
                                    <Label className='text-black dark:text-white font-bold' htmlFor="4">5</Label>
                                </div>
                                <div onClick={() => showPaidToast()} className="flex items-center gap-2 px-2 h-11 focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none w-full dark:bg-black dark:border-white dark:text-white mb-6">
                                    <Radio onChange={handleRadioChange} disabled={!paidMember} className='text-black border-black dark:text-white dark:border-white dark:focus:text-black focus:ring-black dark:focus:ring-white dark:focus:bg-black ' id="7" name="value" value="7" />
                                    <Label className='text-black dark:text-white font-bold' htmlFor="7">10</Label>
                                </div>
                            </fieldset>

                            <Label className="font-bold text-black dark:text-white" htmlFor="nosubtopic" value="Select Course Type" />
                            <fieldset className="flex max-w-md flex-col gap-4 mt-2">
                                <div className="flex items-center gap-2 px-2 h-11 focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none w-full dark:bg-black dark:border-white dark:text-white">
                                    <Radio onChange={handleRadioChangeType} className='text-black border-black dark:text-white dark:border-white dark:focus:text-black focus:ring-black dark:focus:ring-white dark:focus:bg-black ' id="textcourse" name="value1" value="Text & Image Course" defaultChecked />
                                    <Label className='text-black dark:text-white font-bold' htmlFor="textcourse">Theory & Image Course</Label>
                                </div>
                                <div onClick={() => showPaidToast()} className="flex items-center gap-2 px-2 h-11 focus:ring-black focus:border-black border border-black font-normal bg-white rounded-none w-full dark:bg-black dark:border-white dark:text-white mb-6">
                                    <Radio onChange={handleRadioChangeType} disabled={!paidMember} className='text-black border-black dark:text-white dark:border-white dark:focus:text-black focus:ring-black dark:focus:ring-white dark:focus:bg-black ' id="videocourse" name="value1" value="Video & Text Course" />
                                    <Label className='text-black dark:text-white font-bold' htmlFor="videocourse">Video & Theory Course</Label>
                                </div>
                            </fieldset>

                            <Button isProcessing={processing} processingSpinner={<AiOutlineLoading className="h-6 w-6 animate-spin" />} className='items-center justify-center text-center dark:bg-white dark:text-black bg-black text-white font-bold rounded-none w-full enabled:hover:bg-black enabled:focus:bg-black enabled:focus:ring-transparent dark:enabled:hover:bg-white dark:enabled:focus:bg-white dark:enabled:focus:ring-transparent' type="submit">Submit</Button>
                        </div>

                    </form>
                </div>
            </div>

            <Footers className="sticky bottom-0 z-50" />
        </div>
    );
};

export default Create;

