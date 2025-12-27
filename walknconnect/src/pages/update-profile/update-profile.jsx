import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import "../Profile/profile.jsx"
import "../update-profile/update-profile.modules.css";

export default function UpdateProfile() {
    const navigate = useNavigate();
    const storedUser = localStorage.getItem("user");
    const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

    const [formData, setFormData] = useState({
        full_name: "",
        dob: "",
        phone: "",
        address: "",
        gender: "",
        city: "",
        bio: "",
        profile_pic: null,
        aadhar_pic: null,
        existingProfilePic: "",
        existingAadharPic: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        const fetchProfile = async () => {
            try {
                const res = await fetch(`http://localhost/WalknConnect/walknconnect-backend/profile.php?user_id=${user.id}`);
                const data = await res.json();
                if (data.success) {
                    const p = data.profile;
                    setFormData({
                        full_name: p.full_name || "",
                        dob: p.dob || "",
                        phone: p.phone || "",
                        address: p.address || "",
                        gender: p.gender || "",
                        city: p.city || "",
                        bio: p.bio || "",
                        profile_pic: null,
                        aadhar_pic: null,
                        existingProfilePic: p.profile_pic || "",
                        existingAadharPic: p.aadhar_pic || "",
                    });
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!user) return;

        try {
            const form = new FormData();
            form.append("user_id", user.id);
            form.append("full_name", formData.full_name);
            form.append("dob", formData.dob);
            form.append("phone", formData.phone);
            form.append("address", formData.address);
            form.append("gender", formData.gender);
            form.append("city", formData.city);
            form.append("bio", formData.bio);

            formData.profile_pic ? form.append("profile_pic", formData.profile_pic) : form.append("existingProfilePic", formData.existingProfilePic);
            formData.aadhar_pic ? form.append("aadhar_pic", formData.aadhar_pic) : form.append("existingAadharPic", formData.existingAadharPic);

            const res = await fetch("http://localhost/WalknConnect/walknconnect-backend/profile.php", { method: "POST", body: form, credentials: "include" });
            const data = await res.json();

            if (data.success) {
                alert("Profile updated successfully!");
                navigate("/profile");
            } else {
                alert(data.message || "Update failed");
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

            <button onClick={() => navigate("/profile")}id="btn"><ChevronLeft /> Go To Profile</button>

            <div className="profile-wrapper">
                <h2>Update Your Profile</h2>
                <form className="profile-form" onSubmit={handleSubmit}>
                    <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                    <textarea name="address" value={formData.address} onChange={handleChange} rows="3" required />
                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                    <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" required />

                    <label>Profile Picture</label>
                    {formData.existingProfilePic && !formData.profile_pic && <img src={`http://localhost/WalknConnect/walknconnect-backend/uploads/${formData.existingProfilePic}`} alt="Existing profile" width="100" />}
                    <input type="file" name="profile_pic" accept="image/*" onChange={handleChange} />

                    <label>Aadhaar Card Image</label>
                    {formData.existingAadharPic && !formData.aadhar_pic && <img src={`http://localhost/WalknConnect/walknconnect-backend/uploads/${formData.existingAadharPic}`} alt="Existing aadhar" width="100" />}
                    <input type="file" name="aadhar_pic" accept="image/*" onChange={handleChange} />

                    <button type="submit" disabled={loading}>{loading ? "Updating..." : "Update Profile"}</button>
                </form>
            </div>
        </div>
    );
}
