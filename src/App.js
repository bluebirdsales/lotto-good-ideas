import AppBar from "./AppBar";
import { Box, Button, Heading } from "grommet";
import SimpleSlot from "./SimpleSlot";
import { useState, useContext, useEffect } from "react";
import { app, logout, signInWithGoogle } from "./firebase/firebase_config";
import { getAuth } from 'firebase/auth';
import Context from "./utils/context";

function App() {
    const context = useContext(Context);

    const handleSpin = () => {
        // spin logic here...
    };

    const handleSignInSignOut = async () => {
        if (!context.user) {
            try {
              context.googleSignIn();
            } catch (e) {
                console.log("error", e);
            }
        } else {
            try {
                await logout();
                context.handleSignOutSuccess();
            } catch (e) {
                console.log("error", e);
            }
        }
    };

    useEffect(() => {
        const unsubscribe = getAuth(app).onAuthStateChanged((user) => {
            if (user) {
               context.handleSignIn(user); 
            } else {
                context.handleSignOutSuccess();
            }
            
        })

        return () => unsubscribe();
    }, [])

    return (
        <Box className='App' style={{ minHeight: "100vh" }}>
            <AppBar>
                <Heading level='4' margin='none'>
                    lotto good ideas
                </Heading>
                <Box direction='row' align='center'>
                    {context.user && (
                        <Heading level='5' margin={{ horizontal: "small", vertical: "none" }}>
                            {context.user.displayName}
                        </Heading>
                    )}
                    <Button
                        label={context.user ? "sign out" : "sign in"}
                        margin='none'
                        onClick={handleSignInSignOut}
                    />
                </Box>
            </AppBar>

            <Box background={{ color: "primary" }} pad='medium' flex>
                <Box>
                    <Button primary label='spin' onClick={handleSpin} />
                </Box>
                <Box direction='row' fill='vertical' flex pad='medium'>
                    <SimpleSlot />
                </Box>
            </Box>
        </Box>
    );
}

export default App;
