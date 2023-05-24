import React, { useEffect, useState } from 'react';
import { GrEdit } from 'react-icons/gr';
import { FiEdit, FiSend } from 'react-icons/fi';
import { MdCloudUpload, MdCancel } from 'react-icons/md';
import { getAuth, updateProfile, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLoginInfo } from '../slices/userSlice';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getStorage, ref, uploadString, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { getDatabase, ref as sref, onValue, set, push, remove } from "firebase/database";

const Profile = () => {

    const db = getDatabase();
    const auth = getAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const storage = getStorage();

    const [image, setImage] = useState('');
    const [cropData, setCropData] = useState("#");
    const [cropper, setCropper] = useState();

    let data = useSelector((state) => state.userLoginInfo.userInfo);

    let [imageModal, setImageModal] = useState(false);
    let [editnameshow, setEditNameShow] = useState(false);
    let [updateName, setUpdateName] = useState('');
    let [updateNameShow, setUpdateNameShow] = useState([]);
    let [abouteModal, setAboutModal] = useState(false);
    let [aboutupdate, setAboutUpdate] = useState('');
    let [aboutdatastore, setAboutDataStore] = useState([]);
    let [covermodal, setCoverModal] = useState(false);
    let [coverImage, setCoverImage] = useState('');
    let [coverImageStore, setCoverImageStore] = useState([]);
    let [profilephoto, setProfilePhoto] = useState([]);
    let [aboutshow, setAboutShow] = useState([]);


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
                    set(sref(db, 'userprofileupdatephoto/' + data.uid), {
                        userupdatephoto: downloadURL,
                        whosendid: data.uid,
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

    let handleNameEdit = () => {
        console.log('Alhamdulliah')
        setEditNameShow(true);

    }
    let handleEditModal = () => {
        setEditNameShow(false);

    }

    // let handleUpdateName = (e) => {
    //     onAuthStateChanged(auth, (user) => {
    //         updateProfile(auth.currentUser, {
    //             displayName: updateName,
    //         })
    //         user.displayName = updateName;
    //         dispatch(userLoginInfo(user));
    //         localStorage.setItem('userInfo', JSON.stringify(user));
    //         setEditNameShow(false);
    //     });
    // }

    let handleUpdateName = (e) => {
        set(sref(db, 'updateusername/' + data.uid), {
            updateusername: updateName,
            whosendid: data.uid,
        }).then(() => {
            setEditNameShow(false);
        });
        console.log('update user name', updateName)

    }

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

    let handleAbout = () => {
        setAboutModal(true);
    }

    // let handleUpdateAbout = () => {
    //     console.log('About details', data.uid)
    //     remove(sref(db, 'about/' + data.uid))
    //     set(sref(db, 'about/' + data.uid), {
    //         aboutinfo: aboutupdate,
    //         whosendid: data.uid,
    //     }).then(() => {
    //         setAboutModal(false);
    //     });

    // }

    let handleUpdateAbout = () => {
        console.log('About details all information', aboutupdate)
        // remove(sref(db, 'about/' + data.uid))
        set(sref(db, 'aboutinformation/' + data.uid), {
            aboutdetails: aboutupdate,
            whosendid: data.uid,
        }).then(() => {
            setAboutModal(false);
        });

    }

    useEffect(() => {
        const aboutstarCountRef = sref(db, 'aboutinformation/');
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

    let handleCancelModal = () => {
        setAboutModal(false);
    }

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

    return (
        <>
            <div className='w-full h-[50%] relative '>
                <div className='w-full h-full'>
                    {coverImageStore.map((item) => (
                        <img className='w-full h-full object-cover' src={item.coverimage} />
                    ))}
                    <div onClick={handleCoverPictureModal} className='absolute top-1.5 right-1.5 text-white cursor-pointer'>
                        <FiEdit className='text-white' />
                    </div>
                </div>

                <div className='group text-center absolute top-[130px] left-[134px] w-[100px] h-[100px] rounded-full'>
                    {profilephoto.map((item) => (
                        <img src={item.userupdatephoto} className='w-full h-full rounded-full inline-block' />
                    ))}
                    <div onClick={handleProfilePicture} className='w-full h-full opacity-0 group-hover:opacity-100 cursor-pointer rounded-full bg-[rgba(0,0,0,.4)] absolute top-0 left-0 flex justify-center items-center'>
                        <MdCloudUpload className='text-white text-xl' />
                    </div>
                </div>
                <div>
                    {editnameshow ? (
                        <>
                            <div className='flex mt-3 '>
                                <div className='w-full relative'>
                                    <input onChange={(e) => setUpdateName(e.target.value)} className='w-[200px] p-1 border rounded-lg ml-[-80px] mt-1 absolute top-[30px] left-[134px]' placeholder='Chane Profile Name..' />
                                    <button onClick={handleUpdateName} className='bg-primary text-xs p-2 rounded-md absolute top-[36px] right-10 cursor-pointer'>
                                        <FiSend className='text-white' />
                                    </button>
                                    <button onClick={handleEditModal} className='bg-primary text-xs text-white p-2 rounded-md absolute top-[36px] right-2 cursor-pointer'>
                                        <MdCancel className='text-white' />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {updateNameShow.map((item) => (
                                <h4 className='text-center font-barlow font-bold text-sm text-fontColor ml-8 mt-2.5 absolute top-[242px] left-[134px] group'>{item.updateusername}</h4>
                            ))}
                            <GrEdit onClick={handleNameEdit} className='text-center font-barlow font-bold text-sm text-fontColor ml-3.5 mt-2.5 absolute top-[245px] right-[5px] cursor-pointer' />
                        </>
                    )}
                </div>
                <div className='w-full text-center absolute top-[270px]'>
                    {abouteModal ? (
                        <>
                            <div className='flex mt-3 '>
                                <div className='w-full relative'>
                                    <input onChange={(e) => setAboutUpdate(e.target.value)} className='w-[200px] p-1 border rounded-lg ml-[-80px] mt-1 absolute top-[30px] left-[134px]' placeholder='Change About..' />
                                    <button onClick={handleUpdateAbout} className='bg-primary text-xs p-2 rounded-md absolute top-[36px] right-10 cursor-pointer'>
                                        <FiSend className='text-white' />
                                    </button>
                                    <button onClick={handleCancelModal} className='bg-primary text-xs text-white p-2 rounded-md absolute top-[36px] right-2 cursor-pointer'>
                                        <MdCancel className='text-white' />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {aboutshow.map((item) => (
                                <p className='w-[240px] m-auto font-barlow font-normal text-xs text-fontColor mt-4'>{item.aboutdetails
                                }</p>
                            ))}

                            <GrEdit onClick={handleAbout} className='text-center font-barlow font-bold text-sm text-fontColor ml-3.5 mt-2.5 absolute top-[10px] right-[5px] cursor-pointer' />
                        </>
                    )}
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

export default Profile;