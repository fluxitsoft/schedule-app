import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { startValidating } from '../actions/auth';
import { Login } from "../components/auth/Login";
import { CalendarScreen } from "../components/calendar/CalendarScreen";
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

export const AppRouter = () => {

    const dispatch = useDispatch();

    const {validating, username} = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(startValidating())
    }, [dispatch]);

    if (validating) {
        return(<h5>Loading...</h5>);
    }
    return (
        <Router>
            <div>
                <Switch>
                    <PublicRoute exact path="/login" component={Login} isAuthenticated={!!username}/>
                    <PrivateRoute exact path="/" component={CalendarScreen} isAuthenticated={!!username}/>
                    <Redirect to="/" />
                </Switch>
            </div>
        </Router>
    );
}
