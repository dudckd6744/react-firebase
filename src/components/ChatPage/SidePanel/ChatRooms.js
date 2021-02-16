import React, { Component } from 'react';
import {FaRegSmileWink} from 'react-icons/fa';
import {FaPlus} from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from "react-bootstrap/Form"
import { connect } from "react-redux";


export class ChatRooms extends Component {

    state = {
        show:false,
        name :"",
        description:""

    }


    handleClose = () => this.setState({show:false});
    handleShow = () => this.setState({show:true});

    handleSubmit =(e)=>{
        e.prevnetDefault();

        const { name, description} = this.state;

        if(this.isFormValid(name, description)) {   
            this.addChatRoom();
        }
    }
    addChatRoom =()=>{

        const { name, description } = this.state;
        const { user } = this.props


    }

    isFormValid = (name,description) => 
        name && description;


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

                {/* /add chat room modal */}
                

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Create a chat room</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                    <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>방 이름</Form.Label>
                        <Form.Control type="text" placeholder="Enter a chat room name" />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>방 설명</Form.Label>
                        <Form.Control type="text" placeholder="Enter a chat room description" />
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
        user: state.user.currentUser
    }
}

export default connect(mapStateToProps)(ChatRooms) 
