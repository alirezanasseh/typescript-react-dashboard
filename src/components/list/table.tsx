import React, {useState} from 'react';
import {Button, Table} from 'react-bootstrap';
import Helper from '../../helpers';
import ProcessField from './processField';
import {ITableProps} from './types';
import {IModal} from '../myModal/types';
import MyModal from '../myModal';
import {useHistory} from 'react-router-dom';

export default function ListTable<T>(props: ITableProps<T>) {
    const {
        model,
        data,
        loading,
        sort,
        setSort,
        remove
    } = props;
    const [modal, setModal] = useState<IModal>({
        title: '',
        body: <></>,
        show: false
    });
    const history = useHistory();
    const path = window.location.pathname;

    const changeSort = (field: string) => {
        if (sort[field] === 1) {
            setSort({...sort, [field]: -1});
        } else if (sort[field] === -1) {
            const tempSort = {...sort};
            delete tempSort[field];
            setSort(tempSort);
        } else {
            setSort({...sort, [field]: 1});
        }
    };

    return (
        <>
            <MyModal modal={modal} setModal={setModal}/>
            <Table responsive>
                <thead>
                <tr>
                    {Object.keys(model.fields).map((field, index) => {
                        if (model.fields[field as keyof typeof model.fields].hide_in_list) {
                            return;
                        }
                        return <td key={index} className={'list-column'}>
                            {sort[field] === 1 && <span className={'list-column-sort-icon'}>&#8679;</span>}
                            {sort[field] === -1 && <span className={'list-column-sort-icon'}>&#8681;</span>}
                            <span
                                className={'list-column-title'}
                                onClick={() => changeSort(field)}
                            >
                                {Helper.string.snakeToSeparate(field)}
                            </span>
                        </td>;
                    })}
                    <td>Operations</td>
                </tr>
                </thead>
                <tbody>
                {(data && !loading) && data.map((item, index) => {
                    const id = Helper.object.hasOwnProperty(item, '_id') ? item._id : '';
                    return <tr key={index} id={'row_' + index}>
                        {Object.keys(model.fields).map((field, index) => {
                            if (model.fields[field as keyof typeof model.fields].hide_in_list) {
                                return;
                            }
                            return <td key={index}>
                                <ProcessField<T> props={{
                                    model: props.model,
                                    field: field,
                                    value: item[field as keyof T],
                                    setModal
                                }}/>
                            </td>;
                        })}
                        <td>
                            <div className={'list-operations'}>
                                <Button
                                    variant={'primary'}
                                    title={'Edit'}
                                    onClick={() => history.push(path + '/' + id)}
                                >
                                    <img className={'list-operations-icon'} src={'/edit.png'} alt={'Edit'}/>
                                </Button>
                                <Button
                                    variant={'danger'}
                                    title={'Remove'}
                                    id={'remove_' + index}
                                    onClick={() => remove(id, index)}
                                >
                                    <img className={'list-operations-icon'} src={'/trash.png'} alt={'Remove'}/>
                                </Button>
                            </div>
                        </td>
                    </tr>
                })}
                </tbody>
            </Table>
        </>
    );
}