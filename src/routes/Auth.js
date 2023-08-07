import { authService } from "fbase";
import { GithubAuthProvider, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useState } from "react";

function Auth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");

    const onChange = (event) => {
        const {target: {name, value}} = event;

        if(name === "email") {
            setEmail(value);
        }
        else if (name === "password") {
            setPassword(value);
        }
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            if (newAccount) {
                data = await createUserWithEmailAndPassword(authService, email, password)
            }
            else {
                data = await signInWithEmailAndPassword(authService, email, password)
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const toggleAccount = () => {
        setNewAccount((prev) => !prev)
    }

    const onSocialClick = async (event) => {
        const {target : {name}}  = event;

        let provider;

        if(name === "google") {
            provider = new GoogleAuthProvider();
        }
        else if (name === "github") {
            provider = new GithubAuthProvider();
        }

        const data = await signInWithPopup(authService, provider);
        console.log(data);
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input 
                    name="email"
                    type="email" 
                    placeholder="Email" 
                    required
                    value={email}
                    onChange={onChange}
                ></input>
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={onChange}
                ></input>
                <input type="submit" value={newAccount? "Create Account" : "Log In"}></input>
                {error}
            </form>

            <span onClick={toggleAccount}>
                {newAccount ? "Sing In" : "Create Account"}
            </span>

            <div>
                <button name="google" onClick={onSocialClick}>Continue with Google</button>
                <button name="github" onClick={onSocialClick}>Continue with Github</button>
            </div>
        </div>
    );
};

export default Auth;