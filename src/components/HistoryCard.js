import React from 'react';
import styled from 'styled-components';

import IconButton from './UI/IconButton.js'
import { statusEnum, colors, svgIcons } from '../helpers';
import { AppContext } from './AppProvider';

const StyledHistoryCard = styled.div`
    display: flex;
    flex-direction: column;
    grid-row: ${props => props.extended ? 'span 2' : 'auto'};
    overflow: hidden;
    background: #fff;
    border-radius: 0.5rem;
    box-shadow: 0px 4px 4px rgba(0,0,0,0.25);

    &.card-appear-active {
        opacity: 0;
        transform: scale(0, 0);
    }

    &.card-appear-done {
        transition: 0.5s all;
        opacity: 1;
        transform: scale(1, 1);
    }

    &.card-exit {
        opacity: 1;
        transform: scale(1, 1);
    }

    &.card-exit-active {
        transition: 0.5s all;
        opacity: 0;
        transform: scale(0, 0);
    }

    .header {
        display: flex;
        align-items: center;
        padding: 1rem 1.5rem;
        background: ${colors.rdgray2};

        .statusIcon {
            flex-shrink: 0;
            width: 4.3rem;
            height: 4.3rem;

            svg { 
                fill: ${props => {
        switch (props.status) {
            case statusEnum.RECEIVED:
                return colors.yellow;
            case statusEnum.INPROGRESS:
                return colors.orange;
            case statusEnum.COMPLETED:
                return colors.green;
            case statusEnum.SHIPPED:
                return colors.blue;
            default:
                return colors.yellow;
        }
    }};
                width: 100%; }
        }

        .text {
            margin-left: 1.5rem;
            color: #fff;

            .heading {
                margin-bottom: 0.2rem;
                font-size: 2.1rem; }

            .subheading { font-size: 1.5rem; }
        }
    }

    .body {       
        flex: 1;
        overflow: auto;
        padding: 1rem;

        .block {
            margin-bottom: 1.5rem;

            .heading { 
                font-size: 2rem;
                color: ${colors.rddarkgray};
                margin-bottom: 0.5rem; 

                &--colored {
                    padding: 0.3rem;
                    color: #fff;
                    background: ${colors.rdgray2};
                }
            }
            
            .content { font-size: 1.3rem; }
        }
    }

    .footer {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding: 1.5rem; }

    .serviceId { 
        font-size: 1.2rem;
        color: ${colors.rddarkgray}; }
`;

const StyledActions = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    padding: 0 0.3rem;
    font-size: 1.3rem;
    color: #000;
    
    .name { margin-bottom: 0.5rem; }
    
    .info { color: ${colors.rdgray}; }

    .price { 
        text-align: right; 
        color: ${colors.rdgray};
        font-size: 1.7rem;

        &--total {
            margin-top: 3rem;
            padding: 0.5rem;
            color: #000; 
            background: ${colors.rdlightgray}; }
    }
    
    .divider {
        grid-column: 1 / -1;
        margin: 1rem 0;
        height: 0.2rem;
        background-color: ${colors.rdlightgray}; }

    .total {
        margin-top: 3rem;
        padding: 0.5rem;
        font-size: 1.5rem;
        color: #000; 
        background: ${colors.rdlightgray};
        text-transform: uppercase; }
