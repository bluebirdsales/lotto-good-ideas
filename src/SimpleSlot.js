import { TextInput, Box, Heading, Button, List, Form } from "grommet";
import { AddCircle, Lock } from "grommet-icons";
import { useState, useContext } from "react";
import IdeaListItem from "./IdeaListItem";
import Context from "./utils/context";
import { IconButton } from "./common/buttons";

const SimpleSlot = ({ category, message }) => {
    const context = useContext(Context);
    // const [selection, setSelection] = useState("");
    const [value, setValue] = useState("");

    // const { locked } = context.selections[category];

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

    const handleToggleLock = (index) => {
        context.handleToggleLock(category, index);
    };

    return (
        <Box margin={{ horizontal: "small" }}>
            <Box direction='row' align='center'>
                <Heading level='5'>{message}</Heading>
            </Box>
            <Box
                height='xxsmall'
                direction='row'
                align='center'
                width='medium'
                margin={{ vertical: "medium" }}
                justify='start'
            >
                {context.selections[category].map((el, index) => (
                    <Box direction='row' width='small' key={`${el.result}-${index}`} align='center'>
                        <IconButton
                            fill={false}
                            backgroundColor={el.locked && "accent-1"}
                            icon={<Lock size='small' color={el.locked && "dark-1"} />}
                            size='small'
                            onClick={() => handleToggleLock(index)}
                            margin='none'
                        />
                        <Heading level='4' margin={{ vertical: "none", horizontal: "xsmall" }}>
                            {el.result}
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
                    <IdeaListItem
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
