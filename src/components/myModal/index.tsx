import React from 'react';
import {IModalProps} from './types';
import {Button, Modal} from 'react-bootstrap';

export default function MyModal(props: IModalProps) {
    const {modal, setModal} = props;

    const handleCloseModal = () => setModal({
        title: '',
        body: <></>,
        show: false
    });

    return (
        <Modal show={modal.show} onHide={handleCloseModal} size={'lg'}>
            <Modal.Header closeButton>
                <Modal.Title>{modal.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {modal.body}
            </Modal.Body>

            <Modal.Footer>
                <Button variant={'primary'} onClick={handleCloseModal}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}