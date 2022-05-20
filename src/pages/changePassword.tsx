import React, {useState} from 'react';
import Layout from '../layout';
import {Alert, Button, Form} from 'react-bootstrap';
import {useXHR} from '../hooks';
import {Loading} from '../components';

export default function ChangePassword() {
    const [item, setItem] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [message, setMessage] = useState(<></>);
    const [loading, error, send] = useXHR();

    const change = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setItem({...item, [e.currentTarget.name]: e.currentTarget.value});
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (item.new !== item.confirm) {
            setMessage(<Alert variant={'danger'}>Confirm password doesn't match</Alert>);
            return;
        }
        setMessage(<></>);
        send({
            url: 'auth/change_password',
            method: 'POST',
            data: {
                current: item.current,
                new: item.new
            }
        }, () => {
            setMessage(<Alert variant={'success'}>Password updated successfully.</Alert>)
        });
    };

    return (
        <Layout>
            <h1>Change Password</h1>
            {message}
            {error && <Alert variant={'danger'}>{error}</Alert>}
            <Form onSubmit={submit}>
                <Form.Group className={'mb-3'}>
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                        type={'password'}
                        name={'current'}
                        value={item.current}
                        onChange={change}
                        required
                        autoComplete={'new-password'}
                    />
                </Form.Group>
                <Form.Group className={'mb-3'}>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type={'password'}
                        name={'new'}
                        value={item.new}
                        onChange={change}
                        required
                        autoComplete={'new-password'}
                    />
                </Form.Group>
                <Form.Group className={'mb-3'}>
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                        type={'password'}
                        name={'confirm'}
                        value={item.confirm}
                        onChange={change}
                        required
                        autoComplete={'new-password'}
                    />
                </Form.Group>
                <Button
                    variant={'primary'}
                    type={'submit'}
                    disabled={loading}
                >
                    {loading ? <Loading/> : 'Change'}
                </Button>
            </Form>
        </Layout>
    );
}