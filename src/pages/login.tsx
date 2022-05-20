import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {Alert, Button, Form} from 'react-bootstrap';
import {useXHR} from '../hooks';
import {useHistory} from 'react-router-dom';
import {Loading} from '../components';
import {AuthContext, AuthDispatchContext} from '../context';

export default function Login() {
    const [item, setItem] = useState({
        email: '',
        password: ''
    });
    const [loading, error, send] = useXHR();
    const history = useHistory();
    const {user} = useContext(AuthContext);
    const authDispatch = useContext(AuthDispatchContext);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setItem({...item, [e.currentTarget.name]: e.currentTarget.value});
    };

    const submit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        send({
            url: 'auth/admin_login',
            method: 'POST',
            data: {
                email: item.email,
                password: item.password
            }
        }, response => {
            if (response?.data) {
                authDispatch!({
                    type: 'user_logged_in',
                    user: response.data.item
                });
            }
        });
    };

    useEffect(() => {
        if (user) {
            history.push('/');
        }
    }, [user]);

    return (
        <div className={'login-container'}>
            <div className={'login-box'}>
                {error && <Alert variant={'danger'}>{error}</Alert>}
                <Form onSubmit={submit}>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type={'email'}
                            placeholder={'Enter email'}
                            name={'email'}
                            value={item.email}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className={'mb-3'}>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type={'password'}
                            placeholder={'Password'}
                            name={'password'}
                            value={item.password}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Button
                        variant={'primary'}
                        type={'submit'}
                        disabled={loading}
                    >
                        {loading ? <Loading/> : 'Login'}
                    </Button>
                </Form>
            </div>
        </div>
    );
}