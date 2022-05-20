import React, {useState, forwardRef, ForwardedRef, useEffect} from 'react';
import AutoSuggest, { SuggestionSelectedEventData } from 'react-autosuggest';
import './styles.scss';

interface IAutoCompleteItem {
    name: string;
    [x: string]: any;
}

interface IAutoCompleteData<T> {
    id?: string;
    data?: Array<T> | undefined;
    placeholder?: string;
    getData?: (value: string, cb: (result: Array<T>) => void) => void;
    result: (item: T | undefined) => void;
    default?: string;
    value: string;
    setValue: (value: string) => void;
}

function AutoComplete<T>(
    props: React.PropsWithChildren<IAutoCompleteData<T & IAutoCompleteItem>>,
    ref: ForwardedRef<HTMLInputElement>
){
    const {value, setValue} = props;
    const [suggestions, setSuggestions] = useState<Array<T & IAutoCompleteItem>>([]);

    const getSuggestions = (value: string) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        if(props.data){
            return inputLength === 0 ? [] : props.data.filter(item =>
                item.name.toLowerCase().slice(0, inputLength) === inputValue
            );
        }
        return [];
    };

    const getSuggestionValue = (suggestion: T & IAutoCompleteItem) => suggestion.name;

    const onChange = (event: React.FormEvent, { newValue }: { newValue: string }) => {
        if (newValue === '') {
            props.result(undefined);
        }
        setValue(newValue);
    };

    const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
        if(props.data){
            setSuggestions(getSuggestions(value));
        }
        if(props.getData){
            props.getData(value, result => setSuggestions(result));
        }
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const renderSuggestion = (suggestion: T & IAutoCompleteItem) => (
        <div>
            {suggestion?.name}
        </div>
    );

    const inputProps = {
        placeholder: props.placeholder,
        id: props.id,
        value,
        onChange: onChange,
        ref
    };

    const selected = (e: React.FormEvent, res: SuggestionSelectedEventData<T & IAutoCompleteItem>) => {
        props.result(res.suggestion);
    };

    useEffect(() => {
        if(props.default){
            setValue(props.default);
        }
    }, []);

    return (
        <AutoSuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            onSuggestionSelected={selected}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
        />
    );
}

export default forwardRef(AutoComplete) as <T>(
    props: React.PropsWithChildren<IAutoCompleteData<T & IAutoCompleteItem>> & {ref?: ForwardedRef<HTMLInputElement>}
) => ReturnType<typeof AutoComplete>;
