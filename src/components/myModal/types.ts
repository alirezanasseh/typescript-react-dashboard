import React from 'react';

export interface IModal {
    title: string;
    body: React.ReactElement,
    show: boolean;
}

export interface IModalProps {
    modal: IModal;
    setModal: (x: IModal) => void;
}
