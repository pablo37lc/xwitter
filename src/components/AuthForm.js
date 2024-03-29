import { authService } from "fbase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

const AuthForm = () => {
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

    return (
        <>
            <form onSubmit={onSubmit} className="container">
                <input 
                    name="email"
                    type="email" 
                    placeholder="Email" 
                    required
                    value={email}
                    onChange={onChange}
                    className="authInput"
                ></input>
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={onChange}
                    className="authInput"
                ></input>
                <input
                    type="submit"
                    value={newAccount? "Create Account" : "Log In"} 
                    className="authInput authSubmit"
                ></input>
                {error && <span className="authError">{error}</span>}
            </form>

            <span onClick={toggleAccount} className="authSwitch">
                {newAccount ? "Sing In" : "Create Account"}
            </span>
        </>
    );
};

export default AuthForm;