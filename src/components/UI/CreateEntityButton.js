import React from 'react';
import styled from 'styled-components';

const StyledCreateEntityButton = styled.button`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 2rem;
    height: 4rem;
    color: #fff;
    background: #313442;
    border: 1px solid black;
    border-radius: 0.5rem;
    user-select: none;
    ${props => {
        if ( props.injectIntoTable ) {
            return `transform: translate(1rem, calc(100% + 1rem));
             z-index: 999;`
        }
    }};

    &:hover { cursor: pointer; }
    &:focus { outline: none; }    

    &::before {
        content: '';
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 1rem;
        width: 2.2rem;
        height: 2.2rem;
        font-size: 1.6rem;
        line-height: 2.1em;
        background: url('./plus-icon-white.svg');
        background-size: 100% 100%; }
`;

const CreateEntityButton = (props) => {
    return (
        <StyledCreateEntityButton 
            onClick={props.showPopup}
            injectIntoTable={props.injectIntoTable}
        >Create {props.entity}
        </StyledCreateEntityButton>
    );
};

export default CreateEntityButton;