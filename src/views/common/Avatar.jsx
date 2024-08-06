// Avatar.js
import React from 'react';
import '../../assets/css/avatar.css';

const Avatar = ({ name }) => {
  // Extract initials from the name
    const initials = name
        .split(' ')
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase();
    
    const generateColorFromName = (name) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        // Convert hash to a color (e.g., hex format)
        const color = `#${(hash & 0x00FFFFFF).toString(16).padStart(6, '0')}`;
        return color;
    };
    
    const displayText = initials.length === 1
        ? name.substring(0, 2).toUpperCase()
        : initials;

    return (
        <div className="user-item">
            <div className="avatar" style={{ backgroundColor: generateColorFromName(name) }}>
                {displayText}
            </div>
        </div>
    );
};

export default Avatar;
