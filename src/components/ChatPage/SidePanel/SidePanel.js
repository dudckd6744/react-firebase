import React from 'react'
import UserPanel from './UserPanel';
import Favorited from './Favorited';
import DiretMessages from './DiretMessages';
import ChatRooms from './ChatRooms';

function SidePanel() {
    return (
        <div
            style={{
                backgroundColor:"#7B83EB",
                padding:'2rem',
                minHeight:'100vh',
                color:'white',
                minWidth:'275px'
            }}
        >
            <UserPanel />

            <Favorited />

            <ChatRooms />

            <DiretMessages />
        </div>
    )
}

export default SidePanel
