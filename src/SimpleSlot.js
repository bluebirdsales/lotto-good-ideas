import { TextInput, Box, Heading, Button, List, Form } from "grommet";
import { AddCircle, Trash } from "grommet-icons";
import { useState, useContext } from "react";
import ListItem from "./ListItem";
import Context from "./utils/context";

const SimpleSlot = () => {
    const context = useContext(Context);
    const [selection, setSelection] = useState("");
    const [value, setValue] = useState("");

    const handleAdd = (e) => {
        e.preventDefault();
        context.handleAddIdea(value);
        setValue("");
    };

    const handleDelete = (index) => {
        context.handleDeleteIdea(index);
    };

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    console.log("context", context);

    return (
        <Box>
            <Heading level='3'>start with</Heading>
            <Heading level='5'>{selection}</Heading>
            <Form onSubmit={handleAdd}>
                <Box direction='row'>
                    <TextInput
                        placeholder='drop an idea here...'
                        value={value}
                        onChange={handleChange}
                    />
                    <Button onClick={handleAdd} disabled={value.length < 1} type='submit'>
                        <AddCircle />
                    </Button>
                </Box>
            </Form>
            <List data={context.ideas} pad='none'>
                {(datum, index) => (
                    <ListItem item={datum} index={index} handleDelete={handleDelete} />
                )}
            </List>
        </Box>
    );
};

export default SimpleSlot;
