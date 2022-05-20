import React from 'react';
import {Spinner} from 'react-bootstrap';

export default function Loading() {
    return (
        <Spinner
            as={'span'}
            animation={'border'}
            size={'sm'}
            role={'status'}
        >
            <span className={'visually-hidden'}>Loading...</span>
        </Spinner>
    );
}