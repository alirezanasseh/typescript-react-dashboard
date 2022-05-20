export interface ITag {
    id: string;
    text: string;
}

export interface ITagInputProps {
    suggestions: Array<ITag>;
    changeTagInput: (value: string, suggestions: Array<ITag>) => Array<ITag>;
    tags: Array<ITag>;
    setTags: (tags: Array<ITag>) => void;
}