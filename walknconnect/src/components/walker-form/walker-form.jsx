import { useState, memo } from "react";
import "./walker-form.modules.css";

const WalkerForm = ({ user, onChange }) => {
    // 🔒 Render only for walkers
    const role = user?.role || user?.user_type || "";

    if (role.toLowerCase() !== "walker") return null;

    const [formData, setFormData] = useState({
        experience: "",
        walking_speed: "",
        preferred_time: "",
        price_per_hour: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...formData, [name]: value };
        setFormData(updated);
        onChange?.(updated); // send data to parent
    };

    return (
        <div className="walker-form-container">
            <h3>Walker Details</h3>
            <div className="walker-form">
                <input
                    type="number"
                    name="experience"
                    placeholder="Experience (years)"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="walking_speed"
                    placeholder="Walking Speed (e.g. slow / medium / fast)"
                    value={formData.walking_speed}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="preferred_time"
                    placeholder="Preferred Time (Morning / Evening)"
                    value={formData.preferred_time}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="price_per_hour"
                    placeholder="Price per hour (₹)"
                    value={formData.price_per_hour}
                    onChange={handleChange}
                    required
                />
            </div>
        </div>
    );
};

export default memo(WalkerForm);
