import React, {useEffect, useState} from 'react';
import {IModel} from '../../interfaces/system';
import moment from 'moment';
import {Button, Table} from 'react-bootstrap';
import {IModal} from '../myModal/types';
import Helper from '../../helpers';

interface IProcessFieldProps<T> {
    props: {
        model: IModel<T>;
        field: string;
        value: any;
        setModal: (modal: IModal) => void;
    }
}

export default function ProcessField<T>(props: IProcessFieldProps<T>) {
    const {
        model,
        field,
        value,
        setModal
    } = props.props;
    const [fieldValue, setFieldValue] = useState<React.ReactElement>(<div/>);
    const [showID, setShowID] = useState(false);

    const showNested = (field: string, value: object) => {
        const body = <Table responsive>
            <tbody>
            {Object.entries(value).map(([key, val], index) =>
                <tr key={index}>
                    <td>{JSON.stringify(key)}</td>
                    <td>{JSON.stringify(val)}</td>
                </tr>
            )}
            </tbody>
        </Table>

        setModal({
            title: field,
            body,
            show: true
        });
    };

    const process = () => {
        const modelField = model.fields[field as keyof typeof model.fields];
        let result = <></>;
        if (value) {
            switch (modelField.type) {
                case 'number':
                case 'text':
                case 'textarea':
                    if (value.toString().length > 50) {
                        result = <>{value.toString().substring(0, 50) + '...'}</>;
                    } else {
                        result = value;
                    }
                    break;
                case 'json':
                    result = <>{JSON.stringify(value)}</>
                    break;
                case 'foreign':
                    result = value[modelField.foreign?.field as keyof typeof value];
                    break;
                case 'foreign_array':
                    if (value && Array.isArray(value) && modelField.foreign) {
                        result = <>
                            {value.map(val => val[modelField.foreign!.field]).join(', ')}
                        </>;
                    }
                    break;
                case 'text_array':
                    if (modelField && modelField.list && value && Array.isArray(value)) {
                        result = <>
                            {value.map((val: string) => modelField.list![val]).join(', ')}
                        </>;
                    }
                    break;
                case 'date':
                    result = <>{moment(value, 'YYYY-MM-DDTHH:mm:ss').format('YYYY/MM/DD')}</>;
                    break;
                case 'time':
                    result = <>{moment(value, 'YYYY-MM-DDTHH:mm:ss').format('HH:mm:ss')}</>;
                    break;
                case 'datetime':
                    result = <>{moment(value, 'YYYY-MM-DDTHH:mm:ss').format('YYYY/MM/DD HH:mm:ss')}</>;
                    break;
                case 'function':
                    if (modelField.function) {
                        result = modelField.function(value);
                    }
                    break;
                case 'list':
                    if (modelField.list) {
                        result = <>{modelField.list[value as keyof typeof modelField.list]}</>;
                    }
                    break;
                case 'image':
                    result = <img src={value} alt={field} className={'list-image'}/>;
                    break;
                case 'nested':
                    result = <Button variant={'info'} onClick={() => showNested(field, value)}>{Helper.string.snakeToSeparate(field)}</Button>
                    break;
                case 'currency':
                    result = <>{new Intl.NumberFormat().format(value)}</>
                    break;
                case 'id':
                    result = <Button variant={'info'} onClick={() => setShowID(true)}>ID</Button>;
                    break;
            }
        }
        setFieldValue(<>{result}</>);
    };
    useEffect(process, []);

    return (
        <div>
            {fieldValue}
            {showID && <div className={'list-id'}>
                <div className={'list-id-container'}>
                    <div className={'list-id-container-row'}>
                        <div>{value}</div>
                        <Button variant={'danger'} size={'sm'} onClick={() => setShowID(false)}>X</Button>
                    </div>
                </div>
            </div>}
        </div>
    );
}