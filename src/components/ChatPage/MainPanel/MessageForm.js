import React, { useState, useRef } from 'react'
import Form from "react-bootstrap/Form"
import ProgressBar from "react-bootstrap/ProgressBar"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import firebase from "../../../firebase";
import { useSelector } from 'react-redux'
import mime from "mime-types";


function MessageForm() {

    const [content, setcontent] = useState("")
    const [errors, seterrors] = useState([])
    const [loading, setloading] = useState(false)
    const [percentage, setpercentage] = useState(0)
    const messagesRef = firebase.database().ref("messages")
    const chatRoom = useSelector(state => state.chatRoom.currentChatRoom)
    const user = useSelector(state => state.user.currentUser)
    const inputOpenImageRef = useRef();
    const storageRef = firebase.storage().ref();
    const typingRef = firebase.database().ref("typing");
    const IsPrivateChatRoom = useSelector(state => state.chatRoom.IsPrivateChatRoom)

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
            typingRef.child(chatRoom.id).child(user.uid).remove();
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

    const handleOpenImgaeRef =()=>{
        inputOpenImageRef.current.click()
    }

    const getPath =()=>{
        if(IsPrivateChatRoom){
            return `/message/private/${chatRoom.id}`
        }else{
            return `/message/public`
        }
    }

    const handleUploadImage = async (e)=>{
        const file = e.target.files[0];

        const filePath = `${getPath()}/${file.name}`;
        const metadata = { contentType: mime.lookup(file.name)}
        setloading(true)
        try {
            //ㅠ파일 스토리지에 저장 
            let uploadTask =  storageRef.child(filePath).put(file, metadata)

            //파일 저장되는 퍼센테이지 구하기
            uploadTask.on("state_changed", 
                UploadTaskSnapshot => {
                    const percentage = Math.round(
                        (UploadTaskSnapshot.bytesTransferred / UploadTaskSnapshot.totalBytes)*100
                    )
                    console.log(percentage)
                    setpercentage(percentage) 
            },
            err => {
                console.error(err);
                setloading(false)
            },
            ()=> {
                    //저장이 다된후에 파일 메세지전송(db에저장)
                    //저장된 파일을 다운 받을수있는 URL 가져오기
                    uploadTask.snapshot.ref.getDownloadURL()
                    .then(downloadURL =>{
                        messagesRef.child(chatRoom.id).push().set(createMessage(downloadURL))
                        setloading(false)
                    })
            }
            )
        } catch (error) {
            alert(error)
        }
    }

    const handleKeyDown =()=>{
        if(content){
            typingRef.child(chatRoom.id).child(user.uid).set(user.displayName)
        }else{
            typingRef.child(chatRoom.id).child(user.uid).remove();
        }
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control
                    onKeyDown={handleKeyDown}
                    value={content}
                    onChange={handleChange}
                    as="textarea" rows={3} />
                </Form.Group>
            </Form>
            {
                !(percentage === 0 || percentage === 100)&&
                <ProgressBar variant="warning" label={`${percentage}%`} now={60} />
            }

            <div>
                {errors.map(errorMsg => <p style={{color:"red"}} key={errorMsg}>{errorMsg}</p>)}
            </div>

            <Row>
                <Col>
                    <button 
                    onClick={handleSubmit}
                    className="message-form-button"
                    disabled={loading ? true : false}
                    style={{width:'100%'}}>
                        SEND
                    </button>
                </Col>
                <Col>
                    <button 
                    onClick={handleOpenImgaeRef}
                    className="message-form-button"
                    disabled={loading ? true : false}
                    style={{width:'100%'}}>
                        UPLOAD
                    </button>
                </Col>
            </Row>

            <input 
            accept="image/jpeg,image/png"
            ref={inputOpenImageRef}
            style={{display:"none"}}
            onChange={handleUploadImage}
            type="file" />
        </div>
    )
}

export default MessageForm
