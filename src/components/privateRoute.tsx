import React, {useContext} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {AuthContext} from '../context';

export default function PrivateRoute(props: React.PropsWithChildren<any>) {
    const {user} = useContext(AuthContext);
    return user ? <Route {...props}/> : <Redirect to={'/login'}/>;
}