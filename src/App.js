import AppBar from "./AppBar";
import { Box, Button, Heading, Spinner, ThemeContext } from "grommet";
import { useContext, useEffect, useState } from "react";
import { app, logout } from "./firebase/firebase_config";
import { getAuth } from "firebase/auth";
import Context from "./utils/context";
import IdeaTab from "./IdeaTab";
import SwipeableViews from "react-swipeable-views/lib/SwipeableViews";
import FavoritesTab from "./FavoritesTab";
import { List, Next, Previous } from "grommet-icons";
import { IconButton } from "./common/buttons";
import Modal from "react-modal";
import Settings from "./Settings";
import MenuButton from "./MenuButton";

function App() {
    const context = useContext(Context);
    const theme = useContext(ThemeContext);

    const [tabIndex, setTabIndex] = useState(0);
    const [showSettings, setShowSettings] = useState(false);

    const modalStyles = {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            padding: 0,
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "18px",
            border: `2px solid ${theme.global.colors.brand}`,
        },
    };

    const handleChangeIndex = (index) => {
        setTabIndex(index);
    };

    const handleClickPrev = () => {
        setTabIndex(tabIndex - 1);
    };

    const handleClickNext = () => {
        setTabIndex(tabIndex + 1);
    };

    const handleOpenSettings = (e) => {
        setShowSettings(!showSettings);
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
        context.handleSignInStart();
        const unsubscribe = getAuth(app).onAuthStateChanged((user) => {
            if (user) {
                context.handleSignedInSession(user);
            } else {
                context.handleSignOutSuccess();
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <Box
            id='app'
            className='App'
            style={{ minHeight: "100vh" }}
            background={{ color: "primary" }}
            direction='column'
        >
            <AppBar>
                <Heading level='4' margin='none'>
                    lotto good ideas
                </Heading>
                <Box direction='row' align='center'>
                    {context.user && (
                        <Heading level='5' margin={{ horizontal: "small", vertical: "none" }}>
                            {context.user.email}
                        </Heading>
                    )}
                    {context.user && <MenuButton handleOpenSettings={handleOpenSettings} />}
                    <Button
                        label={context.user ? "sign out" : "sign in"}
                        margin='none'
                        onClick={handleSignInSignOut}
                    />
                </Box>
                {showSettings && (
                    <Modal
                        appElement={document.getElementById("app")}
                        isOpen={showSettings}
                        onRequestClose={handleOpenSettings}
                        style={modalStyles}
                    >
                        <Settings handleClose={handleOpenSettings} />
                    </Modal>
                )}
            </AppBar>
            {context.session.fetching ? (
                <Box flex="grow" justify='center' align='center' pad='large'>
                    <Spinner color="white" size='medium'/>
                </Box>
                
            ) : context.user ? (
                <Box>
                    <Box fill justify='between' direction='row' pad={{ horizontal: "small" }}>
                        {tabIndex > 0 ? (
                            <IconButton
                                plain
                                icon={<Previous />}
                                onClick={handleClickPrev}
                                margin='8px'
                            />
                        ) : (
                            <Box />
                        )}
                        {tabIndex < 1 ? (
                            <IconButton
                                plain
                                icon={<Next />}
                                onClick={handleClickNext}
                                margin='8px'
                            />
                        ) : (
                            <Box />
                        )}
                    </Box>
                    <SwipeableViews
                        enableMouseEvents
                        index={tabIndex}
                        onChangeIndex={handleChangeIndex}
                    >
                        <IdeaTab />
                        <FavoritesTab />
                    </SwipeableViews>
                </Box>
            ) : (
                <Box pad='large' flex='grow' justify='center' align='center'>
                    <Heading level='2'>please sign in</Heading>
                </Box>
            )}
        </Box>
    );
}

export default App;
