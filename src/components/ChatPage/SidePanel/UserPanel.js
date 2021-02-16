import React , {useRef} from 'react'
import {IoIosChatboxes} from 'react-icons/io';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'react-bootstrap/Image';
import { useDispatch, useSelector } from 'react-redux';
import firebase from "../../../firebase";
import mime from 'mime-types';
import {setPhotoURL} from '../../../redux/actions/user_action';

function UserPanel() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.currentUser)
    // console.log(user)
    const inputOpenImageRef = useRef();

    const handleLogout =()=>{
        firebase.auth().signOut();
    }
    const handleOpenImageRef =()=> {
        inputOpenImageRef.current.click();
    }
    //프로필 변경시키기
    const handleUploadImage = async (e) => {
        //파이어베이스 스토리지에 넣을 파일과 메타데이터
        const file = e.target.files[0];
        console.log("file",file)
        const metadata = {contentType: mime.lookup(file.name)};
        console.log(metadata)
        try {
            // 스토리지에 넣어주기
            let uploadTaskSnapshot = await firebase.storage().ref()
                .child(`user_image/${user.uid}`)
                .put(file, metadata)
            // 이미지 url 를 불러오기
                let downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();
            //인증 부분 프로필 이미지 수정
            await firebase.auth().currentUser.updateProfile({
                photoURL:downloadURL
            })
            // 리덕스 부분 이미지 변경시켜주기
            dispatch(setPhotoURL(downloadURL))
            // 데이터베이스 부분
            await firebase.database().ref("users")
                .child(user.uid)
                .update({ image: downloadURL})


                console.log("uplaod", uploadTaskSnapshot)
        } catch (error) {
            alert("err")
        }
    }

    return (
        <div>
            <h3 style={{ color:'white'}}>
            <IoIosChatboxes/>{" "}Chat App
            </h3>

            <div style={{display:'flex', marginBottom:'1rem'}}>
            <Image src= {user && user.photoURL}
            style={{ width:'30p', height:'30px', marginTop:'3px'}}
            roundedCircle />

            <input 
            onChange={handleUploadImage}
            ref={inputOpenImageRef}
            style={{display:"none"}}
            accept="image/jpeg, image/png"
            type="file" />

            <Dropdown>
                <Dropdown.Toggle 
                style={{ background:' transparent', border:'0px'}}
                id="dropdown-basic">
                    {user && user.displayName}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={handleOpenImageRef}>
                        프로필 사진 변경
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>
                        로그아웃
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            </div>
        </div>
    )
}

export default UserPanel
