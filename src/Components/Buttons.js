import React from 'react';
import { useNavigate } from 'react-router-dom';

const Buttons = () => {

    const navigate = useNavigate();

    let handleFriendsNavigation = ()=>{
        navigate('/friends');
    }

    let handlePostNavigation = () => {
        navigate('/onlypost')
    }

    return (
        <div className='text-center'>
            <div className='flex justify-between mt-52'>
                <div className='w-[240px] text-fontColor border border-border hover:bg-footer hover:text-white cursor-pointer transition-all py-2.5 px-3 rounded'>
                    Profile
                </div>
                <div onClick={handleFriendsNavigation} className='w-[240px] text-fontColor border border-border hover:bg-footer hover:text-white cursor-pointer transition-all py-2.5 px-3 rounded'>
                    Friends
                </div>
                <div onClick={handlePostNavigation} className='w-[240px] text-fontColor border border-border hover:bg-footer hover:text-white cursor-pointer transition-all py-2.5 px-3 rounded'>
                    Post
                </div>
            </div>
        </div>
    )
}

export default Buttons;