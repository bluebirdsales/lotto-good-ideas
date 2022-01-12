import { Box, Button, Form, FormField, Text, TextInput } from "grommet";
import { useContext, useState } from "react";
import { IconButton } from "./common/buttons";
import { Trash } from "grommet-icons";
import Context from "./utils/context";

const ShareDrop = ({ handleClose }) => {
    const context = useContext(Context);

    const myList = context.ideas.myLists[Object.keys(context.ideas.myLists)[0]];
    const listId = Object.keys(context.ideas.myLists)[0]

    const [value, setValue] = useState("");

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        context.handleShareList(value, listId);
        setValue("");
    };

    const handleUnshare = (email) => {
        context.handleUnshareList(email, listId);
    };

    return (
        <Box pad='medium' background='light-1' width='medium'>
            <Form onSubmit={handleSubmit}>
                <FormField>
                    <TextInput
                        placeholder='enter an email'
                        type='email'
                        plain
                        value={value}
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                </FormField>
                <Box>
                    <Text>Shared with:</Text>
                    {Object.keys(myList.sharedWith).map((user) => {
                        const { email } = myList.sharedWith[user];
                        return (
                            <Box direction='row' justify='between' align='center' key={user}>
                                <Text size='small' >
                                    {email}
                                </Text>
                                <IconButton
                                    icon={<Trash size='small' />}
                                    onClick={() => handleUnshare(email)}
                                />
                            </Box>
                        );
                    })}
                </Box>

                <Box direction='row' justify='end'>
                    <Button
                        label='Share'
                        margin={{ vertical: "small" }}
                        disabled={value.length < 6}
                        type='submit'
                    />
                </Box>
            </Form>
        </Box>
    );
};

export default ShareDrop;
