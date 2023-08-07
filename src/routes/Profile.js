import { authService } from "fbase";
import { signOut, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Profile({ refreshUser, userObj }) {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const navigate = useNavigate();

    const onLogOutClick = () => {
        signOut(authService);     
        navigate("/");
    };

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
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input
                    value={newDisplayName}
                    onChange={onChange}
                    type="text"
                    autoFocus
                    placeholder="Display name"
                    className="formInput"
                ></input>
                <input
                    type="submit"
                    value="Update Profile"
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }}
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    );
}

export default Profile;