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
        </>
    );
};

export default AuthForm;