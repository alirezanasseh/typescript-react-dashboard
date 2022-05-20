import React, {useContext, useEffect} from 'react';
import {Container, Navbar, Offcanvas, Nav} from 'react-bootstrap';
import {AuthContext, AuthDispatchContext} from '../context';
import {useXHR} from '../hooks';
import {useHistory} from 'react-router-dom';
import Models from '../models';

export default function Layout(props: React.PropsWithChildren<any>) {
    const {user} = useContext(AuthContext);
    const authDispatch = useContext(AuthDispatchContext);
    const [,,send] = useXHR();
    const history = useHistory();

    const logout = () => {
        send({
            url: 'auth/logout',
            method: 'POST'
        }, () => {
            authDispatch!({type: 'user_logout_out'});
        });
    };

    useEffect(() => {
        if (!user) {
            history.push('/login');
        }
    }, [user]);

    return (
        <div className={'page'}>
            <Navbar bg='light' expand={false}>
                <Container fluid>
                    <Navbar.Brand href='/'>Lisani</Navbar.Brand>
                    <Navbar.Toggle aria-controls='offCanvasNavbar'/>
                    <Navbar.Offcanvas
                        id='offCanvasNavbar'
                        aria-labelledby='offCanvasNavbarLabel'
                        placement='end'
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title id='offCanvasNavbarLabel'>Menu</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <Nav className='justify-content-end flex-grow-1 pe-3'>
                                <Nav.Link href='/'>Home</Nav.Link>
                                {Models.map((model, index) =>
                                    <Nav.Link key={index} href={'/' + model.model.route}>{model.model.title}</Nav.Link>
                                )}
                                <Nav.Link href='/change_password'>Change Password</Nav.Link>
                                <Nav.Link href='#' onClick={logout}>Logout</Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
            <Container fluid>
                {props.children}
            </Container>
        </div>
    );
}