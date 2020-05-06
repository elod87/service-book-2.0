import { endpointUrl } from '../helpers';

export default (token) => {
    const request = new XMLHttpRequest();
    request.open('GET', `${endpointUrl}/users/me`, false);  // `false` makes the request synchronous
    request.setRequestHeader('x-auth-token', token);
    request.send(null);

    if (request.status === 200) {
        const user = JSON.parse(request.responseText);
        return {
            error: false,
            data: user
        };
    } else {
        const errorText = request.responseText;
        return {
            error: true,
            data: errorText
        };
    }

    /*
    const response = await fetch(`${endpointUrl}/users/me`, {
        method: 'GET',
        headers: {
            'x-auth-token': token,
        }
    });

    if (response.status === 200) {
        const user = await response.json();
        return {
            error: false,
            data: user
        };
    } else {
        const errorText = await response.text();
        return {
            error: true,
            data: errorText
        };
    }
    */

}   
