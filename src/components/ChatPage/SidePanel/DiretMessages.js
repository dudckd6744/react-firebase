import React, { Component } from 'react'
import {FaRegSmile} from "react-icons/fa";
import firebase from "../../../firebase";
import {connect} from "react-redux"
import { setCurrentChatRoom ,setPrivateChatRoom} from "../../../redux/actions/chatRoom_action"

export class DiretMessages extends Component {

    state={
        usersRef : firebase.database().ref("users"),
        users:[],
        activeChatRoom: ""
    }

    componentDidMount() {
        if(this.props.user)
        this.addUsersListner(this.props.user.uid)
    }

    addUsersListner = (currentUserId) =>{
        const { usersRef } = this.state;
        let usersArray =[];
        usersRef.on("child_added", DataSnapshot => {
            if(currentUserId !== DataSnapshot.key) {
                let user = DataSnapshot.val()
                // console.log("datasnap",DataSnapshot.val())
                user["uid"] = DataSnapshot.key
                user["state"] = "offline";
                usersArray.push(user)
                this.setState({ users: usersArray})
            }
        })
    }

    getChatRoomId=(userId)=>{
        const currentUserId = this.props.user.uid

        return userId > currentUserId
            ? `${userId}/${currentUserId}`
            :`${currentUserId}/${userId}`
    }

    handleChangeChat =(user)=>{
        const chatRoomId =this.getChatRoomId(user.uid);
        const chatRoomData = {
            id : chatRoomId,
            name: user.name
        }

        this.props.dispatch(setCurrentChatRoom(chatRoomData))
        this.props.dispatch(setPrivateChatRoom(true))
        this.setActiveChatRoom(user.uid);
    }

    setActiveChatRoom =(userId)=>{
        this.setState({ activeChatRoom:userId})
    }

    renderDirectMessages = (users) =>
        users.length > 0 &&
        users.map(user => (
            <li key={user.uid} 
            style={{
                backgroundColor:user.uid === this.state.activeChatRoom && "#ffffff45"
            }}
            onClick={()=>this.handleChangeChat(user)}>
                # {user.name}
            </li>
        ))
    

    render() {
            const { users } = this.state;
        return (
            <div>
                <span style={{ display:'flex', alignItems:'center'}}>
                    <FaRegSmile style={{marginRight: 3}} /> DIRECT MESSAGES(1)
                </span>

                <ul style={{ listStyleType:'none', padding: 0}}>
                    
                {this.props.user &&
                this.renderDirectMessages(users)}

                    
                </ul>
            </div>
        )
    }
}
const mapStateToProps = state =>{
    return{
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(DiretMessages);
