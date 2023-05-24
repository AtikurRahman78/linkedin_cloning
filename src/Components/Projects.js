import React, { useEffect, useState } from 'react';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { FiEdit, FiSend } from 'react-icons/fi';
import { MdCloudUpload, MdCancel } from 'react-icons/md';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { getDatabase, ref as sref, onValue, set, push, remove } from "firebase/database";
import { useDispatch, useSelector } from 'react-redux';

const Projects = () => {

    const db = getDatabase();
    const auth = getAuth();
    const storage = getStorage();

    let [popupshow, setPopupshow] = useState(false);
    let [modal, setModal] = useState(false);
    let [projectImageGet, setProjectImageGet] = useState([]);

    let data = useSelector((state) => state.userLoginInfo.userInfo);

    const [image, setImage] = useState('');
    const [cropData, setCropData] = useState("#");
    const [cropper, setCropper] = useState();

    let handleEdit = () => {
        setPopupshow(true);
    }

    let handleCancel = () => {
        setPopupshow(false);
    }

    let handleImageModal = () => {
        console.log('Alhamdulliah')
        setModal(true);
    }

    let handleModalCancel = () => {
        setModal(false);
        setImage('');
        setCropper('');
        setCropData('');
    }

    const handleUplaodProfilePicture = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
    };

    const getCropData = () => {
        if (typeof cropper !== "undefined") {
            setCropData(cropper.getCroppedCanvas().toDataURL());
            const projectstorageRef = ref(storage, 'projectimage');
            const mess = cropper.getCroppedCanvas().toDataURL();
            uploadString(projectstorageRef, mess, 'data_url').then((snapshot) => {
                getDownloadURL(projectstorageRef).then((downloadURL) => {
                    set(push(sref(db, 'project/')), {
                        projectImage: downloadURL,
                        whosendid: data.uid,
                    }).then(() => {
                        setModal(false);
                        setPopupshow(false);
                        setImage('');
                        setCropper('');
                        setCropData('');
                    });
                });
            });
        }
    };

    useEffect(() => {
        const aboutstarCountRef = sref(db, 'project/');
        onValue(aboutstarCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if(data.uid == item.val().whosendid){
                    arr.push({ ...item.val(), key: item.key });
                }
            });
            setProjectImageGet(arr);
        });
    }, []);

    return (
        <>
            <div>
                <div className='relative bg-white shadow-lg rounded-xl py-8 px-6 mt-8'>
                    <BiDotsHorizontalRounded onClick={handleEdit} className='absolute text-2xl top-2 right-4 text-black cursor-pointer' />
                    {popupshow && (
                        <>
                            <div className='flex justify-end'>
                                <div className='bg-footer py-1 px-3 mr-2 rounded'>
                                    <button onClick={handleImageModal} className='font-barlow font-regular text-xs text-fontColor mb-2 text-white uppercase'>
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
                    <h3 className='font-open font-bold text-sm text-fontColor capitalize'>Projects</h3>
                    <div className='flex justify-between flex-wrap'>
                        {projectImageGet.map((item) => (
                            <div className='mt-4'>
                                <img className='w-[220px] h-[160px] object-cover' src={item.projectImage} />
                            </div>
                        ))}

                    </div>
                </div>
            </div >
            {modal && (
                <div className='w-full h-screen bg-footer absolute top-[635px] left-0 z-50 flex justify-center items-center'>
                    <div className='w-2/4 bg-white rounded-lg p-5'>
                        <h2 className='font-nunito font-bold text-3xl text-header-res'>Upload Your Project Picture.</h2>
                        <div className='relative w-28 h-28 rounded-full group overflow-hidden mx-auto'>
                            <div className="img-preview w-full h-full rounded-full" />
                        </div>
                        <input onChange={handleUplaodProfilePicture} className='mt-8' type='file' />
                        <br />
                        {image && (
                            <Cropper
                                style={{ height: 300, width: "100%" }}
                                zoomTo={0.5}
                                initialAspectRatio={1}
                                preview=".img-preview"
                                src={image}
                                viewMode={1}
                                minCropBoxHeight={10}
                                minCropBoxWidth={10}
                                background={false}
                                responsive={true}
                                autoCropArea={1}
                                checkOrientation={false}
                                onInitialized={(instance) => {
                                    setCropper(instance);
                                }}
                                guides={true}
                            />
                        )}
                        <button onClick={getCropData} className='w-1/4 bg-footer rounded-lg font-nunito font-regular text-xs text-white py-5 mt-8'>Upload</button>
                        <button onClick={handleModalCancel} className='w-1/4 bg-red-500 rounded-lg font-nunito font-regular text-xs text-white py-5 mt-8 ml-8'>Cancel</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default Projects;