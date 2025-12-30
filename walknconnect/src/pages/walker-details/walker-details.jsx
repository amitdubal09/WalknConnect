import { memo, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../walker-details/walker-details.modules.css";

const API_URL = "http://localhost/WalknConnect/walknconnect-backend";

const WalkerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [walker, setWalker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  // Get logged-in user from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  // Fetch walker details
  useEffect(() => {
    const fetchWalker = async () => {
      try {
        const res = await fetch(`${API_URL}/profile.php?id=${id}`);
        const data = await res.json();
        if (data.success) setWalker(data.profile);
        else {
          alert("Walker not found");
          navigate("/");
        }
      } catch (err) {
        console.error(err);
        alert("Server error");
      } finally {
        setLoading(false);
      }
    };
    fetchWalker();
  }, [id, navigate]);

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_URL}/review.php?walker_id=${id}`);
      const data = await res.json();
      if (data.success) setReviews(data.reviews);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  // Submit review
  const submitReview = async () => {
    if (!user) return alert("Please login to submit a review");
    if (!rating) return alert("Please select rating");

    try {
      const res = await fetch(`${API_URL}/review.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walker_id: id,
          user_id: user.id, // use logged-in user's id from localStorage
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRating("");
        setComment("");
        fetchReviews();
        alert("Review added!");
      } else {
        alert(data.message || "Failed to add review");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    }
  };

  if (loading) return <div className="walker-loading">Loading walker...</div>;
  if (!walker) return null;

  return (
    <>
      <div id="back-btn">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <div className="walker-details-container">
        <div className="walker-card">
          <img
            src={`${API_URL}/uploads/${walker.profile_pic}`}
            alt={walker.full_name}
            className="walker-img"
          />

          <div className="walker-info">
            <h2>{walker.full_name}</h2>
            <p className="city">{walker.city}</p>

            <div className="info-grid">
              <p><strong>Gender:</strong> {walker.gender}</p>
              <p><strong>Phone:</strong> {walker.phone}</p>
              <p><strong>Experience:</strong> {walker.experience} years</p>
              <p><strong>Walking Speed:</strong> {walker.walking_speed}</p>
              <p><strong>Preferred Time:</strong> {walker.preferred_time}</p>
              <p><strong>Price / Hour:</strong> ₹{walker.price_per_hour}</p>
            </div>

            <div className="bio">
              <h4>About</h4>
              <p>{walker.bio}</p>
            </div>

            <button className="book-btn">Book Walker</button>
          </div>
        </div>
      </div>

      <div className="review-section">
        <h3>Reviews</h3>

        {/* Add review */}
        {user && (
          <div className="add-review">
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="">Rate Walker</option>
              <option value="1">⭐ 1</option>
              <option value="2">⭐⭐ 2</option>
              <option value="3">⭐⭐⭐ 3</option>
              <option value="4">⭐⭐⭐⭐ 4</option>
              <option value="5">⭐⭐⭐⭐⭐ 5</option>
            </select>
            <textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button onClick={submitReview}>Submit Review</button>
          </div>
        )}

        {/* Show reviews */}
        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          reviews.map((r, i) => (
            <div key={i} className="review-card">
              <div className="review-header">
                <strong>{r.user_name}</strong>
                <span>{"⭐".repeat(r.rating)}</span>
              </div>
              <p className="review-comment">{r.comment}</p>
              <small>{new Date(r.created_at).toLocaleDateString()}</small>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default memo(WalkerDetails);