`;

const HistoryCard = (props) => {
    const { service, id } = props;
    const context = React.useContext(AppContext);

    /** Setting up the state **/
    const [state, setState] = React.useState({
        extended: false,
        showPrintPopup: false
    });

    /** Expand and collapse the HistoryCard **/
    const extendHistoryItem = () => setState({ ...state, extended: !state.extended });

    /** Render Methods **/
    const renderDevices = () => {
        if (service.devices === undefined) return null;
        return (
            service.devices.map((device, index) => {
                const coma = (index < service.devices.length - 1) ? ', ' : '';
                return `${device.name}${coma}`;
            })
        );
    }

    const renderStatusIcon = (status) => {
        switch (status) {
            case statusEnum.RECEIVED:
                return svgIcons.received;
            case statusEnum.INPROGRESS:
                return svgIcons.inProgress;
            case statusEnum.COMPLETED:
                return svgIcons.completed;
            case statusEnum.SHIPPED:
                return svgIcons.shipped;
            default:
                return svgIcons.received;
        }
    }

    const renderPricingTable = () => {
        return (
            <StyledActions>
                {renderActionsRows()}
                {renderNewDevicesRows()}
                {renderPricingTableFooter()}
            </StyledActions>
        )
    }

    const renderActionsRows = () => {
        return (
            service.actions.map((action, index) => {
                return (
                    <React.Fragment key={`action-${index}`}>
                        <div className="text">
                            <div className="name">{action.name}</div>
                            <div className="info">quantity: {action.quantity}</div>
                        </div>
                        <div className="price">$ {action.price * action.quantity}</div>
                        <div className="divider"></div>
                    </React.Fragment>
                )
            })
        )
    }

    const renderNewDevicesRows = () => {
        const { newDevices } = service;
        if (newDevices === undefined || newDevices === "") return null;
        return (
            newDevices.map((newDevice, index) => {
                return (
                    <React.Fragment key={`new-device-${index}`}>
                        <div className="text">
                            <div className="name">{newDevice.name}</div>
                            {newDevice.serial !== '' && <div className="info">serial number: <strong>{newDevice.serial}</strong></div>}
                            <div className="info">quantity: <strong>{newDevice.quantity}</strong></div>
                        </div>
                        <div className="price">$ {newDevice.price * newDevice.quantity}</div>
                        <div className="divider"></div>
                    </React.Fragment>
                )
            })
        )
    }

    const renderPricingTableFooter = () => {
        let newDevicesTotal = 0;
        const actionsTotal = service.actions.reduce((total, action) => {
            return total + action.quantity * action.price;
        }, 0);

        if (service.newDevices !== undefined && service.newDevices !== "") {
            newDevicesTotal = service.newDevices.reduce((total, newDevice) => {
                return total + newDevice.quantity * newDevice.price;
            }, 0);
        }

        return (
            <React.Fragment>
                <div className="total">Total</div>
                <div className="price price--total">$ {actionsTotal + newDevicesTotal}</div>
            </React.Fragment>
        );
    }

    return (
        <StyledHistoryCard status={service.status} extended={state.extended}>
            <div className="header">
                <div
                    className="statusIcon"
                    status={service.status}
                    dangerouslySetInnerHTML={{ __html: renderStatusIcon(service.status) }}>
                </div>
                <div className="text">
                    <div className="heading">
                        {service.customer && service.customer.name}
                    </div>
                    <div className="subheading">{service.customer && service.customer.phone}</div>
                </div>
            </div>
            <div className="body">
                <div className="block">
                    <div className="heading">Description</div>
                    <div className="content">{service.description}</div>
                </div>
                <div className="block">
                    <div className="heading">Devices</div>
                    <div className="content">
                        {renderDevices()}
                    </div>
                </div>
                <div className="block">
                    <div className="heading">Date</div>
                    <div className="content">
                        {new Date(service.date).toLocaleDateString()}
                    </div>
                </div>
                {state.extended && (
                    <React.Fragment>
                        <div className="block">
                            <div className="heading">Remarks</div>
                            <div className="content">{service.remark ? service.remark : 'No Remarks added yet.'}</div>
                        </div>
                        <div className="block">
                            <div className="heading heading--colored">Actions and new devices</div>
                            <div className="content">
                                {service.actions ? renderPricingTable() : 'No actions or new devices added yet.'}
                            </div>
                        </div>
                    </React.Fragment>
                )}
            </div>
            <div className="footer">
                <div className="serviceId">ID: {props.id}</div>
                <div className="buttons">
                    <IconButton
                        icon="update"
                        onClick={() => props.showPopup(service)} />
                    <IconButton
                        icon="delete"
                        onClick={() => props.updateDeletedServiceId(service._id)} />
                    <IconButton
                        icon="expand"
                        onClick={extendHistoryItem} />
                    <IconButton
                        icon="print"
                        onClick={() => props.showPrintPopup(service)} />
                </div>
            </div>
        </StyledHistoryCard>
    );
};

export default HistoryCard;
