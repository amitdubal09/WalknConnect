import React, { useEffect, useState } from "react";
import "./profile.modules.css";
import { User, Mail, Phone, Calendar, MapPin, Building2, FileUser, Book } from "lucide-react";
import ProfileForm from "../../components/profile-form/profile-form.jsx"; // or use CreateProfile
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
                `http://localhost/WalknConnect/walknconnect-backend/profile.php?id=${user.id}`
            );
            const data = await res.json();

            if (data.success) {
                setProfile(data.profile);
            } else {
                console.error(data.message);
            }
        } catch (err) {
            console.error("Fetch profile error:", err);
        } finally {
            setLoading(false);
        }
    };


    // CREATE PROFILE
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

    //logic for complete user profile
    const isProfileComplete = (profile) => {
        if (!profile) return false;

        const requiredFields = [
            "full_name",
            "phone",
            "gender",
            "city",
            "dob",
            "address",
            "bio",
            "profile_pic"
        ];

        return requiredFields.every(
            (field) => profile[field] && profile[field].toString().trim() !== ""
        );
    };


    // SHOW CREATE PROFILE BUTTON IF PROFILE NOT EXISTS

    if (!isProfileComplete(profile)) {
        return (
            <div className="profile-container">
                <div className="profile-wrapper center">
                    <h2>Hello {user.name}, Please complete your profile to continue</h2>
                    <button onClick={() => setShowForm(true)}>
                        Create / Complete Profile
                    </button>
                </div>
            </div>
        );
    }


    // SHOW EXISTING PROFILE
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
                        <label className="field-label"><Building2 />City</label>
                        <p className="field-value">{profile.city}</p>
                    </div>
                    <div className="field-group full-width">
                        <label className="field-label"><FileUser /> role</label>
                        <p className="field-value">{profile.role}</p>
                    </div>
                    <div className="field-group full-width">
                        <label className="field-label"><Book />Bio</label>
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
