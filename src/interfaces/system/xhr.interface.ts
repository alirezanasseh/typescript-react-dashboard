export interface IResponse<T> {
    list?: Array<Partial<T>>;
    count?: number;
    item?: Partial<T>;
    token?: string;
    id?: string;
}

export interface IParams {
    page?: number;
    pageSize?: number;
    populate?: string;
    sort?: string;
    conditions?: string;
}