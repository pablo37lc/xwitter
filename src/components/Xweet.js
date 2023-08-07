import { dbService, storageService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Xweet = ({ xweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newXweet, setNewXweet] = useState(xweetObj.text);

    const xweetDoc = doc(dbService, "xweets", `${xweetObj.id}`);
    const AttachmentRef = ref(storageService, xweetObj.attachmentUrl);

    const onDeleteClick = async() => {
        const ok = window.confirm("Are you sure you want to delete this xweet?");
        if(ok) {
            await deleteDoc(xweetDoc);
            if(xweetObj.attachmentUrl !== "") {
                await deleteObject(AttachmentRef);
            }
        }
    };

    const toggleEditing = () => {
        setEditing((prev) => !prev)
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(xweetDoc, {text: newXweet});
        setEditing(false);
    };

    const onChange = (event) => {
        const {target: {value}} = event;
        setNewXweet(value);
    };

    return (
        <div className="xweet">
            {editing ? (
                <>
                    <form onSubmit={onSubmit} className="container xweetEdit">
                        <input
                            onChange={onChange}
                            value={newXweet}
                            type="text"
                            placeholder="Edit your Xweet"
                            required
                        ></input>
                        <input type="submit" value="Update Xweet" className="formBtn"></input>
                    </form>
                    <span onClick={toggleEditing} className="formBtn cancelBtn">
                        Cancel
                    </span>
                </>
            ) : (
                <>
                    <h4>{ xweetObj.text }</h4>
                    {xweetObj.attachmentUrl && <img src={xweetObj.attachmentUrl} />}
                    {isOwner && (
                        <div className="xweet__actions">
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </div>
                    )}
                </>
            )}
            
        </div>
    );
};

export default Xweet;