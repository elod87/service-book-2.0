import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import '../App.css';
import { AppProvider } from './AppProvider';
import PrivateRoute from './PrivateRoute';
import Login from './Login';
import Register from './Register';
import ResetPassword from './ResetPassword';
import ForgotPassword from './ForgotPassword';
import Main from './Main';
import Home from './Home';

const Router = () => {
    return (
        <AppProvider>
            <BrowserRouter>
                <Switch>
                    <Route exact path='/register' component={Register} />
                    <Route exact path='/reset-password/:userId/:token' component={ResetPassword} />
                    <Route exact path='/forgot-password' component={ForgotPassword} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/:userId/:token" render={(props) => <Home {...props} />} />
                    <PrivateRoute path='/' component={Main} />
                </Switch>
            </BrowserRouter>
        </AppProvider>
    )
}

export default Router;