import React, {useEffect, useState} from 'react';
import {Form} from 'react-bootstrap';
import {IProcessTypeItemProps, FileEvent} from './types';
import Helper from '../../helpers';
import ImageCropper from '../imageCropper';
import {useXHR} from '../../hooks';
import {Loading} from '../index';
import AutoComplete from '../autoComplete';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimeField from "react-simple-timefield";
import ForeignArray from './foreignArray';
import {FaFile} from 'react-icons/all';
import config from '../../config';
import './styles.scss';

export default function ProcessFieldItem(props: IProcessTypeItemProps) {
    const {
        name,
        fieldProps,
        item,
        setItem,
        foreignFields
    } = props;
    const [uploadLoading, uploadError, uploadSend] = useXHR<{ destination: string; filename: string }>();
    const [, , foreignSend] = useXHR();
    const [currency, setCurrency] = useState('');
    const [autoCompleteValue, setAutoCompleteValue] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [time, setTime] = useState('');
    const [resultField, setResultField] = useState(<></>);

    useEffect(() => {
        if (props.id && foreignFields && foreignFields[name]) {
            setAutoCompleteValue(foreignFields[name]);
        }
    }, []);

    const changeMultipleList = (e: React.FormEvent<HTMLSelectElement>) => {
        let options = Array.from(e.currentTarget.options);
        let values = options.filter(option => option.selected).map(option => option.value);
        setItem({...item, [name]: values});
    };

    const changeField = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        let value: any = e.currentTarget.value;
        if (fieldProps.type === 'number') {
            value = parseInt(value);
        }
        setItem({...item, [name]: value});
    };

    const changeCheckBox = (e: React.FormEvent<HTMLInputElement>) => {
        let checked = e.currentTarget.checked;
        if (checked) {
            setItem({...item, [name]: true});
        } else {
            setItem({...item, [name]: false});
        }
    };

    const changeCurrency = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.currentTarget.value;
        const number = Helper.number.getNumber(value);
        setItem({...item, [name]: number});
        setCurrency(Helper.number.formatNumber(number));
    };

    const uploadFile = (e: FileEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.target && e.target.files) {
            const file = e.target.files[0];
            upload(file);
        }
    };

    const upload = (file: Blob) => {
        let data = new FormData();
        data.append('type', name);
        data.append('file', file);

        uploadSend({
            url: 'upload',
            method: 'POST',
            data
        }, response => {
            const uploadedFile = response?.data?.item;
            const url = config.server + '/files/' + uploadedFile?.filename;
            if (url) {
                if (fieldProps.type === 'images' || fieldProps.type === 'file_array' || fieldProps.type === 'video_array') {
                    let arrayField = item[name];
                    if (arrayField) {
                        arrayField.push(url);
                    } else {
                        arrayField = [url];
                    }
                    setItem({...item, [name]: arrayField});
                } else {
                    setItem({...item, [name]: url});
                }
            }
        });
    };

    const getForeignData = (value: string, cb: (result: Array<any>) => void) => {
        const conditions = {
            [fieldProps.foreign?.field || '']: {
                '$regex': value,
                '$options': 'i'
            }
        };

        foreignSend({
            url: fieldProps.foreign?.route,
            method: 'GET',
            params: {
                page: 1,
                pageSize: 5,
                conditions
            }
        }, response => {
            if (response?.data?.list) {
                const field = fieldProps.foreign?.field;
                cb(response.data.list.map(item => {
                    const id = Helper.object.hasOwnProperty(item, '_id') ? item._id : '';
                    let name: any;
                    if (field) {
                        name = Helper.object.hasOwnProperty(item, field) ? item[field] : '';
                    }
                    if (!id || !name) return;
                    return {id, name};
                }));
            }
        });
    };

    const changeAutoComplete = (value: any) => {
        if (value === undefined) {
            setItem({...item, [name]: ''});
        } else {
            setItem({...item, [name]: value.id});
        }
    };

    const changeDateTime = (date: Date) => {
        setStartDate(date);
        setItem({...item, [name]: date.toISOString()});
    };

    const changeTime = (e: React.FormEvent, t: string) => {
        setTime(t);
        setItem({...item, [name]: t});
    };

    const removeItem = (e: React.FormEvent, index: number) => {
        e.preventDefault();
        let arrayField = item[name];
        arrayField.splice(index, 1);
        setItem({...item, [name]: arrayField});
    };

    const remove = (e: React.FormEvent) => {
        e.preventDefault();
        setItem({...item, [name]: ''});
    };

    const changForeignArray = (values?: Array<string>) => {
        setItem({...item, [name]: values});
    };

    const generateResult = () => {
        let result = <></>;
        switch (fieldProps.type) {
            case 'text':
                result = <Form.Control
                    type={'text'}
                    name={name}
                    value={item[name]}
                    onChange={changeField}
                />;
                break;
            case 'password':
                result = <Form.Control
                    type={'password'}
                    autoComplete={'new-password'}
                    name={name}
                    value={item[name]}
                    onChange={changeField}
                />;
                break;
            case 'textarea':
                result = <Form.Control
                    as={'textarea'}
                    rows={fieldProps.rows || 3}
                    name={name}
                    value={item[name]}
                    onChange={changeField}
                />;
                break;
            case 'json':
                result = <Form.Control
                    as={'textarea'}
                    rows={fieldProps.rows || 3}
                    name={name}
                    value={JSON.stringify(item[name])}
                    onChange={changeField}
                />;
                break;
            case 'number':
                result = <Form.Control
                    type={'number'}
                    name={name}
                    value={item[name]}
                    onChange={changeField}
                />;
                break;
            case 'currency':
                result = <Form.Control
                    type={'text'}
                    name={name}
                    value={currency}
                    onChange={changeCurrency}
                />;
                break;
            case 'image':
                result = <div className={'crop-image-field-container'}>
                    {item[name] ?
                        <>
                            <ImageCropper
                                handleCroppedImage={upload}
                                error={!!uploadError}
                                field={name}
                                default={item[name]}
                                width={fieldProps.image_width}
                                height={fieldProps.image_height}
                            />
                            <button
                                key={`image_remove_${name}`}
                                title={'حذف'}
                                onClick={remove}
                                className={'remove-item'}
                            >×</button>
                        </>
                        :
                        <ImageCropper
                            handleCroppedImage={upload}
                            error={!!uploadError}
                            field={name}
                            width={fieldProps.image_width}
                            height={fieldProps.image_height}
                        />
                    }
                    {uploadLoading &&
                    <div className={'crop-image-loading-container'}>
                        <Loading/>
                    </div>
                    }
                </div>;
                break;
            case 'images':
                result = <div className={'crop-image-field-container'}>
                    <ImageCropper
                        handleCroppedImage={upload}
                        error={!!uploadError}
                        field={name}
                        width={fieldProps.image_width}
                        height={fieldProps.image_height}
                    />
                    {item[name] && item[name].length > 0 && item[name].map((val: string, index: number) =>
                        <div className={'array_field_item'}>
                            <img key={`img_${name}_${index}`} src={val} alt={name} className="icon"/>
                            <button
                                key={`img_remove_${name}_${index}`}
                                title={'حذف'}
                                onClick={(e) => removeItem(e, index)}
                                className={'remove-item'}
                            >×</button>
                        </div>
                    )}
                </div>;
                break;
            case 'list':
                result = <Form.Select
                    name={name}
                    value={item[name]}
                    defaultValue={''}
                    onChange={changeField}
                >
                    <option value={''} disabled>{'Please select ' + name}</option>
                    {fieldProps.list && Object.keys(fieldProps.list).map((key, index) =>
                        <option key={index} value={key}>{fieldProps.list && fieldProps.list[key]}</option>
                    )}
                </Form.Select>;
                break;
            case 'text_array':
                result = <Form.Select
                    name={name}
                    value={item[name]}
                    defaultValue={[]}
                    onChange={changeMultipleList}
                    multiple
                >
                    {fieldProps.list && Object.keys(fieldProps.list).map((key, index) =>
                        <option key={index} value={key}>{fieldProps.list && fieldProps.list[key]}</option>
                    )}
                </Form.Select>;
                break;
            case 'foreign':
                result = <AutoComplete<string>
                    id={'autoComplete_' + name}
                    placeholder={'Please select ' + Helper.string.snakeToSeparate(name)}
                    getData={getForeignData}
                    result={changeAutoComplete}
                    default={''}
                    value={autoCompleteValue}
                    setValue={setAutoCompleteValue}
                />;
                break;
            case 'foreign_array':
                if (fieldProps.foreign) {
                    result = <ForeignArray
                        field={fieldProps.foreign.field}
                        route={fieldProps.foreign.route}
                        values={foreignFields[name]}
                        setValues={changForeignArray}
                    />;
                }
                break;
            case 'boolean':
                result = <Form.Check
                    type={'checkbox'}
                    label={Helper.string.snakeToSeparate(name)}
                    name={name}
                    onChange={changeCheckBox}
                    value={item[name] ?? false}
                />;
                break;
            case 'date':
                result = <ReactDatePicker
                    selected={startDate}
                    onChange={changeDateTime}
                />;
                break;
            case 'datetime':
                result = <ReactDatePicker
                    showTimeSelect
                    selected={startDate}
                    dateFormat={'yyyy/MM/dd HH:mm:ss'}
                    onChange={changeDateTime}
                />;
                break;
            case 'time':
                result = <div>
                    {/* @ts-ignore */}
                    <TimeField
                        value={time}
                        onChange={changeTime}
                        style={{width: '50px'}}
                    >{' '}</TimeField>
                </div>;
                break;
            case 'file':
            case 'video':
                result = <>
                    <Form.Control
                        id={'file_' + name}
                        type={'file'}
                        onChange={uploadFile}
                    />
                    {item[name] &&
                        <div className={'single_field'}>
                            <a href={item[name]} target={'_blank'}>
                                {fieldProps.type === 'video' ?
                                    <img src={item[name].substring(0, item[name].lastIndexOf('.')) || '' + '.png'} alt={'thumbnail'} className={'icon'}/>
                                    :
                                    <FaFile
                                        size={100}
                                        title={item[name]}
                                    />
                                }
                            </a>
                            <button
                                key={`file_remove_${name}`}
                                title={'حذف'}
                                onClick={remove}
                                className={'remove-item'}
                            >×</button>
                        </div>
                    }
                </>;
                break;
            case 'file_array':
            case 'video_array':
                result = <>
                    <Form.Control
                        id={'file_' + name}
                        type={'file'}
                        onChange={uploadFile}
                    />
                    <div className={'array_field'}>
                    {item[name] && item[name].length > 0 && item[name].map((val: string, index: number) =>
                        <div className={'array_field_item'} key={`file_array_item_${index}`}>
                            <a href={val} target={'_blank'}>
                                {fieldProps.type === 'video_array' ?
                                    <img src={val.substring(0, val.lastIndexOf('.')).replace('/files/', '/thumbnails/') + '.png'} alt={'thumbnail'} className={'icon'}/>
                                    :
                                    <FaFile
                                        size={100}
                                        title={val}
                                    />
                                }
                            </a>
                            <button
                                key={`file_remove_${name}_${index}`}
                                title={'حذف'}
                                onClick={(e) => removeItem(e, index)}
                                className={'remove-item'}
                            >×</button>
                        </div>
                    )}
                    </div>
                </>;
                break;
        }
        setResultField(result);
    };

    useEffect(() => {
        if (item) {
            generateResult();
        }
    }, [item, autoCompleteValue]);

    return <Form.Group className={'mb-3'} key={`field_${name}`}>
        <Form.Label>{Helper.string.snakeToSeparate(name)}</Form.Label>
        {resultField}
    </Form.Group>;
}