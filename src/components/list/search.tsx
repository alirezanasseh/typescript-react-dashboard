import React, {useState} from 'react';
import {IResultCondition, ISearchConditions, ISearchProps} from './types';
import {Accordion, Button, Form} from 'react-bootstrap';
import Helper from '../../helpers';

export default function ListSearch<T>(props: ISearchProps<T>) {
    const {fields} = props.model;
    const [conditions, setConditions] = useState<ISearchConditions>([{
        field: '',
        value: '',
        type: 'exact'
    }]);

    const changeField = (e: React.FormEvent<HTMLSelectElement>, index: number) => {
        const tempConditions = JSON.parse(JSON.stringify(conditions));
        tempConditions[index].field = e.currentTarget.value;
        setConditions(tempConditions);
    };

    const changeValue = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, index: number) => {
        const tempConditions = JSON.parse(JSON.stringify(conditions));
        tempConditions[index].value = e.currentTarget.value;
        setConditions(tempConditions);
    };

    const changeType = (e: React.FormEvent<HTMLSelectElement>, index: number) => {
        const tempConditions = JSON.parse(JSON.stringify(conditions));
        tempConditions[index].type = e.currentTarget.value;
        setConditions(tempConditions);
    };

    const addNewCondition = () => {
        const tempConditions = JSON.parse(JSON.stringify(conditions));
        tempConditions.push({
            field: '',
            value: '',
            type: 'exact'
        });
        setConditions(tempConditions);
    };

    const removeCondition = (index: number) => {
        const tempConditions = JSON.parse(JSON.stringify(conditions));
        if (index === 0) {
            tempConditions[0] = {
                field: '',
                value: '',
                type: 'exact'
            };
        } else {
            tempConditions.splice(index, 1);
        }
        setConditions(tempConditions);
    };

    const search = () => {
        let resultConditions: IResultCondition = {};
        let cond;
        for (let i = 0; i < conditions.length; i++) {
            cond = conditions[i];
            if (cond.field && cond.value) {
                switch (cond.type) {
                    case 'exact':
                        resultConditions[cond.field] = cond.value;
                        break;
                    case 'start':
                        resultConditions[cond.field] = {'$regex': '^' + cond.value};
                        break;
                    case 'end':
                        resultConditions[cond.field] = {'$regex': cond.value + '$'};
                        break;
                    case 'contain':
                        resultConditions[cond.field] = {'$regex': cond.value};
                        break;
                }
            }
        }
        props.setConditions(JSON.stringify(resultConditions));
    };

    return (
        <div className={'list-search'}>
            <Accordion>
                <Accordion.Item eventKey={'0'}>
                    <Accordion.Header>Search</Accordion.Header>
                    <Accordion.Body>
                        {conditions.map((condition, index) => {
                            const currentField = fields[conditions[index].field as keyof typeof fields];
                            return (
                                <div className={'list-search-row'} key={index}>
                                    <Form.Select
                                        name={'field'}
                                        value={conditions[index].field}
                                        onChange={event => changeField(event, index)}
                                    >
                                        <option value={''} disabled>{'Please select the field'}</option>
                                        {Object.keys(fields).map(field =>
                                            <option key={field} value={field}>{Helper.string.snakeToSeparate(field)}</option>
                                        )}
                                    </Form.Select>
                                    {currentField && currentField.type === 'list' ?
                                        <Form.Select
                                            name={'value'}
                                            value={conditions[index].value}
                                            onChange={event => changeValue(event, index)}
                                        >
                                            <option value={''} disabled>{'Please select the ' + conditions[index].field}</option>
                                            {currentField.list && Object.keys(currentField.list).map(item =>
                                                <option value={item}>{currentField.list ? currentField.list[item] : ''}</option>
                                            )}
                                        </Form.Select>
                                        :
                                        <Form.Control
                                            type={'text'}
                                            name={'value'}
                                            value={conditions[index].value}
                                            onChange={event => changeValue(event, index)}
                                        />
                                    }
                                    <Form.Select
                                        name={'type'}
                                        value={conditions[index].type}
                                        onChange={event => changeType(event, index)}
                                    >
                                        <option value={'exact'}>Exact Match</option>
                                        <option value={'start'}>Starts With</option>
                                        <option value={'end'}>Ends With</option>
                                        <option value={'contain'}>Contains</option>
                                    </Form.Select>
                                    <Button variant={'danger'} onClick={() => removeCondition(index)}>X</Button>
                                </div>
                            )
                        })}
                        <div className={'list-search-buttons-row'}>
                            <Button variant={'secondary'} onClick={addNewCondition}>Add New Condition</Button>
                            <Button variant={'primary'} onClick={search}>Search</Button>
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
}