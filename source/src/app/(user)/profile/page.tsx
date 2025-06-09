"use client"

import React, { useState } from 'react';
import { User, Video, Trash2 } from 'lucide-react';
import VideoCard from "@/app/(user)/_components/video-card";

type VideoProps = {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    source: string;
    duration: number;
    author: {
        name: string;
        id: number;
        username: string;
        avatar: string;
    }
}

export default function UserProfileApp(){
    const [currentPage, setCurrentPage] = useState('profile');
    const [activeTab, setActiveTab] = useState('my-videos');
    const [userProfile, setUserProfile] = useState({
        firstName: 'Victoria',
        lastName: 'Johnson',
        username: 'vjohnson',
        bio: '✨ I create AI-generated videos',
        instagram: 'instagram.com/vjohnson',
        twitter: '',
        youtube: '',
        followers: '1.2k',
        following: '180',
        videos: '36'
    });

    // Sample video data
    const VIDEO_LIST = [
        {
            id: 1,
            title: "AI Portraits",
            description: "A collection of AI-generated portraits.",
            thumbnail:
                "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
            source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
            duration: 324,
            views: 123456,
            author: {
                id: 1,
                name: "John Doe",
                username: "johndoe",
                avatar: "https://example.com/john-doe.jpg",
            },
        },
        {
            id: 2,
            title: "AI Portraits",
            description: "A collection of AI-generated portraits.",
            thumbnail:
                "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
            source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
            duration: 324,
            views: 123456,
            author: {
                id: 1,
                name: "John Doe",
                username: "johndoe",
                avatar: "https://example.com/john-doe.jpg",
            },
        },
        {
            id: 3,
            title: "AI Portraits",
            description: "A collection of AI-generated portraits.",
            thumbnail:
                "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
            source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
            duration: 324,
            views: 123456,
            author: {
                id: 1,
                name: "John Doe",
                username: "johndoe",
                avatar: "https://example.com/john-doe.jpg",
            },
        },
        {
            id: 4,
            title: "AI Portraits",
            description: "A collection of AI-generated portraits.",
            thumbnail:
                "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
            source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
            duration: 324,
            views: 123456,
            author: {
                id: 1,
                name: "John Doe",
                username: "johndoe",
                avatar: "https://example.com/john-doe.jpg",
            },
        },
        {
            id: 5,
            title: "AI Portraits",
            description: "A collection of AI-generated portraits.",
            thumbnail:
                "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
            source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
            duration: 324,
            views: 123456,
            author: {
                id: 1,
                name: "John Doe",
                username: "johndoe",
                avatar: "https://example.com/john-doe.jpg",
            },
        },
        {
            id: 6,
            title: "AI Portraits",
            description: "A collection of AI-generated portraits.",
            thumbnail:
                "https://plus.unsplash.com/premium_photo-1747633943306-0379c57c22dd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1fHx8ZW58MHx8fHx8",
            source: "https://cdn.pixabay.com/video/2025/03/11/263962_large.mp4",
            duration: 324,
            views: 123456,
            author: {
                id: 1,
                name: "John Doe",
                username: "johndoe",
                avatar: "https://example.com/john-doe.jpg",
            },
        },
    ];

    const editingVideos = [
        { id: 1, title: 'Future City Concepts', timeAgo: '28 minutes ago' },
        { id: 2, title: 'Future City Concepts', timeAgo: '28 minutes ago' },
        { id: 3, title: 'Future City Concepts', timeAgo: '28 minutes ago' },
        { id: 4, title: 'Future City Concepts', timeAgo: '28 minutes ago' }
    ];

    const handleProfileUpdate = (updatedProfile: React.SetStateAction<{ firstName: string; lastName: string; username: string; bio: string; instagram: string; twitter: string; youtube: string; followers: string; following: string; videos: string; }>) => {
        setUserProfile(updatedProfile);
        setCurrentPage('profile');
    };

    const VideoGrid = ({ videos }: {videos: VideoProps}) => (
        <div className="grid grid-cols-4 gap-4 mt-6">
            {videos.map((video:VideoProps) => (
                <VideoCard key={video.id} video={video} />
            ))}
        </div>
    );

    const EditingTable = () => (
        <div className="mt-6">
            {editingVideos.map((video) => (
                <div key={video.id} className="flex items-center justify-between py-4 border-b border-zinc-800">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-8 bg-zinc-800 rounded flex items-center justify-center">
                            <Video className="w-4 h-4 text-zinc-400" />
                        </div>
                        <span className="text-white font-medium">{video.title}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-zinc-400 text-sm">{video.timeAgo}</span>
                        <button className="text-zinc-400 hover:text-white transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    const ProfilePage = () => (
        <div className="min-h-screen text-white mb-10">
            <div className="mx-auto">
                {/* Profile Header */}
                <div className="flex items-center space-x-6 mb-8">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                        <User className="w-12 h-12 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                            <h1 className="text-2xl font-bold">{userProfile.firstName} {userProfile.lastName}</h1>
                            <button
                                onClick={() => setCurrentPage('edit')}
                                className="px-4 py-1.5 border border-zinc-600 rounded-lg text-sm hover:bg-zinc-800 transition-colors"
                            >
                                Edit Profile
                            </button>
                        </div>
                        <p className="text-zinc-400 mb-4">@{userProfile.username}</p>
                        <div className="flex space-x-8 mb-4">
                            <div className="text-center">
                                <div className="font-bold">{userProfile.followers}</div>
                                <div className="text-zinc-400 text-sm">Followers</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold">{userProfile.following}</div>
                                <div className="text-zinc-400 text-sm">Following</div>
                            </div>
                            <div className="text-center">
                                <div className="font-bold">{userProfile.videos}</div>
                                <div className="text-zinc-400 text-sm">Videos</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bio and Links */}
                <div className="mb-8">
                    <p className="text-white mb-2">{userProfile.bio}</p>
                    {userProfile.instagram && (
                        <div className="flex items-center space-x-2 text-zinc-400">
                            {/*<Instagram className="w-4 h-4" />*/}
                            <span className="text-sm">{userProfile.instagram}</span>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="border-b border-zinc-800 mb-6">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('my-videos')}
                            className={`pb-4 text-sm font-medium ${
                                activeTab === 'my-videos'
                                    ? 'text-white border-b-2 border-white'
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            My Videos
                        </button>
                        <button
                            onClick={() => setActiveTab('liked-videos')}
                            className={`pb-4 text-sm font-medium ${
                                activeTab === 'liked-videos'
                                    ? 'text-white border-b-2 border-white'
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            Liked Videos
                        </button>
                        <button
                            onClick={() => setActiveTab('editing-videos')}
                            className={`pb-4 text-sm font-medium ${
                                activeTab === 'editing-videos'
                                    ? 'text-white border-b-2 border-white'
                                    : 'text-zinc-400 hover:text-white'
                            }`}
                        >
                            Editing Videos
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'my-videos' && <VideoGrid videos={VIDEO_LIST} />}
                {activeTab === 'liked-videos' && <VideoGrid videos={VIDEO_LIST} />}
                {activeTab === 'editing-videos' && <EditingTable />}
            </div>
        </div>
    );

    const EditProfilePage = () => {
        const [formData, setFormData] = useState(userProfile);

        const handleInputChange = (field: string, value: string) => {
            setFormData(prev => ({ ...prev, [field]: value }));
        };

        const handleSave = () => {
            handleProfileUpdate(formData);
        };

        const handleCancel = () => {
            setFormData(userProfile);
            setCurrentPage('profile');
        };

        return (
            <div className="min-h-screen text-white mb-10">
                <div className="max-w-6xl mx-auto p-6">
                    <h1 className="text-2xl font-bold mb-8">Edit Profile</h1>

                    <div className="bg-zinc-900 rounded-lg p-6">
                        {/* Profile Picture */}
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                                <User className="w-10 h-10 text-white" />
                            </div>
                            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors">
                                Change
                            </button>
                        </div>

                        {/* Basic Information */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4">Basic information</h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">First Name</label>
                                    <input
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
                                />
                            </div>
                        </div>

                        {/* Social Network Links */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-4">Social network link</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Instagram</label>
                                    <input
                                        type="text"
                                        value={formData.instagram}
                                        onChange={(e) => handleInputChange('instagram', e.target.value)}
                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Twitter</label>
                                    <input
                                        type="text"
                                        value={formData.twitter}
                                        onChange={(e) => handleInputChange('twitter', e.target.value)}
                                        placeholder="Enter your Twitter URL"
                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500 placeholder-zinc-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">YouTube</label>
                                    <input
                                        type="text"
                                        value={formData.youtube}
                                        onChange={(e) => handleInputChange('youtube', e.target.value)}
                                        placeholder="Enter your Youtube URL"
                                        className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-purple-500 placeholder-zinc-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleCancel}
                                className="px-6 py-2 border border-zinc-600 rounded-lg hover:bg-zinc-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                            >
                                Change
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            {currentPage === 'profile' && <ProfilePage />}
            {currentPage === 'edit' && <EditProfilePage />}
        </div>
    );
};