import AppBar from "./AppBar";
import { Box, Button, Heading } from "grommet";
import { useContext, useEffect, useState } from "react";
import { app, logout } from "./firebase/firebase_config";
import { getAuth } from "firebase/auth";
import Context from "./utils/context";
import IdeaTab from "./IdeaTab";
import SwipeableViews from 'react-swipeable-views/lib/SwipeableViews';
import FavoritesTab from './FavoritesTab';
import { Next, Previous } from 'grommet-icons';
import { IconButton } from './common/buttons';

function App() {
    const context = useContext(Context);

    const [tabIndex, setTabIndex] = useState(0);

    const handleChangeIndex = (index) => {
        setTabIndex(index)
    }

    const handleClickPrev = () => {
        setTabIndex(tabIndex - 1);
    }

    const handleClickNext = () => {
        setTabIndex(tabIndex + 1);
    }

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
        });

        return () => unsubscribe();
    }, []);

    return (
        <Box className='App' style={{ minHeight: "100vh" }} background={{ color: "primary" }}>
            <AppBar >
                <Heading level='4' margin='none'>
                    lotto good ideas
                </Heading>
                <Box direction='row' align='center'>
                    {context.user && (
                        <Heading level='5' margin={{ horizontal: "small", vertical: "none" }}>
                            {context.user.email}
                        </Heading>
                    )}
                    <Button
                        label={context.user ? "sign out" : "sign in"}
                        margin='none'
                        onClick={handleSignInSignOut}
                    />
                </Box>
            </AppBar>
            <Box fill justify='between' direction='row' pad={{horizontal: 'small'}}>
                {
                    tabIndex > 0 ?
                    <IconButton plain icon={<Previous />} onClick={handleClickPrev} margin='8px'/> : <Box />
                }
                {
                    tabIndex < 1 ?
                    <IconButton plain icon={<Next />} onClick ={handleClickNext} margin='8px'/> : <Box/>
                }
            </Box>
            <SwipeableViews enableMouseEvents index={tabIndex} onChangeIndex={handleChangeIndex} >
              <IdeaTab />
              <FavoritesTab />
            </SwipeableViews>
        </Box>
    );
}

export default App;
