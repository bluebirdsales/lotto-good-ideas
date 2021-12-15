import { Box } from 'grommet';

const AppBar = (props) => (
    <Box
        tag='header'
        direction='row'
        align='center'
        justify='between'
        background='light-2'
        pad={{ vertical: "small", horizontal: "medium" }}
        elevation='medium'
        {...props}
    />
);

export default AppBar;