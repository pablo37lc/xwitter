import Xweet from "components/Xweet";
import { dbService, storageService } from "fbase";
import { addDoc, collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

function Home({userObj}) {
    const [xweet, setXweet] = useState("");
    const [xweets, setXweets] = useState([]);
    const [attachment, setAttachment] = useState("");

    const getXweets = () => {
        const q = query(
            collection(dbService, "xweets"),
            orderBy("createdAt", "desc"),
        )
        onSnapshot(q, (snapshot) => {
            const xweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setXweets(xweetArray);
        });
    };

    useEffect(() => {
        getXweets();        
    }, []);

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
        <div>
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

            <div>
                {xweets.map((xweet) => (
                    <>
                    <Xweet
                        key={xweet.id}
                        xweetObj={xweet}
                        isOwner={xweet.creatorId === userObj.uid}
                    ></Xweet>                        
                    </>
                ))}
            </div>
        </div>
    );
}

export default Home;