import React from 'react';
import {IFieldProps} from '../../interfaces/system';

export interface IItemState {
    [x: string]: any;
}

export interface IProcessTypeItemProps {
    id: string;
    name: string;
    fieldProps: IFieldProps;
    item: IItemState;
    foreignFields: IItemState;
    setItem: (item: IItemState) => void;
}

export type FileEvent<T> = React.FormEvent<T> & {
    target:  { files?: FileList | null };
}
