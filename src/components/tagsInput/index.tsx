import React from 'react';
import {WithContext as ReactTags} from 'react-tag-input';
import {ITag, ITagInputProps} from './types';
import './styles.scss';

const keyCodes = {
    comma: 188,
    enter: [10, 13]
};

const delimiters = [...keyCodes.enter, keyCodes.comma];

export default function TagsInput(props: ITagInputProps) {
    const {
        suggestions,
        changeTagInput,
        tags,
        setTags
    } = props;

    const handleAddition = (tag: ITag) => {
        setTags([...tags, tag]);
    };

    const handleDelete = (i: number) => {
        setTags(tags.filter((tag, index) => index !== i));
    };

    return (
        <ReactTags
            tags={tags}
            suggestions={suggestions}
            delimiters={delimiters}
            handleAddition={handleAddition}
            handleDelete={handleDelete}
            handleFilterSuggestions={changeTagInput}
        />
    );
}