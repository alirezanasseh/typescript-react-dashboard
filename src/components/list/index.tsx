import React, {useEffect, useState} from 'react';
import {IModel} from '../../interfaces/system';
import Layout from '../../layout';
import {Alert} from 'react-bootstrap';
import {useXHR} from '../../hooks';
import {Loading} from '../index';
import {IParams} from '../../interfaces/system/xhr.interface';
import {populate} from '../populate';
import {ListPagination} from './pagination';
import ListHeader from './header';
import {ISort} from './types';
import ListTable from './table';
import ListSearch from './search';
import './styles.scss';

export default function List<T>(props: { model: IModel<T> }) {
    const [data, setData] = useState<Array<Partial<T>>>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 25,
        count: 0
    });
    const [sort, setSort] = useState<ISort>({});
    const [conditions, setConditions] = useState('');
    const [loading, error, send] = useXHR<T>();
    const [removeLoading, , removeSend] = useXHR();
    const [removingIndex, setRemovingIndex] = useState(-1);

    const getData = () => {
        let params: IParams = {
            page: pagination.page,
            pageSize: pagination.pageSize
        };
        const populateFields = populate(props.model.fields);
        if (populateFields) {
            params = {...params, populate: JSON.stringify(populateFields)};
        }
        if (Object.keys(sort).length > 0) {
            const strSort = Object.keys(sort).map(field => sort[field] === 1 ? field : '-' + field).join(' ');
            params = {...params, sort: strSort};
        }
        if (conditions) {
            params = {...params, conditions};
        }
        send({
            url: props.model.route,
            method: 'GET',
            params
        }, response => {
            if (response?.data?.list) {
                setData(response.data.list);
            }
            if (response?.data?.count) {
                setPagination({...pagination, count: response.data.count});
            }
        });
    };
    useEffect(getData, [pagination.page, pagination.pageSize, sort, conditions]);

    const remove = (id: string, index: number) => {
        if (!id) return;
        const ans = window.confirm('Are you sure you want to remove this record?');
        if (!ans) return;
        setRemovingIndex(index);
        removeSend({
            url: props.model.route + '/' + id,
            method: 'DELETE'
        }, () => {

        });
    };
    useEffect(() => {
        const removingButton = document.getElementById('remove_' + removingIndex);
        if (removingButton) {
            if (removeLoading) {
                removingButton.setAttribute('disabled', 'true');
            } else {
                const removedRow = document.getElementById('row_' + removingIndex);
                if (removedRow) {
                    removedRow.remove();
                }
            }
        }
    }, [removeLoading]);

    return (
        <Layout>
            <div className={'list'}>
                <h1>{props.model.title}</h1>

                <ListHeader
                    title={props.model.title}
                    pagination={pagination}
                    setPagination={setPagination}
                />

                <ListSearch<T>
                    model={props.model}
                    setConditions={setConditions}
                />

                {loading && <Loading/>}
                {error && <Alert variant={'danger'}>{error}</Alert>}

                <ListTable<T>
                    model={props.model}
                    data={data}
                    loading={loading}
                    sort={sort}
                    setSort={setSort}
                    remove={remove}
                />

                <ListPagination
                    pagination={pagination}
                    setPagination={setPagination}
                />
            </div>
        </Layout>
    );
}