import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Firebase Storage এর জন্য প্রয়োজনীয় import
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth"; 
import app from '../firebase/firebase.config'; 

// কনফিগারেশন
const storage = getStorage(app); 
const API_BASE_URL = "http://localhost:5000/api/users"; 

const ProfilePage = () => {
    const { firebaseUser, userProfile, loading, refetchUserProfile } = useAuth();
    
    // --- স্টেট ম্যানেজমেন্ট ---
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [imageFile, setImageFile] = useState(null); 
    const [uploadProgress, setUploadProgress] = useState(0); 
    const [newPhotoURL, setNewPhotoURL] = useState(''); 

    // ডেটা ইনিশিয়ালাইজেশন লজিক
    // useCallback ব্যবহার করা হলো যেন এটি শুধুমাত্র নির্ভরশীলের পরিবর্তনেই তৈরি হয়
    const initializeProfileData = useCallback(() => {
        if (userProfile || firebaseUser) {
            setName(userProfile?.name || firebaseUser?.displayName || '');
            setPhone(userProfile?.phone || ''); 
            setNewPhotoURL(firebaseUser?.photoURL || userProfile?.photoURL || '');
            setImageFile(null); 
            setUploadProgress(0); 
        }
    }, [userProfile, firebaseUser]);

    // userProfile লোড হলে ডেটা ইনিশিয়ালাইজ করা
    useEffect(() => {
        initializeProfileData();
    }, [initializeProfileData]);


    if (loading) {
        return <div className="text-center p-8">Loading profile data...</div>;
    }

    if (!firebaseUser) {
        return <div className="text-center p-8 text-red-500">Please log in to view your profile.</div>;
    }

    // --- ছবির জন্য ফাইল হ্যান্ডলার (গ্যালারি থেকে সিলেক্ট) ---
    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 2 * 1024 * 1024) {
                toast.error("File size must be less than 2MB.");
                setImageFile(null);
                return;
            }
            setImageFile(file);
            setUploadProgress(0); 
            toast.info(`Image selected: ${file.name}. Click 'Save Changes' to upload.`);
        }
    };
    
    // --- ছবি আপলোড লজিক (Firebase Storage) ---
    const uploadImageToFirebase = (file, toastId) => {
        return new Promise((resolve, reject) => {
            const storageRef = ref(storage, `avatars/${firebaseUser.uid}/${Date.now()}-${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    const roundedProgress = Math.round(progress);
                    setUploadProgress(roundedProgress);
                    // টোস্ট মেসেজে প্রোগ্রেস আপডেট করা
                    if (roundedProgress > 0 && roundedProgress < 100) {
                        toast.loading(`Uploading image... ${roundedProgress}%`, { id: toastId });
                    }
                },
                (error) => {
                    setUploadProgress(0);
                    toast.error("Image upload failed! " + error.message, { id: toastId });
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    // --- ফর্ম সাবমিট হ্যান্ডলার (সেভ চেঞ্জেস) ---
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        
        // **সংশোধিত লজিক:** এখানে isEditing চেকটি বাদ দিলেও চলে, কারণ বাটনটি তখনই দৃশ্যমান যখন isEditing true. 
        // তবে যদি কোনো কারণে ডেটা একই থাকে, আমরা তাও সেভ করার চেষ্টা করব যাতে Firebase Auth এবং MongoDB সিঙ্ক হয়।
        if (!isEditing) return; 

        setIsUpdating(true);
        let finalPhotoURL = newPhotoURL;
        const toastId = toast.loading("Saving changes...", { duration: Infinity }); 

        try {
            // 1. ছবি আপলোড করা
            if (imageFile) {
                finalPhotoURL = await uploadImageToFirebase(imageFile, toastId);
                toast.loading("Image uploaded. Updating profile data...", { id: toastId });
            }

            const token = await firebaseUser.getIdToken(true); 
            
            const updatedData = {
                name,
                phone: phone.trim() || null, 
                photoURL: finalPhotoURL, 
            };
            
            // 2. Firebase User Profile আপডেট করা 
            await updateProfile(firebaseUser, {
                displayName: updatedData.name,
                photoURL: updatedData.photoURL,
            });
            
            // 3. MongoDB/Backend প্রোফাইল আপডেট করা
            const res = await axios.put(
                `${API_BASE_URL}/update-profile`, 
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            if (res.data.success) {
                toast.success('Profile updated successfully!', { id: toastId });
                await refetchUserProfile(); // ডেটা রিফ্রেশ করা
                setIsEditing(false);
            } else {
                toast.error(res.data.error || 'Update failed on backend.', { id: toastId });
            }

        } catch (error) {
            console.error('Update Error:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Failed to update profile.';
            toast.error(`Update Failed: ${errorMessage}`, { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    };
    

    const profileImage = newPhotoURL || "https://via.placeholder.com/150?text=User";
    const role = userProfile?.role ? userProfile.role.toUpperCase() : 'USER';


    return (
        <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg mt-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-2">Your Profile</h2>
            
            <form onSubmit={handleUpdateProfile}> 
                <div className="flex flex-col md:flex-row gap-8">
                    
                    {/* --- Left Side: Profile Picture and Info --- */}
                    <div className="md:w-1/3 flex flex-col items-center">
                        {/* Profile Picture Upload Logic */}
                        <div className="relative group">
                            <img 
                                src={profileImage}
                                alt="Profile Avatar"
                                className="w-36 h-36 rounded-full object-cover border-4 border-blue-500 shadow-md transition duration-300"
                            />
                            {isEditing && (
                                <label 
                                    htmlFor="profile-image-upload" 
                                    className="absolute inset-0 w-36 h-36 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition duration-300"
                                    title="Change Profile Picture (Max 2MB)"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l1.416-2.076A2 2 0 0112.596 3h.808a2 2 0 011.664.89l1.416 2.076A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <input 
                                        id="profile-image-upload" 
                                        type="file" 
                                        className="hidden" 
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        disabled={isUpdating}
                                    />
                                </label>
                            )}
                        </div>
                        
                        {/* Image Upload Status */}
                        {imageFile && !isUpdating && uploadProgress === 0 && (
                            <p className="text-sm mt-2 text-yellow-600 dark:text-yellow-400">
                                *Selected: {imageFile.name}. Save to upload.
                            </p>
                        )}
                        
                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="w-full mt-3">
                                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">Uploading: {uploadProgress}%</div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                            </div>
                        )}

                        {/* Name and Role Display */}
                        <div className="mt-4 text-center">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{name || "N/A"}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{firebaseUser?.email}</p>
                            <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full 
                                ${role === 'ADMIN' ? 'bg-red-100 text-red-700' : 
                                  role === 'MANAGER' ? 'bg-yellow-100 text-yellow-700' : 
                                  'bg-green-100 text-green-700'}`}
                            >
                                ROLE: {role}
                            </span>
                        </div>
                    </div>

                    {/* --- Right Side: Edit/View Form --- */}
                    <div className="md:w-2/3">
                        {/* Edit/Cancel Button (Cancel করার সময় ডেটা রিভার্ট করার লজিক যোগ করা হয়েছে) */}
                        <div className="flex justify-end mb-4">
                            <button 
                                type="button" 
                                onClick={() => {
                                    if (isEditing) {
                                        // Cancel হলে ইনিশিয়াল ডেটা রিভার্ট করা
                                        initializeProfileData(); 
                                    }
                                    setIsEditing(!isEditing);
                                }}
                                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition duration-150"
                            >
                                {isEditing ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                        Cancel Edit
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                        Edit Profile
                                    </>
                                )}
                            </button>
                        </div>

                        
                        <div className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${!isEditing ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>

                            {/* Email (Read-only) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                <input
                                    type="email"
                                    value={firebaseUser?.email || ''}
                                    readOnly
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Number</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className={`mt-1 block w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${!isEditing ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}`}
                                    disabled={!isEditing}
                                    placeholder="Enter contact number"
                                />
                            </div>
                            
                            {/* Address (যদি থাকে, এখন read-only) */}
                            {userProfile?.address && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Address</label>
                                    <textarea
                                        value={userProfile.address}
                                        readOnly
                                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 cursor-not-allowed"
                                        rows="2"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        {isEditing && (
                            <button
                                type="submit"
                                // ছবি আপলোড সম্পূর্ণ না হওয়া পর্যন্ত বাটন ডিসেবল থাকবে
                                disabled={isUpdating || (imageFile && uploadProgress > 0 && uploadProgress < 100)} 
                                className="mt-6 w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-150"
                            >
                                {isUpdating ? 'Saving Changes...' : 'Save Changes'}
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProfilePage;