import React, {useEffect, useState} from 'react';
import Layout from '../../layout';
import {IModel} from '../../interfaces/system';
import {Accordion, Alert, Button, Form, Table} from 'react-bootstrap';
import ProcessFieldItem from './processField.item';
import {IItemState} from './types';
import {IModal} from '../myModal/types';
import MyModal from '../myModal';
import {useXHR} from "../../hooks";
import {Loading} from "../index";
import {useHistory} from "react-router-dom";
import {populate} from "../populate";
import {IParams} from "../../interfaces/system/xhr.interface";
import Helper from '../../helpers';
import ProcessField from '../list/processField';
import '../list/styles.scss';

export default function Item<T>(props: {model: IModel<T>}) {
    const modelFields = props.model.fields;
    let id = '';
    const path = window.location.pathname;
    const slashPos = path.substring(1).indexOf('/');
    const tail = path.substring(slashPos + 2);
    if (tail !== 'add') {
        id = tail;
    }

    const initialize = (curLevelFields: any) => {
        let tempItem: IItemState = {};
        if (!curLevelFields) return tempItem;
        for (const field of Object.keys(curLevelFields)) {
            switch (curLevelFields[field].type) {
                case 'text':
                case 'textarea':
                case 'foreign':
                case 'list':
                case 'image':
                case 'password':
                case 'json':
                    tempItem[field] = '';
                    break;
                case 'number':
                case 'currency':
                    tempItem[field] = 0;
                    break;
                case 'date':
                case 'datetime':
                    tempItem[field] = new Date();
                    break;
                case 'time':
                    tempItem[field] = '00:00';
                    break;
                case 'foreign_array':
                    tempItem[field] = [];
                    break;
                case 'boolean':
                    tempItem[field] = false;
                    break;
                case 'nested':
                    tempItem[field] = initialize(curLevelFields[field].fields);
                    break;
            }
        }
        return tempItem;
    };
    const [item, setItem] = useState<IItemState>({});
    const [JSONArrayNewItem, setJSONArrayNewItem] = useState<IItemState>({});
    const [foreignFields, setForeignFields] = useState<IItemState>({});
    const [modal, setModal] = useState<IModal>({
        title: '',
        body: <></>,
        show: false
    });
    const [loading, error, send] = useXHR();
    const [editLoading, , editSend] = useXHR();
    const history = useHistory();

    const processFields = (fields: any, responseItem: any): { item: IItemState, foreign: IItemState } => {
        let tempItem: IItemState = {};
        let tempForeign: IItemState = {};
        if (!fields) {
            return {
                item: tempItem,
                foreign: tempForeign
            }
        }
        for (const field of Object.keys(fields)) {
            const fieldProps = fields[field as keyof typeof fields];
            if (fieldProps.hide_in_item) continue;
            let value: any = responseItem[field as keyof typeof responseItem];
            if (fieldProps.type === 'nested') {
                const result = processFields(fieldProps.fields, responseItem[field]);
                tempItem[field] = result.item;
                tempForeign[field] = result.foreign;
            } else {
                if (fieldProps.type === 'foreign' && value) {
                    if (typeof value === 'object') {
                        tempForeign[field] = value[fieldProps.foreign?.field] ?? value._id;
                        value = value._id;
                    } else {
                        tempForeign[field] = value;
                    }
                }
                if (fieldProps.type === 'foreign_array' && value && Array.isArray(value)) {
                    tempForeign[field] = [];
                    tempItem[field] = [];
                    for (let i = 0; i < value.length; i++) {
                        let val = value[i];
                        if (typeof val === 'object') {
                            tempForeign[field].push({id: val._id, text: val[fieldProps.foreign?.field] ?? val._id});
                            val = val._id;
                        } else {
                            tempForeign[field] = val;
                        }
                        tempItem[field].push(val);
                    }
                } else {
                    tempItem[field] = value;
                }
            }
        }
        return {
            item: tempItem,
            foreign: tempForeign
        }
    };

    const getItem = () => {
        let params: IParams = {};
        const populateFields = populate(modelFields);
        if (populateFields) {
            params = {...params, populate: JSON.stringify(populateFields)};
        }
        editSend({
            url: props.model.route + '/' + id,
            method: 'GET',
            params
        }, response => {
            if (response?.data?.item) {
                let responseItem = response.data.item;
                const values = processFields(modelFields, responseItem);
                setItem(values.item);
                setForeignFields(values.foreign);
            }
        });
    };

    useEffect(() => {
        // console.log(item);
    }, [item]);

    useEffect(() => {
        if (id) {
            getItem();
        } else {
            setItem(initialize(modelFields));
        }
    }, []);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (id) {
            const data = {...item};
            delete data._id;
            send({
                url: props.model.route + '/' + id,
                method: 'PUT',
                data
            }, () => {
                history.push('/' + props.model.route);
            });
        } else {
            send({
                url: props.model.route,
                method: 'POST',
                data: item
            }, () => {
                history.push('/' + props.model.route);
            });
        }
    };

    useEffect(() => {
        if (error) {
            window.scrollTo({top: 0});
        }
    }, [error]);

    const setInnerItem = (field: string, innerItem: IItemState) => {
        setItem({
            ...item,
            [field]: innerItem
        });
    };

    const addJSONRow = (name: string) => {
        let tempItem = {...item};
        const tempJSONItem = {...JSONArrayNewItem};
        if (tempItem[name]) {
            tempItem[name].push(tempJSONItem);
        } else {
            tempItem[name] = [tempJSONItem];
        }
        setItem(tempItem);
        const innerFields = modelFields[name as keyof typeof modelFields].fields;
        setJSONArrayNewItem(initialize(innerFields));
    };

    return (
        <Layout>
            <MyModal modal={modal} setModal={setModal}/>
            <h1>{id ? 'Edit' : 'Add'} {props.model.title}</h1>
            {error && <Alert variant={'danger'}>{error}</Alert>}
            <Form onSubmit={submit}>
                {(!id || !editLoading) && Object.keys(modelFields).map((field, index) => {
                    const fieldProps = modelFields[field as keyof typeof modelFields];
                    if (field === '_id' || fieldProps.hide_in_item) {
                        return;
                    }
                    if (fieldProps.type === 'nested') {
                        return <Accordion defaultActiveKey={'0'} key={'nested_' + index}>
                            <Accordion.Item eventKey={'0'}>
                                <Accordion.Header>{Helper.string.snakeToSeparate(field)}</Accordion.Header>
                                <Accordion.Body>
                                    {fieldProps.fields && Object.keys(fieldProps.fields).map((innerField, innerIndex) => {
                                        if (innerField !== '_id') {
                                            return <ProcessFieldItem
                                                key={innerIndex}
                                                id={id}
                                                name={innerField}
                                                fieldProps={fieldProps!.fields![innerField as keyof typeof fieldProps.fields]}
                                                item={{[field]: item[field]}}
                                                setItem={(innerItem) => setInnerItem(field, innerItem)}
                                                foreignFields={foreignFields[field]}
                                            />;
                                        }
                                    })}
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>;
                    } else if (fieldProps.type === 'nested_array') {
                        return <Accordion defaultActiveKey={'0'} key={'nested_' + index}>
                            <Accordion.Item eventKey={'0'}>
                                <Accordion.Header>{Helper.string.snakeToSeparate(field)}</Accordion.Header>
                                <Accordion.Body>
                                    {/* List */}
                                    <div className={'list'}>
                                    <Table responsive>
                                        <thead>
                                        <tr>
                                            {fieldProps.fields && Object.keys(fieldProps.fields).map((innerField, innerIndex) =>
                                                <th key={innerIndex}>{Helper.string.snakeToSeparate(innerField)}</th>
                                            )}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {item[field] && Array.isArray(item[field]) && item[field].map((rowItem: any, rowIndex: number) => {
                                            console.log(rowItem);
                                            return <tr key={rowIndex}>
                                                {fieldProps.fields && Object.keys(fieldProps.fields).map((innerField, innerIndex) => {
                                                    return <td key={innerIndex}>
                                                        <ProcessField props={{
                                                            model: {
                                                                title: '',
                                                                route: '',
                                                                fields: fieldProps.fields!
                                                            },
                                                            field: innerField,
                                                            value: rowItem[innerField],
                                                            setModal
                                                        }}/>
                                                    </td>
                                                })}
                                            </tr>
                                        })}
                                        </tbody>
                                    </Table>
                                    </div>
                                    {/* Add */}
                                    <Accordion>
                                        <Accordion.Header bsPrefix={'list-json-array-add-header'}>Add</Accordion.Header>
                                        <Accordion.Body>
                                            {fieldProps.fields && Object.keys(fieldProps.fields).map((innerField, innerIndex) => {
                                                if (innerField !== '_id') {
                                                    return <ProcessFieldItem
                                                        key={innerIndex}
                                                        id={id}
                                                        name={innerField}
                                                        fieldProps={fieldProps!.fields![innerField as keyof typeof fieldProps.fields]}
                                                        item={JSONArrayNewItem}
                                                        setItem={setJSONArrayNewItem}
                                                        foreignFields={foreignFields[field] || {}}
                                                    />;
                                                }
                                            })}
                                            <div className={'mb-1'}>&nbsp;</div>
                                            <Button
                                                onClick={() => addJSONRow(field)}
                                            >
                                                Add
                                            </Button>
                                            <div className={'mb-1'}>&nbsp;</div>
                                        </Accordion.Body>
                                    </Accordion>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>;
                    } else {
                        return <ProcessFieldItem
                            key={index}
                            id={id}
                            name={field}
                            fieldProps={modelFields[field as keyof typeof modelFields]}
                            item={item}
                            setItem={setItem}
                            foreignFields={foreignFields}
                        />;
                    }
                })}
                <div className={'mb-1'}>&nbsp;</div>
                <Button
                    type={'submit'}
                    variant={'primary'}
                    disabled={loading}
                >
                    {loading ? <Loading/> : 'Save'}
                </Button>
            </Form>
            <div className={'mb-5'}>&nbsp;</div>
        </Layout>
    );
}