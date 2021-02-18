import React, { useState } from 'react'
import Form from "react-bootstrap/Form"
import ProgressBar from "react-bootstrap/ProgressBar"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import firebase from "../../../firebase";
import { useSelector } from 'react-redux'


function MessageForm() {

    const [content, setcontent] = useState("")
    const [errors, seterrors] = useState([])
    const [loading, setloading] = useState(false)
    const messagesRef = firebase.database().ref("messages")
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const user = useSelector(state => state.user.currentUser)

    const handleChange =(e) => {
        setcontent(e.target.value)
    }

    const createMessage =(fileUrl = null)=>{
        const message = {
            timestamp :firebase.database.ServerValue.TIMESTAMP,
            user: {
                id:user.uid,
                name: user.displayName,
                image:user.photoURL
            }
        }

        if(fileUrl !== null) {
            message["image"] = fileUrl;
        }else{
            message["content"] = content;
        }
        return message;

    }

    const handleSubmit = async ()=>{
        if(!content){
            seterrors(prev=> prev.concat("Type contents first"))
            return;
        }
        setloading(true);
        //firebase 에 저장
        try { 
            await messagesRef.child(chatRoom.id).push().set(createMessage())
            setloading(false)
            setcontent("")
            seterrors([])
        } catch (error) {
            seterrors(pre => pre.concat(error.message))
            setloading(false)
            setTimeout(() => {
                seterrors([])
            }, 5000);
        }
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control
                    value={content}
                    onChange={handleChange}
                    as="textarea" rows={3} />
                </Form.Group>
            </Form>

            <ProgressBar variant="warning" label="60%" now={60} />

            <div>
                {errors.map(errorMsg => <p style={{color:"red"}} key={errorMsg}>{errorMsg}</p>)}
            </div>

            <Row>
                <Col>
                    <button 
                    onClick={handleSubmit}
                    className="message-form-button"
                    style={{width:'100%'}}>
                        SEND
                    </button>
                </Col>
                <Col>
                    <button 
                    className="message-form-button"
                    style={{width:'100%'}}>
                        UPLOAD
                    </button>
                </Col>
            </Row>
        </div>
    )
}

export default MessageForm
