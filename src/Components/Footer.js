import React from 'react';
import { BsLinkedin } from 'react-icons/bs';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { CiSettings } from 'react-icons/ci';

const Footer = () => {
    return (
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
    )
}

export default Footer;