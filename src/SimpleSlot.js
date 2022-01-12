import { TextInput, Box, Heading, Button, List, Form } from "grommet";
import { AddCircle, FormView, Hide, Lock } from "grommet-icons";
import { useState, useContext, useEffect, useCallback } from "react";
import IdeaListItem from "./IdeaListItem";
import Context from "./utils/context";
import { IconButton } from "./common/buttons";

const SimpleSlot = ({ category, message }) => {
    const context = useContext(Context);
    const [value, setValue] = useState("");
    const [showList, setShowList] = useState(true);
    const [hideIcon, setHideIcon] = useState(false);
    const [compiledLists, setCompiledLists] = useState([]);

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

    const handleToggleList = () => {
        setShowList(!showList);
        setHideIcon(!hideIcon);
    };

    const getEntries = useCallback(() => {
        let compiledList = [];

        const { myLists, sharedLists } = context.ideas;

        for (let key in myLists) {
            if (context.session.visibleLists?.[key]?.show) {
                const ideaList = myLists[key][category].entries.map((item) => ({
                    idea: item,
                    owned: true,
                    owner: context.user.email,
                }));
                compiledList = [...ideaList];

                // compiledList = [...context.ideas.myLists[key][category].entries]
            }
        }
        for (let key in sharedLists) {
            if (
                sharedLists?.[key]?.accepted &&
                context.session.visibleLists?.[key]?.show
            ) {
                const ideaList = sharedLists[key][category].entries.map((item) => ({
                    idea: item,
                    owned: false,
                    owner: sharedLists[key].owner
                }));
                compiledList = [...compiledList, ...ideaList];
                // compiledList = [...compiledList, ...context.ideas.sharedLists[key][category].entries]
            }
        }
        return compiledList;
    }, [category, context.ideas, context.session.visibleLists, context.user.email]);

    useEffect(() => {
        setCompiledLists(getEntries());
    }, [getEntries]);

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
            <Box direction='row' align='center' justify='end'>
                <IconButton
                    icon={hideIcon ? <Hide /> : <FormView />}
                    onClick={handleToggleList}
                    onMouseOver={() => setHideIcon(showList)}
                    onMouseOut={() => setHideIcon(!showList)}
                    onFocus={() => setHideIcon(showList)}
                    onBlur={() => setHideIcon(!showList)}
                />
            </Box>
            {showList && (
                <List data={compiledLists} pad='none'>
                    {(datum, index) => (
                        <IdeaListItem
                            item={datum}
                            key={`${datum}-${index}`}
                            index={index}
                            handleDelete={handleDelete}
                        />
                    )}
                </List>
            )}
        </Box>
    );
};

export default SimpleSlot;
