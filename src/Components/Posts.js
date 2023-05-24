import React, { useEffect, useState } from 'react';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { getDatabase, push, ref, set, onValue, remove } from "firebase/database";
import { useDispatch, useSelector } from 'react-redux';

const Posts = () => {

    const db = getDatabase();

    let [postmessageshow, setPostMessageShow] = useState([]);
    let [postmessageshowId, setPostMessageShowId] = useState([]);
    let [postimagemessageshow, setPostImageMessageShow] = useState([]);
    let [popupshow, setPopupshow] = useState(false);
    let [updateNameShow, setUpdateNameShow] = useState([]);
    let [profilephoto, setProfilePhoto] = useState([]);
    let [aboutshow, setAboutShow] = useState([]);

    let data = useSelector((state) => state.userLoginInfo.userInfo);

    useEffect(() => {
        const poststarCountRef = ref(db, 'post/');
        onValue(poststarCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                arr.push({ ...item.val(), key: item.key });

            });
            setPostMessageShow(arr);
        });
    }, []);

    useEffect(() => {
        const poststarCountRef = ref(db, 'post/');
        onValue(poststarCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                console.log('info', item.val().whosendid)
                console.log('info key', item.key)
                arr.push(item.val().whosendid + item.key)

            });
            setPostMessageShowId(arr);
        });
    }, []);

    useEffect(() => {
        const postimagemessagestarCountRef = ref(db, 'postimagesmessage/');
        onValue(postimagemessagestarCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                arr.push({ ...item.val(), key: item.key });
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
        const namestarCountRef = ref(db, 'updateusername/');
        onValue(namestarCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (data.uid == item.val().whosendid) {
                    arr.push({ ...item.val(), key: item.key });
                }
            });
            setUpdateNameShow(arr);
        });
    }, []);

    useEffect(() => {
        const namestarCountRef = ref(db, 'userprofileupdatephoto/');
        onValue(namestarCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (data.uid == item.val().whosendid) {
                    arr.push({ ...item.val(), key: item.key });
                }
            });
            setProfilePhoto(arr);
        });
    }, []);

    useEffect(() => {
        const aboutstarCountRef = ref(db, 'aboutinformation/');
        onValue(aboutstarCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (data.uid == item.val().whosendid) {
                    arr.push({ ...item.val(), key: item.key });
                }
            });
            setAboutShow(arr);
        });
    }, []);

    return (
        <div>
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
                            {profilephoto.map((item) => (
                                <img className='w-[52px] h-[52px] rounded-full' src={item.userupdatephoto} />
                            ))}
                        </div>
                        <div className='ml-4 mt-2'>
                            {updateNameShow.map((item) => (
                                <h3 className='font-open font-bold text-sm text-fontColor capitalize'>{item.updateusername}</h3>
                            ))}
                            {aboutshow.map((item) => (
                                <p className='font-open font-regular text-xs text-fontColor capitalize'>{item.aboutdetails}</p>
                            ))}
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
                            <img className='w-[52px] h-[52px] rounded-full' src={item.userimage} />
                        </div>
                        <div className='ml-4 mt-2'>
                            <h3 className='font-open font-bold text-sm text-fontColor capitalize'>{item.whosendname}</h3>
                            <p className='font-open font-regular text-xs text-fontColor capitalize'>{item.userabout}</p>
                        </div>
                    </div>
                    <p className='font-open font-regular text-sm text-fontColor mt-4'>{item.postimagemsg}</p>
                    <img className='mt-4 w-full h-[300px] object-cover' src={item.postimage} />
                </div>
            ))}

            {/* Post Show With Image End */}


        </div>
    )
}

export default Posts;