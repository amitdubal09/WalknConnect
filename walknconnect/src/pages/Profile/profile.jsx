import React, { useEffect, useState } from "react";
import "./profile.modules.css";
import { User, Mail, Phone, Calendar, MapPin } from "lucide-react";
import ProfileForm from "../../components/profile-form/profile-form.jsx";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const navigate = useNavigate();
    const storedUser = localStorage.getItem("user");
    const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/logreg");
            return;
        }
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch(
                `http://localhost/WalknConnect/walknconnect-backend/profile.php?user_id=${user.id}`
            );
            const data = await res.json();
            if (data.success) {
                setProfile(data.profile);
            }
        } catch (err) {
            console.error("Fetch profile error:", err);
        } finally {
            setLoading(false);
        }
    };


    // If user clicks "Create Profile" or "Update Profile"
    if (showForm) {
        return (
            <ProfileForm
                user={user}
                profile={profile}
                onSuccess={(updatedProfile) => {
                    setProfile(updatedProfile);
                    setShowForm(false);
                }}
            />
        );
    }

    // Show message if profile doesn't exist or profile_pic is missing
    if (!profile || !profile.profile_pic) {
        return (
            <div className="profile-container">
                <div className="profile-wrapper center">
                    <h2>hiii {user.name},You haven’t created your profile yet</h2>
                    <button onClick={() => setShowForm(true)}>
                        Create Profile
                    </button>
                </div>
            </div>
        );
    }

    // Show profile if it exists
    return (
        <div className="profile-container">
            <div className="profile-wrapper">
                <div className="profile-header">
                    <div className="profile-photo-wrapper">
                        <div className="update-profile-wrapper">
                            <button onClick={() => navigate("/update-profile")}>
                                Update Profile
                            </button>
                        </div>
                        <img
                            src={`http://localhost/WalknConnect/walknconnect-backend/uploads/${profile.profile_pic}`}
                            alt="Profile"
                        />
                        <div className="status-indicator"></div>
                    </div>
                </div>

                <div className="profile-details">
                    <div className="field-group">
                        <label className="field-label"><User /> Full Name</label>
                        <p className="field-value">{profile.full_name}</p>
                    </div>
                    <div className="field-group">
                        <label className="field-label"><Mail /> Email</label>
                        <p className="field-value">{profile.email}</p>
                    </div>
                    <div className="field-group">
                        <label className="field-label"><Phone /> Phone</label>
                        <p className="field-value">{profile.phone}</p>
                    </div>
                    <div className="field-group">
                        <label className="field-label"><Calendar /> Date of Birth</label>
                        <p className="field-value">{profile.dob}</p>
                    </div>
                    <div className="field-group">
                        <label className="field-label">Gender</label>
                        <p className="field-value">{profile.gender}</p>
                    </div>
                    <div className="field-group">
                        <label className="field-label">City</label>
                        <p className="field-value">{profile.city}</p>
                    </div>
                    <div className="field-group full-width">
                        <label className="field-label">Bio</label>
                        <p className="field-value">{profile.bio}</p>
                    </div>
                    <div className="field-group full-width">
                        <label className="field-label"><MapPin /> Address</label>
                        <p className="field-value">{profile.address}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
