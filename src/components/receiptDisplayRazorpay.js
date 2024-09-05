import React from 'react';
import { MonthCost, MonthType, YearCost } from '../constants';

const ReceiptDisplayRazorpay = ({ jsonData }) => {

    const {
        id,
        current_start,
        charge_at,
    } = jsonData;

    const date = new Date(current_start * 1000);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const startDate = `${year}-${month}-${day}`;

    const date2 = new Date(charge_at * 1000);
    const year2 = date2.getFullYear();
    const month2 = date2.getMonth() + 1;
    const day2 = date2.getDate();
    const endDate = `${year2}-${month2}-${day2}`;
    let amount = '';
    if (sessionStorage.getItem('type') === MonthType) {
        amount = MonthCost
    } else {
        amount = YearCost
    }

    return (
        <div className='text-center py-10 flex items-center justify-center max-w-lg flex-col'>
            <h2 className='text-black dark:text-white font-black text-2xl my-3'>Receipt Information</h2>
            <p className='text-black dark:text-white font-normal'><strong>Subscription ID:</strong> {id}</p>
            <p className='text-black dark:text-white font-normal'><strong>Start Time:</strong> {startDate}</p>
            <p className='text-black dark:text-white font-normal'><strong>Next Billing Time:</strong> {endDate}</p>
            <p className='text-black dark:text-white font-normal'><strong>Amount:</strong> {amount} USD</p>
        </div>
    );
};

export default ReceiptDisplayRazorpay;
