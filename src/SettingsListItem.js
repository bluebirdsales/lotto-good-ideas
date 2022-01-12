import { Box, ThemeContext } from "grommet";
import { IconButton } from "./common/buttons";
import { Checkmark, Close, Hide, FormView, Trash } from "grommet-icons";
import { useContext } from "react";
import Context from "./utils/context";

const SharedListItem = ({ item, handleToggleView, getIsVisible }) => {
    const context = useContext(Context);
    const theme = useContext(ThemeContext);

    const handleAcceptList = () => {
        context.handleAcceptList(item.id);
    };

    const handleRejectList = () => {
        context.handleRejectList(item.id);
    }

    return (
        <Box direction='row-responsive' align='center' justify='between'>
            {item.owner}
            {item.accepted ? (
                <Box direction='row'>
                    <IconButton
                        icon={getIsVisible(item.id) ? <FormView size='32px'/> : <Hide size='32px'/>}
                        hoverColor={theme.global.colors["light-3"]}
                        onClick={() => handleToggleView(item.id)}
                    />
                    {/* <IconButton icon={<Trash size='18px' />} hoverColor={theme.global.colors["light-3"]}/> */}
                </Box>
            ) : (
                <Box direction='row'>
                    <IconButton
                        icon={<Close color='red' size='18px' />}
                        onClick={handleRejectList}
                        hoverColor={theme.global.colors["light-3"]}
                    />
                    <IconButton
                        icon={<Checkmark color='green' size='18px' />}
                        onClick={handleAcceptList}
                        hoverColor={theme.global.colors["light-3"]}
                    />
                </Box>
            )}
        </Box>
    );
};

export default SharedListItem;
