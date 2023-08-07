import Xweet from "components/Xweet";
import { dbService } from "fbase";
import { addDoc, collection, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

function Home({userObj}) {
    const [xweet, setXweet] = useState("");
    const [xweets, setXweets] = useState([]);

    /*
    const getXweets = async() => {
        const dbXweets = await getDocs(collection(dbService, "xweets"));
        dbXweets.forEach((document) => {
            const xweetObject = {
                ...document.data(),
                id: document.id,
            };            
            setXweets(prev => [xweetObject, ...prev]);
        });
    };
    */
    
    const snapShotXweets = () => {
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
    }

    useEffect(() => {
        //getXweets();
        snapShotXweets();        
    }, []);

    const onChange = (event) => {
        const {target:{value}} = event;
        setXweet(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        await addDoc(collection(dbService, "xweets"), {
            text: xweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={xweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}></input>
                <input type="submit" value="Xweet"></input>
            </form>

            <div>
                {xweets.map((xweet) => (
                    <Xweet key={xweet.id} xweetObj={xweet} isOwner={xweet.creatorId === userObj.uid}></Xweet>                        
                ))}
            </div>
        </div>
    );
}

export default Home;