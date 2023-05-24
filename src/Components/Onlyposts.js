import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userLoginInfo } from '../slices/userSlice';
import { FiEdit } from 'react-icons/fi';
import { MdCloudUpload } from 'react-icons/md';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { CiSettings } from 'react-icons/ci';
import { BsLinkedin } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { getDatabase, push, ref, set, onValue, remove } from "firebase/database";


const Onlyposts = () => {

    const db = getDatabase();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let [postmessageshow, setPostMessageShow] = useState([]);
    let [postimagemessageshow, setPostImageMessageShow] = useState([]);
    let [popupshow, setPopupshow] = useState(false);
    let [aboutdatastore, setAboutDataStore] = useState([]);
    let [contactDetails, setContactDetails] = useState([]);
    let [coverImageStore, setCoverImageStore] = useState([]);

    let data = useSelector((state) => state.userLoginInfo.userInfo);

    let handleProfilePageNavigation = () => {
        navigate('/profilepage');
    }

    let handleFriendsNavigation = () => {
        navigate('/friends');
    }

    useEffect(() => {
        const poststarCountRef = ref(db, 'post/');
        onValue(poststarCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (data.uid == item.val().whosendid) {
                    arr.push({ ...item.val(), key: item.key });
                }
            });
            setPostMessageShow(arr);
        });
    }, []);

    useEffect(() => {
        const postimagemessagestarCountRef = ref(db, 'postimagesmessage/');
        onValue(postimagemessagestarCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (data.uid == item.val().whosendid) {
                    arr.push({ ...item.val(), key: item.key });
                }
            });
            setPostImageMessageShow(arr);
        });
    }, []);

    let handlepostdelete = () => {
        setPopupshow(true);
    }

    let handlepostcancel = () => {
        setPopupshow(false);
    }

    let handlePostDelete = (item) => {
        remove(ref(db, 'postimagesmessage/' + item.key)).then(() => {
            setPopupshow(false);
        });
    }

    let handlePostMessageDelete = (item) => {
        console.log('delete information post', item)
        remove(ref(db, 'post/' + item.key)).then(() => {
            setPopupshow(false);
        });
    }

    useEffect(() => {
        const aboutstarCountRef = ref(db, 'about/');
        onValue(aboutstarCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (data.uid == item.val().whosendid) {
                    arr.push({ ...item.val(), key: item.key });
                }
            });
            setAboutDataStore(arr);
        });
    }, []);

    useEffect(() => {
        const contactstarCountRef = ref(db, 'contactinfo/');
        onValue(contactstarCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (data.uid == item.val().whosendid) {
                    arr.push({ ...item.val(), key: item.key })
                }
            });
            setContactDetails(arr);
        });
    }, []);

    useEffect(() => {
        const starCountRef = ref(db, 'coverimage/');
        onValue(starCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (data.uid == item.val().whosendid) {
                    arr.push({ ...item.val(), key: item.key })
                }
            });
            setCoverImageStore(arr);
        });
    }, []);

    

    return (
        <>
            <Header />
            <div className='max-w-container mt-12 mx-auto'>
                <div className='flex'>
                    <div className='w-4/6'>
                        <div className='w-full h-[30%] relative '>
                            <div className='w-full h-[200px]'>
                                {coverImageStore.map((item) => (
                                    <img className='w-full h-full object-cover' src={item.coverimage} />
                                ))}
                                <div className='absolute top-1.5 right-1.5 text-white'>
                                    <FiEdit className='text-white' />
                                </div>
                            </div>

                            <div className='flex'>
                                <div className='group text-center absolute top-[180px] left-[30px] w-[100px] h-[100px] rounded-full'>
                                    <img src={data.photoURL} className='w-full h-full rounded-full inline-block' />
                                </div>
                                <div>
                                    <div>
                                        <h4 className='text-center font-barlow font-bold text-sm text-fontColor ml-3.5 mt-2.5 absolute top-[205px] left-[134px]'>{data.displayName}</h4>
                                    </div>
                                    <div className='w-full'>
                                    </div>
                                    <div className='group'>
                                        <div className='absolute top-[250px] left-[147px] bg-footer py-[2px] px-[40px] rounded'>
                                            <button className='font-barlow font-medium text-xs text-fontColor text-white uppercase '>Contact info
                                            </button>
                                        </div>
                                        <div className='invisible group-hover:visible absolute top-[310px] left-[147px] bg-footer py-2 px-2 rounded'>
                                            {contactDetails.map((item) => (
                                                <>
                                                    <p className='font-barlow font-medium text-xs text-fontColor text-white mb-1'>{item.contactemail}</p>
                                                    <p className='font-barlow font-medium text-xs text-fontColor text-white'>{item.contactnumber}</p>
                                                </>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-4/6 mt-32 mb-10'>
                    <div className='text-center'>
                        <div className='flex justify-between mt-52'>
                            <div onClick={handleProfilePageNavigation} className='w-[240px] text-fontColor border border-border hover:bg-footer hover:text-white cursor-pointer transition-all py-2.5 px-3 rounded'>
                                Profile
                            </div>
                            <div onClick={handleFriendsNavigation} className='w-[240px] text-fontColor border border-border hover:bg-footer hover:text-white cursor-pointer transition-all py-2.5 px-3 rounded'>
                                Friends
                            </div>
                            <div className='w-[240px] text-fontColor border border-border hover:bg-footer hover:text-white cursor-pointer transition-all py-2.5 px-3 rounded'>
                                Post
                            </div>
                        </div>
                    </div>
                </div>

                <div className='w-4/6 mb-10'>
                    {/* Post Show Start */}
                    {postmessageshow.map((item) => (
                        <div className='relative bg-white shadow-lg rounded-xl py-14 px-6 mt-14'>
                            <BiDotsHorizontalRounded onClick={handlepostdelete} className='absolute text-2xl top-2 right-2 text-black cursor-pointer' />
                            {popupshow && (
                                <>
                                    <div className='flex justify-end'>
                                        <div className='bg-red-500 py-1 px-3 mr-2 rounded'>
                                            <button onClick={() => handlePostMessageDelete(item)} className='font-barlow font-regular text-xs text-fontColor mb-2 text-white uppercase'>Delete
                                            </button>
                                        </div>
                                        <div className='bg-footer py-1 px-3 rounded'>
                                            <button onClick={handlepostcancel} className='font-barlow font-regular text-xs text-fontColor mb-2 text-white uppercase'>Cancel
                                            </button>
                                        </div>
                                    </div>

                                </>
                            )}
                            <div className='flex'>
                                <div>
                                    <img className='w-[52px] h-[52px] rounded-full' src={data.photoURL} />
                                </div>
                                <div className='ml-4 mt-2'>
                                    <h3 className='font-open font-bold text-sm text-fontColor capitalize'>{data.displayName}</h3>
                                    <p className='font-open font-regular text-xs text-fontColor capitalize'>iOS developer</p>
                                </div>
                            </div>
                            <p className='font-open font-regular text-sm text-fontColor mt-4'>{item.post}</p>
                        </div>
                    ))}
                    {/* Post Show End */}

                    {/* Post Show With Image Start */}
                    {postimagemessageshow.map((item) => (
                        <div className='relative bg-white shadow-lg rounded-xl py-14 px-6 mt-14'>
                            <BiDotsHorizontalRounded onClick={handlepostdelete} className='absolute text-2xl top-2 right-2 text-black cursor-pointer' />
                            {popupshow && (
                                <>
                                    <div className='flex justify-end'>
                                        <div className='bg-red-500 py-1 px-3 mr-2 rounded'>
                                            <button onClick={() => handlePostDelete(item)} className='font-barlow font-regular text-xs text-fontColor mb-2 text-white uppercase'>Delete
                                            </button>
                                        </div>
                                        <div className='bg-footer py-1 px-3 rounded'>
                                            <button onClick={handlepostcancel} className='font-barlow font-regular text-xs text-fontColor mb-2 text-white uppercase'>Cancel
                                            </button>
                                        </div>
                                    </div>

                                </>
                            )}
                            <div className='flex'>
                                <div>
                                    <img className='w-[52px] h-[52px] rounded-full' src={data.photoURL} />
                                </div>
                                <div className='ml-4 mt-2'>
                                    <h3 className='font-open font-bold text-sm text-fontColor capitalize'>{data.displayName}</h3>
                                    <p className='font-open font-regular text-xs text-fontColor capitalize'>iOS developer</p>
                                </div>
                            </div>
                            <p className='font-open font-regular text-sm text-fontColor mt-4'>{item.postimagemsg}</p>
                            <img className='mt-4' src={item.postimage} />
                        </div>
                    ))}

                    {/* Post Show With Image End */}
                </div>

                <div className='w-4/6 mb-10'>
                    <div className='flex justify-between'>
                        <div>
                            <BsLinkedin className='text-primary text-4xl' />
                            <p className='font-barlow font-semibold text-sm text-fontColor mt-2'>Linked<span className='text-footer'>In</span></p>
                        </div>
                        <div>
                            <h3 className='font-barlow font-medium text-xs text-fontColor mb-6'>Navigation</h3>
                            <ul className='font-barlow font-regular text-xs text-fontColor'>
                                <li className='mb-2'>About</li>
                                <li className='mb-2'>Careers</li>
                                <li className='mb-2'>Advertising</li>
                                <li className='mb-2'>Small Business</li>
                            </ul>
                        </div>
                        <div className='mt-10'>
                            <ul className='font-barlow font-regular text-xs text-fontColor'>
                                <li className='mb-2'>Talent Solutions</li>
                                <li className='mb-2'>Marketing Solutions</li>
                                <li className='mb-2'>Sales Solutions</li>
                                <li className='mb-2'>Safery Center</li>
                            </ul>
                        </div>
                        <div className='mt-10'>
                            <ul className='font-barlow font-regular text-xs text-fontColor'>
                                <li >Community Guidelines</li>
                                <li className='mb-2'>Privacy & Terms </li>
                                <li className='mb-2'>Mobile App</li>
                            </ul>
                        </div>
                        <div className=''>
                            <h3 className='font-barlow font-medium text-xs text-fontColor mb-6'>Fast access</h3>
                            <div className='w-40 relative bg-footer py-2 px-3 rounded mb-2.5'>
                                <button className='font-barlow font-medium text-xs text-fontColor mb-2  text-white uppercase'>Questions?
                                    <AiOutlineQuestionCircle className='absolute top-[15px] right-[13px] text-white text-base' />
                                </button>
                            </div>
                            <div className='w-40 relative bg-footer py-2 px-3 rounded'>
                                <button className='font-barlow font-medium text-xs text-fontColor mb-2  text-white uppercase'>Settings
                                    <CiSettings className='absolute top-[15px] right-[13px] text-white text-base' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Onlyposts;