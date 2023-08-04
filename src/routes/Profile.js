import { auth } from "fbase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";


function Profile() {
    const navigate = useNavigate();

    const onLogOutClick = () => {
        signOut(auth);     
        navigate("/");
    }

    return (
        <>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
}

export default Profile;