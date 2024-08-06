import React from 'react';
import '../../assets/css/avatar-group.css';

const AvatarGroup = ({ avatar , name, total,index }) => {
    return (
        <div
            className="avatar"
            style={{ zIndex: total - index }} // ensures the last avatar is on top
        >
            <img src={avatar} alt={name} />
        </div> 
    );
}

export default AvatarGroup;