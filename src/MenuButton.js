import { IconButton } from "./common/buttons";
import { Box, ThemeContext } from "grommet";
import { List, Notification } from "grommet-icons";
import { useContext, useEffect, useState } from "react";
import Context from "./utils/context";
import styled from "styled-components";

const Notif = styled(Box)`
    position: absolute;
    top: 4px;
    right: 0;
`;

const MenuButton = ({ handleOpenSettings }) => {
    const context = useContext(Context);
    const theme = useContext(ThemeContext);

    console.log(theme);
    const { sharedLists } = context.ideas;

    const [notifs, setNotifs] = useState(0);

    useEffect(() => {
        setNotifs(
            Object.keys(sharedLists).reduce((acc, cur) => {
                if (!sharedLists[cur].accepted) acc++;
                return acc;
            }, 0)
        );
    }, [sharedLists]);

    return (
        <Box style={{ position: "relative" }} margin={{ horizontal: "small" }}>
            <IconButton icon={<List />} onClick={handleOpenSettings} hoverColor={theme.global.colors["light-4"]} />
            {notifs > 0 ? (
                <Notif background="status-critical" pad='xxsmall' round>
                    <Notification color='white' size='small'/>
                </Notif>
            ) : null}
        </Box>
    );
};

export default MenuButton;
