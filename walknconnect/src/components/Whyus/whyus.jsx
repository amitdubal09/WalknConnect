import { memo } from 'react';
import './Whyus.modules.css';

const Whyus = () => {
    return (
        <>
            <h1 className='heading'>Why Choose walknConnect?</h1>
            <p id='tagline'>Your safety, motivation, and weliness are our priorities</p>
            <div id="container">
                <div className="section-1">
                    <div className="img-bg">
                        <img src="./public/icon-1.png" alt="" />
                    </div>
                    <span className="whyus-head">Verified Partners</span>
                    <p className='whyus-para'>All partners are background-checked and<br /> verified for your safety</p>
                </div>
                <div className="section-1">
                    <div className="img-bg">
                        <img src="./public/icon-2.png" alt="" />
                    </div>
                    <span className="whyus-head">Local Matches</span>
                    <p className='whyus-para'>Find partners near you for convenient<br />walking sessions</p>
                </div>
                <div className="section-1">
                    <div className="img-bg">
                        <img src="./public/icon-3.png" alt="" />
                    </div>
                    <span className="whyus-head">Flexing Booking</span>
                    <p className='whyus-para'>Book sessions that fit your schedule,<br />anytime</p>
                </div>
            </div>
        </>
    );
};

export default memo(Whyus);