import { Button } from 'grommet';
import styled from 'styled-components';

export const IconButton = styled(Button)`
    /* margin: 8px; */
    padding: 8px;
    background-color: ${(props) =>  props.theme.global.colors[props.backgroundColor]};
    border-radius: 50%;
    &:hover {
        background: ${(props) => props.hoverColor || 'rgba(255,255,255,0.2)'};
    }
`;
