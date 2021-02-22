import React from 'react'
import SidePanel from './SidePanel/SidePanel';
import MainPanel from './MainPanel/MainPanel';
import { useSelector} from "react-redux";

function ChatPage() {
    const currentUser = useSelector(state => state.user.currentUser)
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)

    return (
        <div style={{display:'flex'}}>
            <div style={{ width:'300px'}}>
                <SidePanel 
                    key={currentUser && currentUser.uid}
                />
            </div>
            <div style={{ width:'100%'}}>
                <MainPanel 
                    key={chatRoom && chatRoom.id}
                />
            </div>
        </div>
    )
}

export default ChatPage
