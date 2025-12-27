import './cards.modules.css';
import { Link } from 'react-router-dom';

const UserCard = ({ user, currentUser }) => {
    // If the current user is a walker and this card belongs to them, don't render
    if (currentUser && currentUser.id === user.id) {
        return null; // hide own card
    }

    const imageUrl = user.profile_pic
        ? `http://localhost/WalknConnect/walknconnect-backend/uploads/${user.profile_pic}`
        : "https://via.placeholder.com/90"; // fallback image

    // Replace '#' with actual profile route
    const profileLink = `/walker/${user.id}`;

    return (
        <Link to={profileLink} className="user-card-link">
            <div className="user-card">
                <div className="user-avatar">
                    <img src={imageUrl} alt={user.full_name} />
                </div>

                <div className="user-info">
                    <h3>{user.full_name}</h3>
                    <p className="user-email">{user.email}</p>

                    <div className="user-details">
                        <span>📞 {user.phone}</span>
                        <span>📍 {user.city}</span>
                    </div>

                    <button className="view-profile-btn">
                        View Profile
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default UserCard;
