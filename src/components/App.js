import React, { useEffect, useState } from 'react';
import AppRouter from "components/Router";

import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { authService } from 'fbase';


function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] =useState(null);

  useEffect(() => {
    onAuthStateChanged(authService, (user) => {
      if(user) {
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: () => updateProfile(user, { displayName: user.displayName }),
        });
      }
      else {
        setIsLoggedIn(false);
      }
      setInit(true);
    })
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };

  return (
    <>
      {init? <AppRouter refreshUser={refreshUser} isLoggedIn={isLoggedIn} userObj={userObj} /> : "Initializing..."}
      
    </>
  );
}

export default App;
