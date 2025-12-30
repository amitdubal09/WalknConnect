import { memo } from 'react';
import "./header.modules.css";
import { Link } from 'react-router-dom';

const Header = () => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser && storedUser !== "undefined"
        ? JSON.parse(storedUser)
        : null;


    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/logreg"; // Redirect to login page
    };

    return (
        <div className="header">
            <Link to="/" id='hyperlink'>
                <div className="left-nav">
                    <div id="icon">
                        <img src="/icon.png" alt="logo" />
                    </div>
                    <span id='logoname'>walknConnect</span>
                </div>
            </Link>

            <div className="right-nav">
                <Link to="/" className='login'>
                    <button>Home</button>
                </Link>

                <Link to="/about" className='login'>
                    <button>About</button>
                </Link>

                {user && (
                    <Link to='/profile' className='login'>
                        <button>Profile</button>
                    </Link>
                )}

                {/* Show Sign IN/UP only if not logged in */}
                {!user && (
                    <Link to="/logreg" className='register'>
                        <button>Sign IN/UP</button>
                    </Link>
                )}

                {/* Show Logout only if logged in */}
                {user && (
                    <Link onClick={handleLogout} className="register">
                        <button>Logout</button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default memo(Header);
