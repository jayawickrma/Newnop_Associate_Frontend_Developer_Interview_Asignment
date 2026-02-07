import React from 'react';
import '../styles/LoadingOverlay.css';

interface LoadingOverlayProps {
    message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Processing...' }) => {
    return (
        <div className="loading-overlay">
            <div className="loading-content">
                <div className="spinner-large"></div>
                <p className="loading-message">{message}</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;