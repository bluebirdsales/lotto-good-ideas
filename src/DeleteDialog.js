import { Box, Button, Text } from "grommet";

const DeleteDialog = ({handleDelete}) => {

    return (
        <Box pad='small' background='light-2' width='small' round='xsmall'>
            <Text margin='small'>Are you sure?</Text>
            <Button label='delete' size='small' justify='center' onClick={handleDelete}/>
        </Box>
    );
};

export default DeleteDialog;
