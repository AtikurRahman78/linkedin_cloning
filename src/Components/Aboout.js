import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { FiEdit, FiSend } from 'react-icons/fi';
import { MdCloudUpload, MdCancel } from 'react-icons/md';

const Aboout = () => {

    const db = getDatabase();

    let data = useSelector((state) => state.userLoginInfo.userInfo);

    let [inputModal, setInputModal] = useState(false);
    let [popupshow, setPopupshow] = useState(false);
    let [aboutdetails, setAboutDetails] = useState('');
    let [aboutdetailsinfo, setAboutDetailsInfo] = useState([]);


    let handleEdit = () => {
        setPopupshow(true);
    }

    let handleCancel = () => {
        setPopupshow(false);
    }

    let handleInput = () => {
        setInputModal(true);
        setPopupshow(false);
    }

    let handleCancelModal = () => {
        setInputModal(false);
    }

    let handleAboutDetailsUpload = () => {
        remove(ref(db, 'aboutdetails/' + data.uid));
        set(ref(db, 'aboutdetails/' + data.uid), {
            aboutDetails: aboutdetails,
            whosendid: data.uid,
        }).then(() => {
            setInputModal(false);
        });
    }

    useEffect(() => {
        const starCountRef = ref(db, 'aboutdetails/');
        onValue(starCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if(data.uid == item.val().whosendid){
                    arr.push({ ...item.val(), key: item.key })
                }
            });
            setAboutDetailsInfo(arr);
        });
    }, []);

    return (
        <div>
            <div className='relative bg-white shadow-lg rounded-xl py-8 px-6 mt-14'>
                <BiDotsHorizontalRounded onClick={handleEdit} className='absolute text-2xl top-2 right-4 text-black cursor-pointer' />
                {popupshow && (
                    <>
                        <div className='flex justify-end'>
                            <div className='bg-footer py-1 px-3 mr-2 rounded'>
                                <button onClick={handleInput} className='font-barlow font-regular text-xs text-fontColor mb-2 text-white uppercase'>
                                    <FiEdit className=' text-xs text-white cursor-pointer' />
                                </button>
                            </div>
                            <div className='bg-red-500 py-1 px-3 rounded'>
                                <button onClick={handleCancel} className='font-barlow font-regular text-xs text-fontColor mb-2 text-white uppercase'>
                                    <MdCancel className=' text-xs text-white cursor-pointer' />
                                </button>
                            </div>
                        </div>

                    </>
                )}
                {inputModal ? (
                    <>
                        <div className='flex mt-3 '>
                            <div className='w-full relative'>
                                <textarea onChange={(e) => setAboutDetails(e.target.value)} className='w-[550px] p-3 border border-red rounded-lg ml-[-110px] mt-1 absolute top-[-67px] left-[134px]' placeholder='Change About..' />
                                <button onClick={handleAboutDetailsUpload} className='bg-primary text-xs p-3 rounded-md absolute top-[-45px] right-10 cursor-pointer mr-2'>
                                    <FiSend className='text-white' />
                                </button>
                                <button onClick={handleCancelModal} className='bg-primary text-xs text-white p-3 rounded-md absolute top-[-45px] right-2 cursor-pointer'>
                                    <MdCancel className='text-white' />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className='font-open font-bold text-sm text-fontColor capitalize'>About</h3>
                        {aboutdetailsinfo.map((item) => (
                            <p className='font-open font-regular text-sm text-fontColor mt-3'>{item.aboutDetails}</p>
                        ))}
                    </>
                )}

            </div>
        </div >
    )
}

export default Aboout;