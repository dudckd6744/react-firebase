import { FaRegSmile } from 'react-icons/fa'
import React, { Component } from 'react'
import firebase from "../../../firebase";
import {connect} from "react-redux";

export class Favorited extends Component {

    state={
        usersRef : firebase.database().ref("users"),
        favoritedChatRoom:[]
    }

    componentDidMount(){
        if(this.props.user){
            this.addListners(this.props.user.uid)
        }
    }

    addListners=(userId)=>{
        const { usersRef } = this.state;

        usersRef
        .child(userId)
        .child("favorited")
        .on("child_added", DataSnapshot=> {
            const favoritedChatRoom ={id : DataSnapshot.key, ...DataSnapshot.val()}
            this.setState({
                favoritedChatRoom: [...this.state.favoritedChatRoom,favoritedChatRoom ]
            })
        })

        usersRef
        .child(userId)
        .child("favorited")
        .on("child_removed", DataSnapshot => {
            const chatRoomToRemove = {id : DataSnapshot.key, ...DataSnapshot.val()}
            const filteredChatRooms = this.state.favoritedChatRoom.filter(chatRoom=> {
                return chatRoom.id !== chatRoomToRemove.id
        })
        this.setState({favoritedChatRoom:filteredChatRooms})
    })
    }

    renderFavoritedChatRooms=(favoritedChatRoom)=>{
        favoritedChatRoom.length>0 &&
        favoritedChatRoom.map(chatRoom => (
            <li 
                key={chatRoom.id}
            >
                # {chatRoom.name}
            </li>
        ))
    }

    render() {
        const {favoritedChatRoom} = this.state
        return (
            <div>
            <span style={{display:'flex', alignItems:'center'}}>
                <FaRegSmile style={{marginRight:'3px'}} />
                FAVORITED (1)
            </span>
            <ul style={{ listStyleType:'none', padding:'0'}}>
                {this.renderFavoritedChatRooms(favoritedChatRoom)}
            </ul>
        </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        user: state.user.currentUser
    }
}
export default connect(mapStateToProps)(Favorited);
