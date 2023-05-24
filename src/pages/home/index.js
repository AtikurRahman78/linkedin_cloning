import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { userLoginInfo } from '../../slices/userSlice';
import Header from '../../Components/Header';
import Newpost from '../../Components/Newpost';
import Posts from '../../Components/Posts';
import Profile from '../../Components/Profile';
import Footer from '../../Components/Footer';

const Home = () => {

    const auth = getAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    let [verify, setVerify] = useState(false);

    let data = useSelector((state) => state.userLoginInfo.userInfo);
    console.log('redux data', data);

    onAuthStateChanged(auth, (user) => {
        if (user.emailVerified) {
            setVerify(true);
            dispatch(userLoginInfo(user));
            localStorage.setItem("userInfo", JSON.stringify(user));
        }
    });

    useEffect(() => {
        if (!data) {
            navigate('/login');
        }
    }, []);


    return (
        <div>
            {verify ? (

                <>

                    <Header/>

                    <div className='max-w-container mt-12 mx-auto'>
                        <div className='flex'>
                            <div className='w-4/6'>
                                <Newpost/>
                                <Posts/>
                            </div>
                            <div className='w-[30%] h-96 ml-10'>
                                <Profile/>
                            </div>
                        </div>
                        {/* Footer Part Start */}
                        <div className='w-4/6 mt-32 mb-10'>
                            <Footer/>
                        </div>
                        {/* Footer Part End */}

                    </div>
                </>

            ) : (
                <div className='w-full h-screen flex justify-center items-center'>
                    <h1 className='font-nunito font-bold text-5xl bg-primary text-white p-5'>Please First Verify Your Email!</h1>
                </div>
            )}
        </div>
    )
}

export default Home;