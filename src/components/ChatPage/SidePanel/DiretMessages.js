import React, { Component } from 'react'
import {FaRegSmile} from "react-icons/fa";

export class DiretMessages extends Component {
    render() {
        return (
            <div>
                <span style={{ display:'flex', alignItems:'center'}}>
                    <FaRegSmile style={{marginRight: 3}} /> DIRECT MESSAGES(1)
                </span>

                <ul style={{ listStyleType:'none', padding: 0}}>
                    {this.renderDirectMessages()}
                </ul>
            </div>
        )
    }
}

export default DiretMessages
