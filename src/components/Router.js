import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes} from "react-router-dom";
import Home from 'routes/Home';
import Auth from 'routes/Auth';
import Navigation from './Navigation';
import Profile from 'routes/Profile';

function AppRouter ({isLoggedIn, userObj}) {

    return (
    <Router>
        {isLoggedIn && <Navigation />}
        <Routes>
            {isLoggedIn ? 
                <>
                    <Route exact path="/" element={<Home userObj={userObj} />} />
                    <Route exact path="/profile" element={<Profile/>} />
                </>
            : 
                <Route exact path="/" element={<Auth/>} />
            }
            
        </Routes>
    </Router>
    );
}

export default AppRouter;