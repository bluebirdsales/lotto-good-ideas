import { useContext, useState } from "react";
import { Box, Button, Form, Heading, TextArea } from "grommet";
import Context from "./utils/context";

const Output = () => {
    const context = useContext(Context);

    const handleChange = (e) => {
        context.handleTextFieldChange(e.target.value);
    };

    const handleSave = (e) => {
        e.preventDefault();
        context.handleSave();
    };

    const handleClear = () => {
        context.handleClear();
    };

    return (
        <Box margin={{ horizontal: "small" }}>
            <Heading level='5'>gives you</Heading>
            <Form onSubmit={handleSave}>
                <Box direction='column' align='end' width='medium' margin={{ vertical: "medium" }}>
                    <Box height='64px' fill>
                        <TextArea
                            resize={false}
                            fill
                            value={context.favorites.textField}
                            onChange={handleChange}
                        />
                    </Box>
                    <Box direction='row'>
                        <Button
                            margin='small'
                            label='clear'
                            color='alert'
                            onClick={handleClear}
                            disabled={context.favorites.textField.length < 1}
                        />
                        <Button
                            type='submit'
                            label='save'
                            margin='small'
                            onClick={handleSave}
                            disabled={context.favorites.textField.length < 1}
                        />
                    </Box>
                </Box>
            </Form>
        </Box>
    );
};

export default Output;
