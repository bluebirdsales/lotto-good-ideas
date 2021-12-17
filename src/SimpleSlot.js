import { TextInput, Box, Heading, Button, List, Form } from "grommet";
import { AddCircle, Trash } from "grommet-icons";
import { useState, useContext } from "react";
import ListItem from "./ListItem";
import Context from "./utils/context";

const SimpleSlot = ({ category, message, slots }) => {
    const context = useContext(Context);
    // const [selection, setSelection] = useState("");
    const [value, setValue] = useState("");

    const handleAdd = async (e) => {
        e.preventDefault();

        try {
            context.handleAddIdea(category, value);
            setValue("");
        } catch (e) {
            console.log(e);
        }
    };

    const handleDelete = (index) => {
        context.handleDeleteIdea(category, index);
    };

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    return (
        <Box margin={{ horizontal: "small" }}>
            <Heading level='5'>{message}</Heading>
            <Box height='xxsmall' direction='row' align='center' width='medium' margin={{vertical: "medium"}} justify='start'>
                {context.selections[category].map((value, index) => (
                    <Box direction='row' width='small' key={`${value}-${index}`}>
                        <Heading  level='4' margin={{ vertical: "none", horizontal: "small" }}>
                            {value}
                        </Heading>
                    </Box>
                ))}
            </Box>
            <Form onSubmit={handleAdd}>
                <Box direction='row' margin={{ vertical: "small" }} align='center'>
                    <TextInput
                        placeholder='drop an idea here...'
                        value={value}
                        onChange={handleChange}
                    />
                    <Button
                        secondary
                        onClick={handleAdd}
                        disabled={value.length < 1}
                        type='submit'
                        icon={<AddCircle />}
                    />
                </Box>
            </Form>
            <List data={context.ideas[category].entries} pad='none'>
                {(datum, index) => (
                    <ListItem
                        item={datum}
                        key={`${datum}-${index}`}
                        index={index}
                        handleDelete={handleDelete}
                    />
                )}
            </List>
        </Box>
    );
};

export default SimpleSlot;
