import {IModel} from '../../interfaces/system';

export interface IPagination {
    page: number;
    pageSize: number;
    count: number;
}

export interface IListHeaderProps {
    title: string;
    pagination: IPagination;
    setPagination: (x: IPagination) => void;
}

export interface ISort {
    [x: string]: number;
}

export interface ITableProps<T> {
    model: IModel<T>;
    data: Array<Partial<T>>;
    loading: boolean;
    sort: ISort;
    setSort: (x: ISort) => void;
    remove: (id: string, index: number) => void;
}

export interface IPaginationProps {
    pagination: IPagination;
    setPagination: (state: IPagination) => void;
}

export interface ISearchProps<T> {
    model: IModel<T>;
    setConditions: (x: string) => void;
}

export interface ICondition {
    field: string;
    value: string;
    type: 'exact' | 'start' | 'end' | 'contain';
}

export type ISearchConditions = Array<ICondition>;

export interface IResultCondition {
    [x: string]: string | RegExp | object;
}