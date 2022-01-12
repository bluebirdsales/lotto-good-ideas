import { Box, Text, Tip } from "grommet";
import { IconButton } from "./common/buttons";
import { Group, Trash } from "grommet-icons";

const IdeaListItem = ({ index, item, handleDelete }) => {
    return (
        <Box direction='row' align='center' justify='between' width='medium' wrap>
            <Text margin='xsmall' size='small'>
                {item.idea}
            </Text>
            {item.owned ? (
                <Box direction='row' align='center' justify='end' flex='grow'>
                  <IconButton
                    onClick={() => handleDelete(index)}
                    size='small'
                    icon={<Trash size='small' />}
                />  
                </Box>
                
            ) : (
                <Box direction='row' align='center' justify='end' flex="grow">
                    <Text size='xxsmall' color='rgba(255,255,255,0.6)'>
                        {item.owner}
                    </Text>
                    <Box margin="8px">
                        <Group size='small' color='rgba(255,255,255,0.6)' />
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default IdeaListItem;
