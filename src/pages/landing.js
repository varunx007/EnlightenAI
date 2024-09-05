import React, { useEffect } from 'react';
import Header from '../components/header';
import Footers from '../components/footers';
import SlideOne from '../components/landing/slideOne';
import SlideTwo from '../components/landing/slideTwo';
import SlideThree from '../components/landing/slideThree';
import SlideFour from '../components/landing/slideFour';
import SlideFive from '../components/landing/slideFive';
import SlideSix from '../components/landing/slideSix';
import { serverURL } from '../constants';
import axios from 'axios';

const Landing = () => {

    useEffect(() => {
        async function dashboardData() {
            const postURL = serverURL + `/api/policies`;
            const response = await axios.get(postURL);
            sessionStorage.setItem('TermsPolicy', response.data[0].terms);
            sessionStorage.setItem('PrivacyPolicy', response.data[0].privacy)
        }
        if (sessionStorage.getItem('TermsPolicy') === null && sessionStorage.getItem('PrivacyPolicy') === null) {
            dashboardData();
        }
    }, []);

    return (
        <>
            <Header isHome={false} />
            <SlideOne />
            <SlideTwo />
            <SlideThree />
            <SlideFour />
            <SlideFive />
            <SlideSix />
            <Footers />
        </>
    );
};

export default Landing;