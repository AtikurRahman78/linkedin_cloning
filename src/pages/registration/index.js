import React, { useState } from 'react';
import { BsLinkedin } from 'react-icons/bs';
import { RiEyeCloseFill, RiEyeFill } from 'react-icons/ri';
import { Link, useNavigate } from 'react-router-dom';
import { Rings } from 'react-loader-spinner'
import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import { getDatabase, ref, set } from "firebase/database";

const Registration = () => {

    const db = getDatabase();
    const auth = getAuth();
    const navigate = useNavigate();

    let [email, setEmail] = useState('');
    let [name, setName] = useState('');
    let [password, setPassword] = useState('');
    let [emailErr, setEmailErr] = useState('');
    let [nameErr, setNameErr] = useState('');
    let [passwordErr, setPasswordErr] = useState('');
    let [passShow, setPasswordShow] = useState(false);
    let [loading, setLoading] = useState(false);

    let handleEmail = (e) => {
        setEmail(e.target.value);
        setEmailErr('');
    }

    let handleName = (e) => {
        setName(e.target.value);
        setNameErr('');
    }

    let handlePassword = (e) => {
        setPassword(e.target.value);
        setPasswordErr('');
    }

    let handleSignUp = () => {
        if (!email) {
            setEmailErr('Email Is Required!');
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)) {
            setEmailErr('Invalid Email!');
        }
        if (!name) {
            setNameErr('Name Is Required!');
        }
        if (!password) {
            setPasswordErr('Password Is Required!');
        }
        if (email && name && password && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)) {
            setLoading(true);
            createUserWithEmailAndPassword(auth, email, password).then((user) => {
                updateProfile(auth.currentUser, {
                    displayName: name, 
                    photoURL: "images/avatar.png",
                }).then(() => {
                    toast.info('Registration Successful!');
                    setEmail('');
                    setName('');
                    setPassword('');
                    sendEmailVerification(auth.currentUser);
                    setTimeout(() => {
                        navigate('/login')
                    }, 2000);
                    setLoading(false);
                }).then(() => {
                    set(ref(db, 'users/' + user.user.uid), {
                        username: user.user.displayName,
                        email: user.user.email,
                    });

                })
                    .catch((error) => {
                        const errorCode = error.code;
                        console.log(errorCode);
                        setLoading(false);
                    });

            }).catch((error) => {
                const errorCode = error.code;
                console.log(errorCode);
                setLoading(false);
            });
        }
    }

    return (
        <div className='text-center mt-12'>
            <ToastContainer position="top-right" theme="colored" />
            <div className='flex justify-center'>
                <BsLinkedin className='text-primary text-4xl' />
            </div>
            <h1 className='font-nunito font-bold text-3xl text-secondary mt-8'>Get started with easily register</h1>
            <h3 className='font-nunito font-normal text-xl text-secondary mt-2.5'>Free register and you can enjoy it</h3>
            <div className='relative mt-9'>
                <input onChange={handleEmail} type="email" value={email} className='border border-solid rounded-lg border-tertiary w-96 py-5 px-14' />
                <p className='font-nunito font-semibold text-xs text-secondary absolute top-[-10px] left-[530px] bg-white px-[18px]'>Email Address
                </p>
                {emailErr && (
                    <p className='font-nunito font-semibold text-xl text-red-600 mr-48'>{emailErr}</p>
                )}
            </div>
            <div className='relative mt-9'>
                <input onChange={handleName} type="text" value={name} className='border border-solid rounded-lg border-tertiary w-96 py-5 px-14' />
                <p className='font-nunito font-semibold text-xs text-secondary absolute top-[-10px] left-[530px] bg-white px-[18px]'>Full name</p>
                {nameErr && (
                    <p className='font-nunito font-semibold text-xl text-red-600 mr-48'>{nameErr}</p>
                )}
            </div>
            <div className='relative mt-9'>
                <input onChange={handlePassword} type={passShow ? "text" : "password"} value={password} className='border border-solid rounded-lg border-tertiary w-96 py-5 px-14' />
                <p className='font-nunito font-semibold text-xs text-secondary absolute top-[-10px] left-[530px] bg-white px-[18px]'>Password</p>
                {passwordErr && (
                    <p className='font-nunito font-semibold text-xl text-red-600 mr-40'>{passwordErr}</p>
                )}
                {passShow ? (
                    <RiEyeFill onClick={() => setPasswordShow(!passShow)} className='absolute top-[30px] right-[510px] text-secondary' />
                ) : (
                    <RiEyeCloseFill onClick={() => setPasswordShow(!passShow)} className='absolute top-[30px] right-[510px] text-secondary' />
                )}
            </div>
            {loading ? (
                <div className='flex justify-center mt-6'>
                    <Rings
                        height="80"
                        width="80"
                        color="#0077B5"
                        radius="6"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        ariaLabel="rings-loading"
                    />
                </div>
            ) : (
                <button onClick={handleSignUp} className='w-96 bg-primary rounded-full font-nunito font-semibold text-xl text-white py-4 mt-8'>Sign up</button>
            )}
            <p className='font-nunito font-regular text-sm text-secondary mt-2.5'>Already  have an account ? <Link to='/login' className='font-nunito font-bold text-secondary cursor-pointer'>Sign In</Link></p>

        </div>
    )
}

export default Registration;