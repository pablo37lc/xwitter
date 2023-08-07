import Xweet from "components/Xweet";
import XweetFactory from "components/XweetFactory";
import { dbService } from "fbase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

function Home({userObj}) {
    const [xweets, setXweets] = useState([]);

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

    return (
        <div className="container">
            <XweetFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
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