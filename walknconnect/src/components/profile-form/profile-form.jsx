import React, { useState } from "react";
import "./profile-form.modules.css";

const ProfileForm = ({ user, profile, userType = "vendor", onSuccess }) => {
    const [formData, setFormData] = useState({
        full_name: profile?.full_name || "",
        email: user?.email || "",
        phone: profile?.phone || "",
        dob: profile?.dob || "",
        address: profile?.address || "",
        gender: profile?.gender || "",
        city: profile?.city || "",
        bio: profile?.bio || "",
        profile_pic: null,
        aadhar_pic: null,
        // Walker extra fields
        experience: profile?.experience || "",
        walking_speed: profile?.walking_speed || "",
        preferred_time: profile?.preferred_time || "",
        price_per_hour: profile?.price_per_hour || "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const form = new FormData();
            Object.keys(formData).forEach(key => form.append(key, formData[key]));
            form.append("user_id", user.id);
            form.append("user_type", userType);

            const res = await fetch("http://localhost/WalknConnect/walknconnect-backend/profile.php", {
                method: "POST",
                body: form,
                credentials: "include",
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch {
                console.error("Invalid JSON:", text);
                alert("Invalid response from server");
                return;
            }

            if (data.success) {
                onSuccess(data.profile);
            } else {
                alert(data.message || "Profile creation failed");
            }

        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-wrapper">
                <h2>{userType === "walker" ? "Create Walker Profile" : "Create Profile"}</h2>
                <form className="profile-form" onSubmit={handleSubmit}>
                    <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full Name" required />
                    <input type="email" name="email" value={formData.email} readOnly />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                    <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" rows="3" required />
                    <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Short Bio" rows="3" required />

                    {/* Walker-specific fields */}
                    {userType === "walker" && (
                        <>
                            <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience (years)" min="0" required />
                            <input type="text" name="walking_speed" value={formData.walking_speed} onChange={handleChange} placeholder="Walking Speed (km/h)" required />
                            <input type="text" name="preferred_time" value={formData.preferred_time} onChange={handleChange} placeholder="Preferred Time" required />
                            <input type="number" name="price_per_hour" value={formData.price_per_hour} onChange={handleChange} placeholder="Price per Hour" min="0" required />
                        </>
                    )}

                    <label>Profile Picture</label>
                    <input type="file" name="profile_pic" accept="image/*" onChange={handleChange} required />
                    <label>Aadhaar Card Image</label>
                    <input type="file" name="aadhar_pic" accept="image/*" onChange={handleChange} required />

                    <button type="submit" disabled={loading}>{loading ? "Saving..." : "Submit Profile"}</button>
                </form>
            </div>
        </div>
    );
};

export default ProfileForm;
