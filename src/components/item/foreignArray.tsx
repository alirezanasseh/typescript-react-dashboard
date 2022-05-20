import React, {useEffect, useState} from 'react';
import TagsInput from '../tagsInput';
import {ITag} from '../tagsInput/types';
import Helper from '../../helpers';
import {useXHR} from '../../hooks';

interface FAProps {
    field: string;
    route: string;
    values?: Array<ITag>;
    setValues: (values: Array<string>) => void;
}

export default function ForeignArray(props: FAProps) {
    const {field, route, values, setValues} = props;
    const [suggestions, setSuggestions] = useState<Array<ITag>>([]);
    const [tags, setTags] = useState<Array<ITag>>(values || []);
    const [tagInputValue, setTagInputValue] = useState('');
    const [, , tagSend] = useXHR();

    useEffect(() => {
        const newValues: Array<string> = tags.map(tag => tag.id);
        setValues(newValues);
    }, [tags]);

    const changeTagInput = (value: string, suggestions: Array<ITag>): Array<ITag> => {
        if (value === tagInputValue) return suggestions;
        setTagInputValue(value);
        const conditions = {
            [field]: {
                '$regex': value
            }
        };

        tagSend({
            url: route,
            method: 'GET',
            params: {
                page: 1,
                pageSize: 5,
                conditions
            }
        }, response => {
            if (response?.data?.list) {
                setSuggestions(response.data.list.map(item => {
                    const id = Helper.object.hasOwnProperty(item, '_id') ? item._id : '';
                    let text: any;
                    text = Helper.object.hasOwnProperty(item, field) ? item[field] : '';
                    if (!id || !text) return {id: '', text: ''};
                    return {id, text};
                }));
            }
        });

        return suggestions;
    };

    return (
        <TagsInput
            suggestions={suggestions}
            changeTagInput={changeTagInput}
            tags={tags}
            setTags={setTags}
        />
    );
}