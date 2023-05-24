import React, { useState, useEffect } from 'react';
import { FiEdit, FiSend } from 'react-icons/fi';
import { MdCloudUpload, MdCancel } from 'react-icons/md';
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLoginInfo } from '../slices/userSlice';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getStorage, ref, uploadString, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { getDatabase, ref as sref, onValue, set, push, remove } from "firebase/database";


const Editprofile = () => {

    const db = getDatabase();
    const auth = getAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const storage = getStorage();

    let [aboutdatastore, setAboutDataStore] = useState([]);

    let [covermodal, setCoverModal] = useState(false);
    let [coverImage, setCoverImage] = useState('');
    let [coverImageStore, setCoverImageStore] = useState([]);

    const [image, setImage] = useState('');
    const [cropData, setCropData] = useState("#");
    const [cropper, setCropper] = useState();

    let data = useSelector((state) => state.userLoginInfo.userInfo);

    let [imageModal, setImageModal] = useState(false);
    let [contactModal, setContactModal] = useState(false);
    let [contactEmail, setContactEmail] = useState('');
    let [contactNumber, setContactNumber] = useState('');
    let [contactDetails, setContactDetails] = useState([]);
    let [updateNameShow, setUpdateNameShow] = useState([]);
    let [profilephoto, setProfilePhoto] = useState([]);

    let handleProfilePicture = () => {
        setImageModal(true);
    }

    let handleProfileCancel = () => {
        setImageModal(false);
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
            const storageRef = ref(storage, auth.currentUser.uid);
            const message4 = cropper.getCroppedCanvas().toDataURL();
            uploadString(storageRef, message4, 'data_url').then((snapshot) => {
                getDownloadURL(storageRef).then((downloadURL) => {
                    updateProfile(auth.currentUser, {
                        photoURL: downloadURL
                    }).then(() => {
                        setImageModal(false);
                        setImage('');
                        setCropper('');
                        setCropData('');
                    });
                });
            });
        }
    };

    useEffect(() => {
        const aboutstarCountRef = sref(db, 'about/');
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

    let handleEditContact = () => {
        setContactModal(true);
    }

    let handleContactCancel = () => {
        setContactModal(false);
    }

    let handleContactUpdate = () => {
        remove(sref(db, 'contactinfo/' + data.uid))
        set(sref(db, 'contactinfo/' + data.uid), {
            contactemail: contactEmail,
            contactnumber: contactNumber,
            whosendid: data.uid,
        }).then(() => {
            setContactModal(false);
        });
    }

    useEffect(() => {
        const contactstarCountRef = sref(db, 'contactinfo/');
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

    let handleCoverPictureModal = () => {
        setCoverModal(true);
    }

    let handleCoverModalCancel = () => {
        setCoverModal(false);
    }

    let handleCoverImage = (e) => {
        console.log(e.target.files[0]);
        const storageRef = ref(storage, e.target.files[0].name);
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
                    setCoverImage(downloadURL);
                });
            }
        );
    }

    let handleCoverImageSubmit = () => {
        console.log('Alhamdulliah')
        console.log('image ashse ki na', coverImage)
        remove(sref(db, 'coverimage/' + data.uid));
        set(sref(db, 'coverimage/' + data.uid), {
            coverimage: coverImage,
            whosendid: data.uid,
        }).then(() => {
            setCoverModal(false);
        });
    }

    useEffect(() => {
        const starCountRef = sref(db, 'coverimage/');
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

    useEffect(() => {
        const namestarCountRef = sref(db, 'updateusername/');
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
        const namestarCountRef = sref(db, 'userprofileupdatephoto/');
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
        <>
            <div className='w-full h-[30%] relative '>
                <div className='w-full h-[200px]'>
                    {coverImageStore.map((item) => (
                        <img className='w-full h-full object-cover' src={item.coverimage} />
                    ))}
                    <div onClick={handleCoverPictureModal} className='absolute top-1.5 right-1.5 text-white cursor-pointer'>
                        <FiEdit className='text-white' />
                    </div>
                </div>

                <div className='flex'>
                    <div className='group text-center absolute top-[180px] left-[30px] w-[100px] h-[100px] rounded-full'>
                        {profilephoto.map((item) => (
                            <img src={item.userupdatephoto} className='w-full h-full rounded-full inline-block' />
                        ))}
                        
                    </div>
                    <div>
                        <div>
                            {updateNameShow.map((item) => (
                                <h4 className='text-center font-barlow font-bold text-sm text-fontColor ml-3.5 mt-2.5 absolute top-[205px] left-[134px]'>{item.updateusername}</h4>
                            ))}
                        </div>
                        

                        <div className='group'>
                            <div className='absolute top-[250px] left-[147px] bg-footer py-[2px] px-[40px] rounded'>
                                <button className='font-barlow font-medium text-xs text-fontColor text-white uppercase '>Contact info
                                </button>
                            </div>
                            {contactModal ? (
                                <>
                                    <div className='flex mt-3 '>
                                        <div className='w-full relative'>
                                            <input onChange={(e) => setContactEmail(e.target.value)} className='w-[200px] p-1 border rounded-lg mt-1 absolute top-[100px] left-[147px]' placeholder='Enter Email..' />
                                            <input onChange={(e) => setContactNumber(e.target.value)} className='w-[200px] p-1 border rounded-lg mt-1 absolute top-[140px] left-[147px]' placeholder='Enter Number..' />
                                            <button onClick={handleContactUpdate} className='bg-primary text-xs p-2 rounded-md absolute top-[100px] left-[400px] cursor-pointer'>
                                                <FiSend className='text-white' />
                                            </button>
                                            <button onClick={handleContactCancel} className='bg-primary text-xs text-white p-2 rounded-md absolute top-[140px] left-[400px] cursor-pointer'>
                                                <MdCancel className='text-white' />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className='invisible group-hover:visible absolute top-[310px] left-[147px] bg-footer py-2 px-2 rounded'>
                                    {contactDetails.map((item) => (
                                        <>
                                            <p className='font-barlow font-medium text-xs text-fontColor text-white mb-1'>{item.contactemail}</p>
                                            <p className='font-barlow font-medium text-xs text-fontColor text-white'>{item.contactnumber}</p>
                                        </>
                                    ))}
                                </div>
                            )}

                        </div>
                        <div className='absolute top-[250px] left-[300px] py-[2px] px-[40px] rounded'>
                            <button onClick={handleEditContact} className='font-barlow font-medium text-2xl text-fontColor '><FiEdit className='text-fontColor' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {
                imageModal && (
                    <div className='w-full h-screen bg-footer absolute top-0 left-0 z-50 flex justify-center items-center'>
                        <div className='w-2/4 bg-white rounded-lg p-5'>
                            <h2 className='font-nunito font-bold text-3xl text-header-res'>Upload Your Profile Picture.</h2>
                            <div className='relative w-28 h-28 rounded-full group overflow-hidden mx-auto'>
                                {image ? (
                                    <div className="img-preview w-full h-full rounded-full" />
                                ) : (
                                    <img className='mx-auto cursor-pointer w-full h-full rounded-full' src={auth.currentUser.photoURL} />
                                )}
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
                            <button onClick={handleProfileCancel} className='w-1/4 bg-red-500 rounded-lg font-nunito font-regular text-xs text-white py-5 mt-8 ml-8'>Cancel</button>
                        </div>
                    </div>
                )
            }
            {covermodal && (

                <div className='w-full h-screen bg-footer absolute top-0 left-0 z-50 flex justify-center items-center'>
                    <div className='w-2/4 bg-white rounded-lg p-5'>
                        <h2 className='font-nunito font-bold text-3xl text-header-res'>Upload Your Cover Picture.</h2>
                        <input onChange={handleCoverImage} className='mt-8' type='file' />
                        <br />

                        <button onClick={handleCoverImageSubmit} className='w-1/4 bg-footer rounded-lg font-nunito font-regular text-xs text-white py-5 mt-8'>Upload</button>
                        <button onClick={handleCoverModalCancel} className='w-1/4 bg-red-500 rounded-lg font-nunito font-regular text-xs text-white py-5 mt-8 ml-8'>Cancel</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default Editprofile;