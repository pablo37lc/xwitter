import React from "react";
import { dbService, storageService } from "fbase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useState } from "react";
import { v4 } from "uuid";

const XweetFactory = ({ userObj }) => {
    const [xweet, setXweet] = useState("");
    const [attachment, setAttachment] = useState("");
    
    const onChange = (event) => {
        const {target:{value}} = event;
        setXweet(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        let attachmentUrl ="";
        if(attachment !== "") {
            const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(response.ref);    
        };

        await addDoc(collection(dbService, "xweets"), {
            text: xweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        });

        setXweet("");
        setAttachment("");

    };

    const onFileChange = (event) => {
        const {target : {files}} = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {currentTarget: { result }} = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () => {
        setAttachment("");
    };

    return (
        <form onSubmit={onSubmit}>
            <input value={xweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}></input>
            <input onChange={onFileChange} type="file" accept="image/*"></input>
            <input type="submit" value="Xweet"></input>
            {attachment && (
                <div>
                <img src={attachment} alt={xweet} width="50px" height="50px"></img>
                <button onClick={onClearAttachment}>Clear</button>
                </div>
            )}
        </form>
    );
};

export default XweetFactory;