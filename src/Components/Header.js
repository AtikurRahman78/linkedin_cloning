import React, { useState, useEffect } from 'react';
import { BsLinkedin, BsSearch } from 'react-icons/bs';
import { getAuth, signOut } from "firebase/auth";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { userLoginInfo } from '../slices/userSlice';
import { AiOutlineLogout } from 'react-icons/ai';
import { getDatabase, ref as ref, onValue, set, push, remove } from "firebase/database";


const Header = () => {

    const db = getDatabase();
    const auth = getAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    let [open, setOpen] = useState(false);
    let data = useSelector((state) => state.userLoginInfo.userInfo);
    let [updateNameShow, setUpdateNameShow] = useState([]);
    let [profilephoto, setProfilePhoto] = useState([]);

    let handleControl = () => {
        setOpen(!open);
    }

    let handleSignOut = () => {
        signOut(auth).then(() => {
            dispatch(userLoginInfo(null));
            localStorage.removeItem("userInfo");
            navigate('/login');
        }).catch((error) => {
            console.log(error);
        });
        setOpen(!open);
    }

    let handleProfilePage = () => {
        navigate('/profilepage');
    }

    let handleHomePage = () => {
        navigate('/');
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

    return (
        <div className='flex mt-4 ml-10 gap-80'>
            <BsLinkedin onClick={handleHomePage} className='text-primary text-4xl cursor-pointer' />
            <div className='relative'>
                <input className='w-full rounded-lg p-2.5 pl-[78px]' type='text' placeholder='Search' />
                <BsSearch className='text-primary text-xl absolute top-[16px] left-[30px]' />
            </div>
            <div className='flex' >
                {profilephoto.map((item) => (
                    <img onClick={handleProfilePage} src={item.userupdatephoto} className='w-[42px] h-[42px] rounded-full cursor-pointer' />
                ))}
                {updateNameShow.map((item) => (
                    <p className='font-barlow font-medium text-xs text-fontColor ml-3.5 mt-2.5'>{item.updateusername}</p>
                ))}
                <AiOutlineLogout onClick={handleControl} className='text-primary text-xl mt-2.5 ml-6' />
            </div>

            {open && (
                <div className='w-20 absolute top-[55px] right-[60px] bg-footer py-1 px-3 rounded'>
                    <button onClick={handleSignOut} className='font-barlow font-medium text-xs text-fontColor mb-2  text-white uppercase'>Logout
                    </button>
                </div>
            )}

        </div>
    )
}

export default Header;