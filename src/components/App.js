import React, { useState } from 'react';
import Router from "components/Router";
import {auth} from "fbase";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);
  
  return (
    <Router isLoggedIn={isLoggedIn} />
  );
}

export default App;
