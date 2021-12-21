import { useContext } from 'react';
import { Box, Button } from 'grommet';
import SimpleSlot from './SimpleSlot';
import Output from './Output';
import Context from "./utils/context";

const IdeaTab = () => {
    const context = useContext(Context);

    const handleSpin = () => {
        context.handleSpin();
    };

    return (
        <Box background={{ color: "primary" }} pad={{horizontal: 'medium', vertical: 'none'}} flex>
            <Box>
                <Button primary label='spin' onClick={handleSpin} />
            </Box>
            <Box direction='row' fill='vertical' flex pad='medium'>
                <SimpleSlot category={"category1"} message='start with' slots={1} />
                <SimpleSlot category={"category2"} message='mix in' slots={2} />
                <Output />
            </Box>
        </Box>
    );
};

export default IdeaTab;