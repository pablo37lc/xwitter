import Xweet from "components/Xweet";
import { authService, dbService } from "fbase";
import { signOut, updateProfile } from "firebase/auth";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Profile({ refreshUser, userObj }) {
    const [myXweets, setMyXweets] = useState([]);
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const navigate = useNavigate();

    const onLogOutClick = () => {
        signOut(authService);     
        navigate("/");
    };

    const getMyXweets = () => {
        const q = query(
            collection(dbService, "xweets"),
            where("creatorId", "==", userObj.uid),
            orderBy("createdAt", "desc"),
        )
        onSnapshot(q, (snapshot) => {
            const xweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMyXweets(xweetArray);
        });
    };

    useEffect(() =>{
        getMyXweets();
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName) {
            await updateProfile(authService.currentUser, {displayName : newDisplayName});
        }
        refreshUser();
    };

    const onChange = (event) => {
        const {target: {value}} = event;
        setNewDisplayName(value);
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <input
                    value={newDisplayName}
                    onChange={onChange}
                    type="text"
                    placeholder="Display name"
                ></input>
                <input type="submit" value="Update Profile"/>
            </form>
            <button onClick={onLogOutClick}>Log Out</button>

            <div>
                {myXweets.map((xweet) => (
                    <>
                    <Xweet
                        key={xweet.id}
                        xweetObj={xweet}
                        isOwner={xweet.creatorId === userObj.uid}
                    ></Xweet>                        
                    </>
                ))}
            </div>

        </>
    );
}

export default Profile;