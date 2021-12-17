import { Box, Button } from "grommet";
import { Trash } from "grommet-icons";

const ListItem = ({ index, item, handleDelete }) => {

    return (
        <Box direction='row' align='center' justify='between' width='medium'>
            {item}
            <Button onClick={() => handleDelete(index)} size='small' icon={<Trash size='small'/>}/>
        </Box>
    );
};

export default ListItem;
