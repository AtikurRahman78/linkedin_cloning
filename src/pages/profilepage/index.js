import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { userLoginInfo } from '../../slices/userSlice';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import Editprofile from '../../Components/Editprofile';
import Buttons from '../../Components/Buttons';
import Aboout from '../../Components/Aboout';
import Projects from '../../Components/Projects';
import Experience from '../../Components/Experience';
import Education from '../../Components/Education';

const Profilepage = () => {

    const auth = getAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <>

            <Header />

            <div className='max-w-container mt-12 mx-auto'>
                <div className='flex'>
                    <div className='w-4/6'>
                        <Editprofile />
                    </div>
                </div>
                
                <div className='w-4/6 mt-32 mb-10'>
                    <Buttons />
                </div>
                
                <div className='w-4/6 mb-10'>
                    <Aboout />
                </div>

                <div className='w-4/6 mb-10'>
                    <Projects/>
                </div>

                <div className='w-4/6 mb-10'>
                    <Experience/>
                </div>

                <div className='w-4/6 mb-10'>
                    <Education/>
                </div>
                
                <div className='w-4/6 mt-32 mb-10'>
                    <Footer />
                </div>

            </div>
        </>
    )
}

export default Profilepage;