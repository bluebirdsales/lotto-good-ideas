import { Box } from 'grommet';

const AppBar = (props) => (
    <Box
        tag='header'
        direction='row'
        align='center'
        justify='between'
        background='off-white'
        pad={{ vertical: "small", horizontal: "medium" }}
        elevation='small'
        {...props}
    />
);

export default AppBar;