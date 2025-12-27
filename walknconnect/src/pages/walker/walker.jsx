import { useEffect, useState } from "react";
import UserCard from "../../components/card/userCard.jsx";
import "./walker.modules.css";

const Walker = () => {
  const [walkers, setWalkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Get logged-in user
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch("http://localhost/WalknConnect/walknconnect-backend/get-walker.php")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch walkers");
        }
        return res.json();
      })
      .then((result) => {
        if (result.success) {
          setWalkers(result.data);
        } else {
          setError("No walkers found");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load walkers");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading walkers...</p>;
  }

  if (error) {
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  }

  return (
    <div className="walker-page">
      <h2 className="walker-title">Available Walkers</h2>

      {walkers.length === 0 ? (
        <p style={{ textAlign: "center" }}>No walkers available</p>
      ) : (
        <div className="walker-grid">
          {walkers.map((walker) => (
            <UserCard key={walker.id} user={walker} currentUser={loggedInUser} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Walker;
