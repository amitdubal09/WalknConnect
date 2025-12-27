import { memo } from 'react';
import './footer.modules.css';

const Footer = () => {
    return (
        <>
            <div className="main">
                <div className="left-nav">
                    <div id="icon">
                        <img src="./icon.png" alt="logo" />
                    </div>
                    <span id='logoname'>walknConnect</span>
                </div>
                <div id="footer-span">
                    <span>Connecting people, one step at a time</span><br />
                    <span>@ 2025 WalknConnect. All rights reserved</span>
                </div>
            </div>
        </>
    );
};

export default memo(Footer);