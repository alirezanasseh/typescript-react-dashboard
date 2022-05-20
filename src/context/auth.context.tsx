import React, {createContext, useEffect, useReducer} from 'react';
import {IUser} from '../interfaces/project';
import {useXHR} from '../hooks';

interface IAuthValue {
    user?: Partial<IUser>;
}
interface IAuthAction {
    type: 'user_logged_in' | 'user_logout_out';
    user?: Partial<IUser>;
}
type IAuthDispatch = (action: IAuthAction) => void;

export const AuthContext = createContext<IAuthValue>({});

export const AuthDispatchContext = createContext<IAuthDispatch | null>(null);

export function AuthProvider(props: React.PropsWithChildren<any>) {
    const user = localStorage.getItem('user');
    const initialAuth: IAuthValue = {
        user: user ? JSON.parse(user) : undefined
    };
    const [auth, authDispatch] = useReducer(authReducer, initialAuth);
    const [, error, send] = useXHR();

    useEffect(() => {
        send({
            url: 'auth/check',
            method: 'POST'
        }, () => {});
    }, []);

    useEffect(() => {
        if (error) {
            authDispatch({type: 'user_logout_out'});
        }
    }, [error]);

    return (
        <AuthContext.Provider value={auth}>
            <AuthDispatchContext.Provider value={authDispatch}>
                {props.children}
            </AuthDispatchContext.Provider>
        </AuthContext.Provider>
    );
}

function authReducer(auth: IAuthValue, action: IAuthAction) {
    switch (action.type) {
        case 'user_logged_in': {
            localStorage.setItem('user', JSON.stringify(action.user));
            return {user: action.user};
        }
        case 'user_logout_out': {
            localStorage.removeItem('user');
            return {};
        }
    }
}