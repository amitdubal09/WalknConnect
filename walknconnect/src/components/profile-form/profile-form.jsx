import React, { useEffect, useState } from "react";
import "./profile-form.modules.css";

const CreateProfile = ({ user, userType = "Vendor", onSuccess }) => {

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
        experience: "",
        walking_speed: "",
        preferred_time: "",
        price_per_hour: "",
    });

    const [loading, setLoading] = useState(false);

    /* ✅ Prefill from registration user */
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                full_name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const form = new FormData();

            // 🔑 REQUIRED
            form.append("id", user.id);
            form.append("user_type", userType);

            // 🔹 Common fields
            form.append("full_name", formData.full_name);
            form.append("phone", formData.phone);
            form.append("dob", formData.dob);
            form.append("address", formData.address);
            form.append("gender", formData.gender);
            form.append("city", formData.city);
            form.append("bio", formData.bio);

            // 🔹 Walker-only fields
            if (userType === "Walker") {
                form.append("experience", formData.experience);
                form.append("walking_speed", formData.walking_speed);
                form.append("preferred_time", formData.preferred_time);
                form.append("price_per_hour", formData.price_per_hour);
            }

            // 🔹 Images
            form.append("profile_pic", formData.profile_pic);
            form.append("aadhar_pic", formData.aadhar_pic);

            const res = await fetch(
                "http://localhost/WalknConnect/walknconnect-backend/profile.php",
                { method: "POST", body: form }
            );

            const data = await res.json();

            if (data.success) {
                alert("Profile created successfully");
                onSuccess?.(data.profile);
            } else {
                alert(data.message || "Profile creation failed");
            }

        } catch (err) {
            console.error(err);
            alert("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-wrapper">
                <h2>Create Profile</h2>

                <form className="profile-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        required
                    />

                    <input
                        type="email"
                        value={formData.email}
                        readOnly
                    />

                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                        required
                    />

                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                    >
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

                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
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
                        placeholder="Short Bio"
                        required
                    />

                    {/* 🧍 Walker Fields */}
                    {userType === "Walker" && (
                        <>
                            <input type="number" name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience (years)" required />
                            <input type="text" name="walking_speed" value={formData.walking_speed} onChange={handleChange} placeholder="Walking Speed" required />
                            <input type="text" name="preferred_time" value={formData.preferred_time} onChange={handleChange} placeholder="Preferred Time" required />
                            <input type="number" name="price_per_hour" value={formData.price_per_hour} onChange={handleChange} placeholder="Price per Hour" required />
                        </>
                    )}

                    <label>Profile Picture</label>
                    <input type="file" name="profile_pic" accept="image/*" onChange={handleChange} required />

                    <label>Aadhaar Card</label>
                    <input type="file" name="aadhar_pic" accept="image/*" onChange={handleChange} required />

                    <button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Create Profile"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateProfile;
