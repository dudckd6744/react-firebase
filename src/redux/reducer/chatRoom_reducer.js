import {
    SET_CURRENT_CHAT_ROOM,
    SET_PRIVATE_CHAT_ROOM,
    SET_USER_POSTS  
} from "../actions/types";

const initialChatRoomState = {
    currentChatRoom:null,
    IsPrivateChatRoom: false
}


export default function(state = initialChatRoomState, action){
    switch(action.type) {
        case SET_CURRENT_CHAT_ROOM:
            return {
                ...state,
                currentChatRoom: action.payload
            }
        case SET_PRIVATE_CHAT_ROOM:
            return {
                ...state,
                IsPrivateChatRoom: action.payload
            }
        case SET_USER_POSTS:
            return {
                ...state,
                userPosts: action.payload
            }
        
        default:
            return state;
    }
}