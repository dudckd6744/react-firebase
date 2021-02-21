import React, { Component } from 'react';
import {FaRegSmileWink} from 'react-icons/fa';
import {FaPlus} from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form"
import { connect } from "react-redux";
import firebase from "../../../firebase";
import {setCurrentChatRoom, setPrivateChatRoom} from "../../../redux/actions/chatRoom_action";
import Badge from "react-bootstrap/Badge";

export class ChatRooms extends Component {

    state = {
        show:false,
        name :"",
        description:"",
        chatRoomsRef: firebase.database().ref("chatRooms"),
        messagesRef: firebase.database().ref("messages"),
        chatRooms: [],
        firstLoad:true,
        activeChatRoomId: "",
        notifications:[]
    }

    componentDidMount(){
        this.AddChatRoomListeners();

    }

    componentWillUnmount(){
        this.state.chatRoomsRef.off();
    }

    setFirstChatRoom = ()=> {
        const firstChatRoom =  this.state.chatRooms[0]
        if(this.state.firstLoad && this.state.chatRooms.length > 0){
            this.props.dispatch(setCurrentChatRoom(firstChatRoom))
            this.setState({activeChatRoomId: firstChatRoom.id})
        }
        this.setState({firstLoad:false})
    }

    AddChatRoomListeners =()=>{
        let chatRoomsArray= [];

        this.state.chatRoomsRef.on("child_added", DataSnapshot=>{
            chatRoomsArray.push(DataSnapshot.val());
            this.setState({chatRooms:chatRoomsArray},
                ()=> this.setFirstChatRoom())

                this.addNotifiCationListner(DataSnapshot.key);
        })
    }

    addNotifiCationListner=(chatRoomId)=>{
        this.state.messagesRef.child(chatRoomId).on("value", DataSnapshot => {
            if(this.props.chatRoom){
                this.handleNotification(
                    chatRoomId,
                    this.props.chatRoom.id,
                    this.state.notifications,
                    DataSnapshot
                )
            }
        })
    }
    handleNotification=(chatRoomId,currentChatRoomId,notifications,DataSnapshot)=>{
        let lastTotal = 0;
        console.log(notifications.id)
        //이미 notifications 스테잇 안에 알림정보가 들어가있는 채팅방과 그렇지않은 채팅방을 나눠주기
        let index =  notifications.findIndex(notification => 
            notification.id===chatRoomId)
            //notifications state 안에 알림정보가 없을때
            if(index === -1){
                notifications.push({
                    id:chatRoomId,
                    total: DataSnapshot.numChildren(),
                    lastKnownTotal:DataSnapshot.numChildren(),
                    count: 0
                })
            } 
            // 이미 해당 채팅방의 알림 정보가 있을대
            else{
            //상대방이 채팅보내는 그 해당 채팅방에 있지 않을때
            if(chatRoomId !== currentChatRoomId){
                //유저가 확인한 총 메세지 개수
                lastTotal = notifications[index].lastKnownTotal  
                //count(알림으로 보여줄 숫자) 를 구하기
                // 현재 총 메세지 개수 - 이전에 확인한 총 메세지 개수 >0
                //현재 총 메세지 개수가 10개 이고 이전에 확인한 메세지 개수가 8개였다면 2개를 알림으로 보여줘야함
                if(DataSnapshot.numChildren() - lastTotal>0){
                    notifications[index].count = DataSnapshot.numChildren() - lastTotal;
                }
            }
            //total property 에 현재 전체 메세지 개수를 넣어주기
                notifications[index].total = DataSnapshot.numChildren();

            }

        //방하나 하나 의 맞는 알림 정보를 notification state 애 넣어주기
        this.setState({notifications})
    }

    handleClose = () => this.setState({show:false});
    handleShow = () => this.setState({show:true});

    handleSubmit =(e)=>{
        e.preventDefault();

        const { name, description} = this.state;

        if(this.isFormValid(name, description)) {   
            this.addChatRoom();
        }
    }
    addChatRoom = async ()=>{

        const key = this.state.chatRoomsRef.push().key;
        const { name, description } = this.state;
        const { user } = this.props
        const newChatRoom = {
            id: key ,
            name: name,
            description: description,
            createdBy: {
                name: user.displayName,
                image: user.photoURL
            }
        }

        try {
            await this.state.chatRoomsRef.child(key).update(newChatRoom)
            this.setState({
                name: "",
                description:"",
                show:false
            })
        }catch(error){
            alert(error)
        }

    }

    isFormValid = (name,description) => 
        name && description;

    changeChatRoom =(room)=>{
        this.props.dispatch(setCurrentChatRoom(room))
        this.props.dispatch(setPrivateChatRoom(false))
        this.setState({activeChatRoomId:room.id})
    }

    getNotificationCount=(room)=>{

        //해당 채티방의 카운트 수를 구하는중
        let count = 0;
        this.state.notifications.forEach(notification => {
            if(notification.id === room.id){
                count = notification.count;
            }
        })
        if( count> 0) return count
    }

    renderChatRooms = (chatRooms) =>
    chatRooms.length > 0 &&
    chatRooms.map((room, i)=>(
        <li
        style={{ backgroundColor: room.id === this.state.activeChatRoomId &&
                                    "#ffffff45"
        }}
        onClick={()=>this.changeChatRoom(room)}
        key={i}>
            # {room.name}
            <Badge style={{float:"right", marginTop:'4px'}} variant="danger">
                {this.getNotificationCount(room)}
            </Badge>
        </li>
    ))

    render() {
        return (
            <div>

                <div style ={{ position:"relative", width:'100%',
                        display:'flex', alignItems:"center"}}>
                <FaRegSmileWink style={{ marginRight: 3}}/>
                CHAT ROOMS {" "} (1)
                <FaPlus 
                onClick={this.handleShow}
                style={{
                    position:'absolute',
                    right: 0, cursor:"pointer"
                }}/>

                </div>
                <ul style={{ listStyleType:"none", padding:0}}>
                    {this.renderChatRooms(this.state.chatRooms)}

                </ul>

                {/* /add chat room modal */}
                

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Create a chat room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                    <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>방 이름</Form.Label>
                        <Form.Control
                        onChange={(e)=> this.setState({name:e.target.value})}
                        type="text" placeholder="Enter a chat room name" />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>방 설명</Form.Label>
                        <Form.Control 
                        onChange={(e)=> this.setState({description:e.target.value})}
                        type="text" placeholder="Enter a chat room description" />
                    </Form.Group>
                    </Form>
                        
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleSubmit}>
                        방 생성
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        user: state.user.currentUser,
        chatRoom: state.chatRoom.currentChatRoom
    }
}

export default connect(mapStateToProps)(ChatRooms) 
