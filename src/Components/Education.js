import React, { useEffect, useState } from 'react';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { FiEdit, FiSend } from 'react-icons/fi';
import { MdCloudUpload, MdCancel } from 'react-icons/md';
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { useDispatch, useSelector } from 'react-redux';
import { getStorage, ref as sref, uploadBytesResumable, getDownloadURL, uploadString } from "firebase/storage";

const Education = () => {

    const db = getDatabase();
    const storage = getStorage();

    let data = useSelector((state) => state.userLoginInfo.userInfo);

    let [popupshow, setPopupshow] = useState(false);
    let [inputModal, setInputModal] = useState(false);
    let [institueimage, setInstituteImage] = useState('');
    let [institue, setInstitute] = useState('');
    let [qualification, setQualifications] = useState('');
    let [session, setSession] = useState('');
    let [institutioninfo, setInstitutionInfo] = useState([]);

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

    let handleInstituteImage = (e) => {
        console.log(e.target.files[0]);
        const storageRef = sref(storage, e.target.files[0].name);
        const uploadTask = uploadBytesResumable(storageRef, e.target.files[0]);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                console.log(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    setInstituteImage(downloadURL);
                });
            }
        );
    }

    let handleEducationSubmit = () => {
        set(push(ref(db, 'education/')), {
            institue: institue,
            qualification: qualification,
            session: session,
            institueimage: institueimage,
            whosendid: data.uid,
        }).then(() => {
            setInputModal(false);
        });
    }

    useEffect(() => {
        const starCountRef = ref(db, 'education/');
        onValue(starCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if(data.uid == item.val().whosendid){
                    arr.push({ ...item.val(), key: item.key })
                }
            });
            setInstitutionInfo(arr);
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
                        <div className='h-[210px] flex mt-3 '>
                            <div className='w-full relative'>
                                <input onChange={handleInstituteImage} type='file' className='w-[550px] p-3 border border-red rounded-lg ml-[-110px] mt-1 mb-4 absolute top-[-67px] left-[134px]' />
                                <input onChange={(e) => setInstitute(e.target.value)} className='w-[550px] p-3 border border-red rounded-lg ml-[-110px] mt-1 mb-4 absolute top-[10px] left-[134px]' placeholder='Institue Name..' />
                                <textarea onChange={(e) => setQualifications(e.target.value)} className='w-[550px] p-3 border border-red rounded-lg ml-[-110px] mt-1 absolute top-[80px] left-[134px]' placeholder='Qualifications..' />
                                <input onChange={(e) => setSession(e.target.value)} className='w-[550px] p-3 border border-red rounded-lg ml-[-110px] mt-1 mb-4 absolute top-[170px] left-[134px]' placeholder='Session..' />
                                <button onClick={handleEducationSubmit} className='bg-primary text-xs p-3 rounded-md absolute top-[50px] right-10 cursor-pointer mr-2'>
                                    <FiSend className='text-white' />
                                </button>
                                <button onClick={handleCancelModal} className='bg-primary text-xs text-white p-3 rounded-md absolute top-[50px] right-2 cursor-pointer'>
                                    <MdCancel className='text-white' />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className='font-open font-bold text-sm text-fontColor capitalize'>Education</h3>
                        {institutioninfo.map((item) => (
                            <div className='flex mt-4 items-center'>
                                <div>
                                    <img className='w-[52px] h-[52px] rounded-full' src={item.institueimage} />
                                </div>
                                <div className='ml-4 mt-2'>
                                    <h3 className='font-open font-bold text-sm text-fontColor capitalize'>{item.institue}</h3>
                                    <p className='font-open font-regular text-xs text-fontColor capitalize mt-2'>{item.qualification}</p>
                                    <p className='font-open font-regular text-xs text-fontColor capitalize mt-2'>{item.session}</p>
                                </div>
                            </div>
                        ))}

                    </>
                )}

            </div>
        </div >
    )
}

export default Education;