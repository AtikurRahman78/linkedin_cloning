import React, { useEffect, useState } from 'react';
import { GrGallery } from 'react-icons/gr';
import { FiSend } from 'react-icons/fi';
import { getDatabase, push, ref, set, onValue } from "firebase/database";
import { useDispatch, useSelector } from 'react-redux';
import { getStorage, ref as sref, uploadBytesResumable, getDownloadURL, uploadString } from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";


const Newpost = () => {

    const db = getDatabase();
    const auth = getAuth();
    const storage = getStorage();

    let [postMessage, setPostMessage] = useState('');
    let [gallerymodal, setGalleryModal] = useState(false);
    let [postimagemessage, setPostImageMessage] = useState('');
    let [postmessageimagestore, setPostMessageImageStore] = useState('');
    let [aboutdatastore, setAboutDataStore] = useState([]);


    let data = useSelector((state) => state.userLoginInfo.userInfo);

    useEffect(() => {
        const aboutstarCountRef = ref(db, 'about/');
        onValue(aboutstarCountRef, (snapshot) => {
            let arr = [];
            snapshot.forEach((item) => {
                if (data.uid == item.val().whosendid) {
                    arr.push(item.val().aboutinfo);
                }
            });
            setAboutDataStore(arr);
        });
    }, []);

    let handlePostSent = () => {
        set(push(ref(db, 'post/')), {
            whosendid: data.uid,
            whosendname: data.displayName,
            post: postMessage,
            userabout: aboutdatastore,
            userimage: data.photoURL,
        }).then(() => {
            setPostMessage('');
        });
    }

    let handlePostImageUpload = (e) => {
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
                    setPostMessageImageStore(downloadURL);
                });
            }
        );
    }

    let handleimagewithmessage = () => {
        set(push(ref(db, 'postimagesmessage/')), {
            whosendid: data.uid,
            whosendname: data.displayName,
            postimagemsg: postimagemessage,
            userabout: aboutdatastore,
            userimage: data.photoURL,
            postimage: postmessageimagestore,
        }).then(() => {
            setGalleryModal(false);
        });
    }

    // Gallery Modal Start

    let handleGallery = () => {
        setGalleryModal(true);
    }

    let handleGarlleryCancel = () => {
        setGalleryModal(false);
    }
    // Gallery Modal End


    return (
        <>
            <div className='bg-white shadow-lg rounded-xl py-4 px-8'>
                <div className='flex border-b border-solid border-[rgba(0,0,0,.25)] pb-2.5 mb-6'>
                    <div>
                        <h3 className='font-open font-semibold text-2xl text-fontColor uppercase'>new post</h3>
                    </div>
                </div>
                <div>
                    <div className='flex mt-3 gap-x-3'>
                        <div className='w-full relative'>
                            <input onChange={(e) => setPostMessage(e.target.value)} value={postMessage} className=' p-3 w-full rounded-lg' placeholder='What’s on your mind?' />
                            <GrGallery onClick={handleGallery} className='absolute top-4 right-14' />
                            <button onClick={handlePostSent} className='bg-primary p-3 rounded-md absolute top-1 right-2'>
                                <FiSend className='text-black text-white' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {gallerymodal && (
                <div className='w-full h-screen bg-footer absolute top-0 left-0 z-50 flex justify-center items-center'>
                    <div className='w-2/4 bg-white rounded-lg p-5'>
                        <h2 className='font-nunito font-bold text-3xl text-header-res'>New Post.</h2>
                        <input onChange={(e) => setPostImageMessage(e.target.value)} className=' p-3 w-full rounded-lg mt-4' placeholder='What’s on your mind?' />
                        <input onChange={handlePostImageUpload} className='mt-8' type='file' />
                        <br />

                        <button onClick={handleimagewithmessage} className='w-1/4 bg-footer rounded-lg font-nunito font-regular text-xs text-white py-5 mt-8'>Upload</button>
                        <button onClick={handleGarlleryCancel} className='w-1/4 bg-red-500 rounded-lg font-nunito font-regular text-xs text-white py-5 mt-8 ml-8'>Cancel</button>
                    </div>
                </div>
            )}

        </>
    )
}

export default Newpost;