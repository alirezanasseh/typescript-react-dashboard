import React from 'react';
import {Button, Form} from 'react-bootstrap';
import {IListHeaderProps} from './types';
import {useHistory} from 'react-router-dom';

export default function ListHeader(props: IListHeaderProps) {
    const {title, pagination, setPagination} = props;
    const history = useHistory();
    const path = window.location.pathname;

    const changePageSize = (e: React.FormEvent<HTMLSelectElement>) => {
        setPagination({
            ...pagination,
            pageSize: parseInt(e.currentTarget.value)
        });
    };

    return (
        <>
            <div className={'list-header'}>
                <div>
                    <Button onClick={() => history.push(path + '/add')}>{'Add ' + title}</Button>
                </div>
                <div>
                    <p>Count: {pagination.count}</p>
                </div>
                <div className={'list-header-page-size'}>
                    <div>Rows Per Page:</div>
                    <div>
                        <Form.Select name={'pageSize'} value={pagination.pageSize} onChange={changePageSize}>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={500}>500</option>
                        </Form.Select>
                    </div>
                </div>
            </div>
        </>
    );
}