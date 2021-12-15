import AppBar from "./AppBar";
import { Box, Button, } from "grommet";
import SimpleSlot from "./SimpleSlot";

function App() {

  const handleSpin = () => {
    // spin logic here...
  }

    return (
        <Box className='App' style={{ minHeight: "100vh" }}>
            <AppBar>lotto good ideas</AppBar>

            <Box
                background={{ color: "primary" }}
                pad='medium'
                flex
            >
                <Box>
                    <Button primary label='spin' onClick={handleSpin}/>
                </Box>
                <Box
                    direction='row'

                    fill='vertical'
                    flex
                    pad='medium'
                >
                    <SimpleSlot />
                </Box>
            </Box>
        </Box>
    );
}

export default App;
