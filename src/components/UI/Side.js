import React from 'react';
import styled from 'styled-components';

import { colors, widths } from '../../helpers';

const StyledSide = styled.div`
    flex-shrink: 0;
    width: ${widths.sidebar};
    color: #fff;
    background: ${colors.rdgray};
    text-align: center;
`;

const Side = (props) => {
    return (
        <StyledSide>
            {props.children}
        </StyledSide>
    );
};

export default Side;