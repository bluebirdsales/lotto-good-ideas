import { Box, DropButton, Heading, List, Text, ThemeContext } from "grommet";
import { Close, FormView, Hide } from "grommet-icons";
import { useContext, useState } from "react";
import { IconButton } from "./common/buttons";
import SettingsListItem from "./SettingsListItem";
import ShareDrop from './ShareDrop';
import Context from "./utils/context";

const Settings = ({ handleClose }) => {
    const theme = useContext(ThemeContext);
    const context = useContext(Context);

    const myListId = Object.keys(context.ideas.myLists)[0]

    const [open, setOpen] = useState(false);

    const { sharedLists } = context.ideas;

    const getSharedLists = () => {
        let result = [];
        for (let key in sharedLists) {
            const { owner, accepted } = sharedLists[key];
            result.push({ owner, accepted, id: key });
        }
        return result;
    };

    const handleOpenDrop = () => {
        setOpen(!open)
    }

    const handleToggleView = (id) => {
        context.handleToggleView(id);
    };

    const getIsVisible = (id) => {
        return context.session.visibleLists[id].show;
    }

    return (
        <Box pad='medium' background='light-1' width='medium' overflow='auto' height={"70vh"}>
            <Box direction='row' justify='end' align='center'>
                <IconButton
                    icon={<Close size='18px' />}
                    onClick={handleClose}
                    hoverColor={theme.global.colors["light-3"]}
                />
            </Box>
            <Heading level='4' margin={"small"}>
                Manage Lists
            </Heading>
            <Box
                direction='row-responsive'
                align='center'
                justify='between'
                pad={{ vertical: "small", horizontal: "medium" }}
            >
                <Text weight={"bold"}>My list</Text>
                <Box direction='row' align='center'>
                    <IconButton
                        icon={getIsVisible(myListId) ? <FormView size='32px' /> : <Hide size='32px'/>}
                        hoverColor={theme.global.colors["light-3"]}
                        onClick={() => handleToggleView(myListId)}
                    />
                    <DropButton label='Share' size='small' 
                        dropAlign={{ top: 'top', right: 'right' }}
                        dropContent={<ShareDrop />}
                        dropProps={{stretch: false, onClickOutside: handleOpenDrop, handleClose: handleOpenDrop}}
                        open={open}
                        onClick={handleOpenDrop}
                        
                    />
                </Box>
            </Box>
            <Heading level='4'>Shared with me</Heading>
            <Box>
                {Object.keys(sharedLists).length ? (
                    <List data={getSharedLists()}>
                        {(datum) => <SettingsListItem item={datum} key={datum.id} handleToggleView={handleToggleView} getIsVisible={getIsVisible} />}
                    </List>
                ) : (<Text size='small' margin={{horizontal: 'medium'}}>Nothing yet...</Text>)}
            </Box>
        </Box>
    );
};

export default Settings;
