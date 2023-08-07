import { dbService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";

const Xweet = ({ xweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newXweet, setNewXweet] = useState(xweetObj.text);

    const xweetDoc = doc(dbService, "xweets", `${xweetObj.id}`);

    const onDeleteClick = async() => {
        const ok = window.confirm("Are you sure you want to delete this xweet?");
        if(ok) {
            await deleteDoc(xweetDoc)
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
        <div>
            {editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input
                            onChange={onChange}
                            value={newXweet}
                            type="text"
                            placeholder="Edit your Xweet"
                            required
                        ></input>
                        <input type="submit" value="Update Xweet"></input>
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </>
            ) : (
                <>
                    <h4>{ xweetObj.text }</h4>
                    {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>Delete Xweet</button>
                            <button onClick={toggleEditing}>Edit Xweet</button>
                        </>
                    )}
                </>
            )}
            
        </div>
    );
};

export default Xweet;