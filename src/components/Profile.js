import React from 'react';
import styled from 'styled-components';

import Button from './UI/Button';
import GeneralForm from './GeneralForm';

import { AppContext } from './AppProvider';
import { colors, borderRadiuses } from '../helpers';

import resetPasswordAPI from '../API/resetPassword';
import updateEntityAPI from '../API/updateEntity';

const ProfileWrapper = styled.div`
    overflow: hidden;
    width: 100%;
    max-width: 42rem;
    border-radius: ${borderRadiuses.medium};
`;

const ProfileHeader = styled.div`
    display: flex;
    padding: 1.3rem 1.3rem 1.5rem;
    background: ${colors.rdgray2};
`;

const ProfilePhoto = styled.div`
    width: 10rem;
    height: 10rem;
    background: url(${props => props.src});
    background-size: cover;
    border-radius: ${borderRadiuses.full};
`;

const ProfileText = styled.div`
    flex: 1;
    margin: 0.5rem 2rem;
`;

const ProfileInfo = styled.input`
    padding: ${props => props.readOnly ? '0' : '0.5rem'};
    font-size: ${props => props.readOnly ? '2rem' : '1.6rem'};
    color: ${props => props.readOnly ? '#fff' : colors.rddarkgray};
    background: ${props => props.readOnly ? 'transparent' : '#fff'};
    border: none;
`;

const ProfileBody = styled.div`
    padding: 1rem;
    background: #fff;
`;

const ProfileMessage = styled.div`
    display: flex;
    align-items: center;
    padding: 2rem;
    min-height: 20rem;
    font-size: 1.5rem;
    line-height: 1.4em;
    color: ${colors.rddarkgray};
    text-align: center;
`;

const Profile = () => {
    const context = React.useContext(AppContext);

    const [state, setState] = React.useState({
        currentPassword: '',
        newPassword: '',
        confirmedPassword: '',
        name: context.user.name,
        editMode: false
    });

    React.useEffect(() => {
        context.setActivePage('profile');
    }, []);

    const handleInputChange = (name, event) => {
        setState({
            ...state,
            [name]: event.target.value            
        })
    };

    const handleEditClick = async () => {
        if ( state.editMode ) {
            const user = await updateEntityAPI({ 
                afterUpdate: { name: state.name }, 
                beforeUpdate: context.user, 
                token: context.token, 
                entityName: 'users' 
            });

            context.setUserInfo({ user });
        }
        
        setState({ ...state, editMode: !state.editMode });
    }

    const handleFormSubmit = async () => {
        const { currentPassword, newPassword: password, confirmedPassword } = state;

        if (password !== confirmedPassword) {
            alert('Confirmed password does not match the new password');
            return;
        }

        const message = await resetPasswordAPI({
            token: context.token,
            currentPassword,
            password
        });

        context.showSnackbar(message);
        setState({
            ...state,
            currentPassword: '',
            newPassword: '',
            confirmedPassword: ''
        })
    };

    return (
        <ProfileWrapper>
            <ProfileHeader>
                <ProfilePhoto src={context.user.thumbnail} />
                <ProfileText>
                    <ProfileInfo
                        readOnly={!state.editMode}
                        type="text"
                        value={state.name}
                        onChange={(event) => handleInputChange('name', event)}
                    />
                    {/* <ProfileInfo secondary={true}>Some title</ProfileInfo> */}
                </ProfileText>
                {!context.user.googleId &&
                    <Button
                        dark={true}
                        compact={true}
                        customWidth="6rem"
                        margin="0.5rem 0 0"
                        onClick={handleEditClick}>
                        {state.editMode ? 'Save' : 'Edit'}
                    </Button>}
            </ProfileHeader>
            <ProfileBody>
                {context.user.googleId && <ProfileMessage>
                    You are currently logged in with your Google account, so user and password details can not be changed.
                </ProfileMessage>}
                {!context.user.googleId && <GeneralForm
                    onSubmit={handleFormSubmit}
                    inputs={[
                        {
                            type: 'password',
                            value: state.currentPassword,
                            label: 'Current Password',
                            onChange: (event) => handleInputChange('currentPassword', event),
                        },
                        {
                            type: 'password',
                            value: state.newPassword,
                            label: 'New Password',
                            onChange: (event) => handleInputChange('newPassword', event),
                        },
                        {
                            type: 'password',
                            value: state.confirmedPassword,
                            label: 'Confirmed Password',
                            onChange: (event) => handleInputChange('confirmedPassword', event),
                        }
                    ]} />}
            </ProfileBody>
        </ProfileWrapper>
    );
};

export default Profile;