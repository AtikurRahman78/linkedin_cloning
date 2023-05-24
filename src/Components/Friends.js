import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userLoginInfo } from '../slices/userSlice';
import { FiEdit } from 'react-icons/fi';
import { MdCloudUpload } from 'react-icons/md';
import { HiDotsVertical } from 'react-icons/hi';
import { BsSearch } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { getDatabase, ref, onValue, push, set, remove } from "firebase/database";

const Friends = () => {

    const db = getDatabase()
    const dispatch = useDispatch();
    const navigate = useNavigate();

    let [userLists, setUserLists] = useState([]);
    let [friendRequestList, setFriendRequestList] = useState([]);
    let [friendRequest, setFriendRequest] = useState([]);
    let [friend, setFriend] = useState([]);
    let [friendList, setFriendList] = useState([]);
    let [filterUserLists, setFilterUserLists] = useState([]);
    let [aboutdatastore, setAboutDataStore] = useState([]);
    let [contactDetails, setContactDetails] = useState([]);
    let [coverImageStore, setCoverImageStore] = useState([]);

    let data = useSelector((state) => state.userLoginInfo.userInfo);

    let handleProfilePageNavigation = () => {
        navigate('/profilepage');
    }

    let handlePostNavigation = () => {
        navigate('/onlypost')
    }

    useEffect(() => {
        const userCountRef = ref(db, 'users/');
        onValue(userCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (data.uid != item.key) {
                    arr.push({ ...item.val(), userid: item.key });
                }
            });
            setUserLists(arr);
        });
    }, []);

    let handleSentRequest = (item) => {
        console.log('request details', item)

        set(push(ref(db, 'friendRequest/')), {
            senderid: data.uid,
            sendername: data.displayName,
            receiverid: item.userid,
            receivername: item.username,
        });

    }

    useEffect(() => {
        const friendrequestListCountRef = ref(db, 'friendRequest/');
        onValue(friendrequestListCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                arr.push(item.val().receiverid + item.val().senderid);
            });
            setFriendRequestList(arr);
        });
    }, []);

    useEffect(() => {
        const friendrequestCountRef = ref(db, 'friendRequest/');
        onValue(friendrequestCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (data.uid == item.val().receiverid) {
                    arr.push({ ...item.val(), id: item.key });
                }
            });
            setFriendRequest(arr);
        });
    }, []);

    let handleAccept = (item) => {
        set(push(ref(db, 'friends/')), {
            ...item,
        }).then(() => {
            remove(ref(db, 'friendRequest/' + item.id))
        });
    }

    useEffect(() => {
        const friendCountRef = ref(db, 'friends/');
        onValue(friendCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (data.uid != item.key) {
                    arr.push(item.val().receiverid + item.val().senderid);
                }
            });
            setFriend(arr);
        });
    }, []);

    useEffect(() => {
        const friendListCountRef = ref(db, 'friends/');
        onValue(friendListCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (data.uid == item.val().receiverid || data.uid == item.val().senderid) {
                    arr.push({ ...item.val(), key: item.key });
                }
            });
            setFriendList(arr);
        });
    }, []);

    let handleCancel = (item) => {
        remove(ref(db, 'friendRequest/' + item.id));
    }

    let handleSearch = (e) => {
        let arr = [];
        if (e.target.value.length == 0) {
            setFilterUserLists([]);
        } else {
            userLists.filter((item) => {
                if (item.username.toLowerCase().includes(e.target.value.toLowerCase())) {
                    arr.push(item);
                    setFilterUserLists(arr);
                }
            });
        }
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
                    <div className='w-10/12'>
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

                <div className='w-10/12 mt-32 mb-10'>
                    <div className='text-center'>
                        <div className='flex justify-between mt-52'>
                            <div onClick={handleProfilePageNavigation} className='w-[300px] text-fontColor border border-border hover:bg-footer hover:text-white cursor-pointer transition-all py-2.5 px-3 rounded'>
                                Profile
                            </div>
                            <div className='w-[300px] text-fontColor border border-border hover:bg-footer hover:text-white cursor-pointer transition-all py-2.5 px-3 rounded'>
                                Friends
                            </div>
                            <div onClick={handlePostNavigation} className='w-[300px] text-fontColor border border-border hover:bg-footer hover:text-white cursor-pointer transition-all py-2.5 px-3 rounded'>
                                Post
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex justify-between w-10/12 mb-10'>
                    <div className='w-[50%]'>
                        <div className='w-full bg-white shadow-lg rounded-lg py-3 px-5 mt-11 h-[450px] overflow-y-scroll'>
                            <div className='relative'>
                                <h3 className='font-nunito font-bold text-xl'>Find Friends</h3>
                                <HiDotsVertical className='absolute top-[6px] right-[6px] text-button' />
                            </div>

                            <div className='relative mt-8 mb-8'>
                                <input onChange={handleSearch} className='w-full rounded-lg p-5 shadow-lg pl-[78px]' type='text' placeholder='Search' />
                                <BsSearch className='absolute top-[26px] left-[30px]' />
                                <HiDotsVertical className='absolute top-[26px] right-[30px] text-button' />
                            </div>
                            {filterUserLists.length > 0 ? (
                                filterUserLists.map((item) => (
                                    <div className='flex gap-x-5 items-center border-b border-solid border-button pb-3.5 mt-3.5'>
                                        <div>
                                            <img className='w-[70px] h-[70px] rounded-full' src='images/list1.png' />
                                        </div>
                                        <div>
                                            <h3 className='font-nunito font-bold text-xl'>{item.username}</h3>
                                            <p className='font-nunito font-semibold text-sm'>3 Matual Friends</p>
                                        </div>

                                        {friend.includes(item.userid + data.uid) || friend.includes(data.uid + item.userid) ? (
                                            <button className='font-nunito font-regular text-xs bg-footer text-white py-2.5 px-5 rounded'>Friend</button>
                                        ) : (
                                            friendRequestList.includes(item.userid + data.uid) || friendRequestList.includes(data.uid + item.userid) ? (
                                                <button className='font-nunito font-regular text-xs bg-footer text-white py-2.5 px-5 rounded'>Pending</button>
                                            ) : (
                                                <button onClick={() => handleSentRequest(item)} className='font-nunito font-regular text-xs bg-footer text-white py-2.5 px-5 rounded'>Sent Request</button>
                                            )
                                        )}
                                        <div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                userLists.map((item) => (
                                    <div className='flex gap-x-5 items-center border-b border-solid border-button pb-3.5 mt-3.5'>
                                        <div>
                                            <img className='w-[70px] h-[70px] rounded-full' src='images/list1.png' />
                                        </div>
                                        <div>
                                            <h3 className='font-nunito font-bold text-xl'>{item.username}</h3>
                                            <p className='font-nunito font-semibold text-sm'>3 Matual Friends</p>
                                        </div>

                                        {friend.includes(item.userid + data.uid) || friend.includes(data.uid + item.userid) ? (
                                            <button className='font-nunito font-regular text-xs bg-footer text-white py-2.5 px-5 rounded'>Friend</button>
                                        ) : (
                                            friendRequestList.includes(item.userid + data.uid) || friendRequestList.includes(data.uid + item.userid) ? (
                                                <button className='font-nunito font-regular text-xs bg-footer text-white py-2.5 px-5 rounded'>Pending</button>
                                            ) : (
                                                <button onClick={() => handleSentRequest(item)} className='font-nunito font-regular text-xs bg-footer text-white py-2.5 px-5 rounded'>Sent Request</button>
                                            )
                                        )}
                                        <div>
                                        </div>
                                    </div>
                                ))
                            )}




                        </div>
                    </div>
                    <div className='w-[48%]'>
                        <div className='w-full bg-white shadow-lg rounded-lg py-3 px-5 mt-11 h-[450px] overflow-y-scroll'>
                            <div className='relative'>
                                <h3 className='font-nunito font-bold text-xl'>Friends</h3>
                                <HiDotsVertical className='absolute top-[6px] right-[6px] text-button' />
                            </div>
                            <div className='relative mt-8 mb-8'>
                                <input className='w-full rounded-lg p-5 shadow-lg pl-[78px]' type='text' placeholder='Search' />
                                <BsSearch className='absolute top-[26px] left-[30px]' />
                                <HiDotsVertical className='absolute top-[26px] right-[30px] text-button' />
                            </div>
                            {friendList.map((item) => (
                                <div className='flex gap-x-5 items-center border-b border-solid border-button pb-3.5 mt-3.5'>
                                    <div>
                                        <img className='w-[70px] h-[70px] rounded-full' src='images/list1.png' />
                                    </div>
                                    <div>
                                        <h3 className='font-nunito font-bold text-xl'>{data.uid == item.receiverid ? item.sendername : item.receivername}</h3>
                                        <p className='font-nunito font-semibold text-sm'>3 Matual Friends</p>
                                    </div>
                                    <div>
                                        <button className='font-nunito font-regular text-xs bg-footer text-white py-2.5 px-5 rounded'>Block</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <div className='w-10/12 mb-10'>
                    <div className='w-1/2'>
                        <div className='w-full bg-white shadow-lg rounded-lg py-3 px-5 mt-11 h-[450px] overflow-y-scroll'>
                            <div className='relative'>
                                <h3 className='font-nunito font-bold text-xl'>Friend  Request</h3>
                                <HiDotsVertical className='absolute top-[6px] right-[6px] text-button' />
                            </div>
                            <div className='relative mt-8 mb-8'>
                                <input className='w-full rounded-lg p-5 shadow-lg pl-[78px]' type='text' placeholder='Search' />
                                <BsSearch className='absolute top-[26px] left-[30px]' />
                                <HiDotsVertical className='absolute top-[26px] right-[30px] text-button' />
                            </div>
                            {friendRequest.map((item) => (
                                <div className='flex gap-x-5 items-center border-b border-solid border-button pb-3.5 mt-3.5'>
                                    <div>
                                        <img className='w-[70px] h-[70px] rounded-full' src='images/list1.png' />
                                    </div>
                                    <div>
                                        <h3 className='font-nunito font-bold text-xl'>{item.sendername}</h3>
                                        <p className='font-nunito font-semibold text-sm'>Hi Guys, Wassup!</p>
                                    </div>
                                    <div>
                                        <button onClick={() => handleAccept(item)} className='font-nunito font-regular text-xs bg-footer text-white py-2.5 px-5 rounded mr-1'>Accept</button>
                                        <button onClick={() => handleCancel(item)} className='font-nunito font-regular text-xs bg-red-500 text-white py-2.5 px-5 rounded'>Cancel</button>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </div>

                <div className='w-4/6 mb-10'>

                </div>

                <div className='w-4/6 mb-10'>

                </div>

                <div className='w-4/6 mt-32 mb-10'>

                </div>

            </div>
        </>
    )
}

export default Friends;