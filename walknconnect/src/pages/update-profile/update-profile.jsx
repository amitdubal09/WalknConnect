import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./update-profile.modules.css";
import WalkerForm from "../../components/walker-form/walker-form.jsx";

export default function UpdateProfile() {
    const [walkerData, setWalkerData] = useState(null);
    const navigate = useNavigate();

    const user = (() => {
        const raw = localStorage.getItem("user");
        return raw && raw !== "undefined" ? JSON.parse(raw) : null;
    })();

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        dob: "",
        address: "",
        gender: "",
        city: "",
        bio: "",
        profile_pic: null,
        aadhar_pic: null,
    });

    // Fetch profile from DB
    useEffect(() => {
        if (!user?.id) {
            navigate("/logreg");
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch(
                    `http://localhost/WalknConnect/walknconnect-backend/profile.php?id=${user.id}`
                );
                const data = await res.json();

                if (data.success) {
                    setProfile(data.profile);

                    // Pre-fill formData
                    setFormData({
                        full_name: data.profile.full_name || user.name || "",
                        email: user.email || "",
                        phone: data.profile.phone || user.phone || "",
                        dob: data.profile.dob || "",
                        address: data.profile.address || "",
                        gender: data.profile.gender || "",
                        city: data.profile.city || "",
                        bio: data.profile.bio || "",
                        profile_pic: null,
                        aadhar_pic: null,
                    });
                } else {
                    alert("Failed to fetch profile");
                }
            } catch (err) {
                console.error(err);
                alert("Server error");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user?.id, navigate]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();
            form.append("id", user.id);

            // Append common profile fields
            Object.keys(formData).forEach((key) => {
                form.append(key, formData[key]);
            });

            // Append walker-specific fields if user is a walker
            if (walkerData) {
                Object.keys(walkerData).forEach((key) => {
                    form.append(key, walkerData[key]);
                });
            }

            const res = await fetch(
                "http://localhost/WalknConnect/walknconnect-backend/profile.php",
                {
                    method: "POST",
                    body: form,
                }
            );

            const data = await res.json();
            if (data.success) {
                alert("Profile updated successfully!");
                localStorage.setItem("user", JSON.stringify(data.profile));
                setProfile(data.profile);
            } else {
                alert(data.message || "Update failed");
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    };


    if (loading) return <div>Loading profile...</div>;

    return (
        <div className="profile-container">
            <div className="profile-wrapper">
                <h2>Update Profile</h2>
                <form className="profile-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        required
                    />
                    <input type="email" name="email" value={formData.email} readOnly />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                        required
                    />
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                    />
                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        required
                    />
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address"
                        required
                    />
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Bio"
                        required
                    />

                    <WalkerForm
                        user={profile}
                        onChange={(data) => setWalkerData(data)}
                    />


                    <label>Profile Picture</label>
                    {profile?.profile_pic && !formData.profile_pic && (
                        <img
                            src={`http://localhost/WalknConnect/walknconnect-backend/uploads/${profile.profile_pic}`}
                            width="100"
                            alt="profile"
                        />
                    )}
                    <input type="file" name="profile_pic" onChange={handleChange} />

                    <label>Aadhaar Card</label>
                    {profile?.aadhar_pic && !formData.aadhar_pic && (
                        <img
                            src={`http://localhost/WalknConnect/walknconnect-backend/uploads/${profile.aadhar_pic}`}
                            width="100"
                            alt="aadhar"
                        />
                    )}
                    <input type="file" name="aadhar_pic" onChange={handleChange} />

                    <button type="submit">Update Profile</button>
                </form>
            </div>
        </div>
    );
}
