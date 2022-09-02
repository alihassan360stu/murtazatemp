import React, { useState } from 'react';
import { Divider, Box, TextField, MenuItem } from '@material-ui/core';
import CodeEditor from '@uiw/react-textarea-code-editor';

const CLI = () => {
    const [platform, setPlatform] = useState(1)
    const [gridF, setGridF] = useState(1)
    const [temp, setTemp] = useState('npm i -g @aunton8/aunton8-cli && aunton8 --token "fSFCPSx07eY9RaKNRl3pQAGWDvsAPA7vHKpHX9nkHl8TjjrTjA" --project "gmGx0t0dROs35HdBJsga" --grid "Aunton8-Grid"')

    const cliPlatsforms = [
        { id: 1, name: 'Jenkin' },
        { id: 2, name: 'AWS' },
        { id: 3, name: 'Microsoft Azure' },
        { id: 4, name: 'Gitlab' },
    ]

    const gridArray = [
        { id: 1, name: 'Auton8 Grid' },
        { id: 2, name: 'Browser Stack' },
    ]

    return (
        <Box >
            <br />
            <h2>Running tests with CLI</h2>
            <br />
            <Divider />
            <br />
            <Box style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
                <TextField
                    id="outlined-select-currency"
                    select
                    label="Select CI Platform"
                    margin='normal'
                    style={{ width: '20%' }}
                    name='temp'
                    value={platform}
                    onChange={(e) => {
                        e.preventDefault();
                        let { value } = e.target;
                        setPlatform(value)
                    }}
                    variant="outlined" >
                    {
                        cliPlatsforms.map(role => (
                            <MenuItem key={role.id} value={role.id}>
                                {role.name}
                            </MenuItem>
                        ))
                    }
                </TextField>
                &nbsp;&nbsp;
                <TextField
                    id="outlined-select-currency"
                    select
                    style={{ width: '20%' }}
                    label="Select Grid"
                    margin='normal'
                    value={gridF}
                    onChange={(e) => {
                        e.preventDefault();
                        let { value } = e.target;
                        setGridF(value)
                    }}
                    variant="outlined" >
                    {
                        gridArray.map(role => (
                            <MenuItem key={role.id} value={role.id}>
                                {role.name}
                            </MenuItem>
                        ))
                    }
                </TextField>
            </Box>
            <br />
            <h5>Example</h5>
            <br />
            <CodeEditor
                value={temp}
                language="js"
                placeholder="Example"
                name="script"
                disabled={true}
                padding={15}
                style={{
                    fontSize: 12,
                    backgroundColor: "#f5f5f5",
                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                }}
            />

        </Box>

    );
};

export default CLI;