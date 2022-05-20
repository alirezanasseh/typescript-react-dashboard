import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import config from '../config';
import {useState} from 'react';
import {IResponse} from '../interfaces/system';

const xhr = axios.create();
xhr.defaults.baseURL = config.server;
xhr.defaults.withCredentials = true;

type IXHRResponse<T> = AxiosResponse<IResponse<T>>;
type IXHRCallBack<T> = (response: IXHRResponse<T>) => void;
type IXHRSend<T> = (props: AxiosRequestConfig, cb: IXHRCallBack<T>) => void;

export default function useXHR<T>(): [boolean, string, IXHRSend<T>] {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    function send(props: AxiosRequestConfig, cb: IXHRCallBack<T>) {
        setLoading(true);
        setError('');
        xhr.request<IResponse<T>>(props).then(res => {
            cb(res);
        }).catch(reason => {
            let message = '';
            if (reason?.response?.data?.errors?.message) {
                message = reason?.response?.data?.errors?.message;
            } else if (reason?.response?.data?.validation?.body?.message) {
                message = reason?.response?.data?.validation?.body?.message;
            } else {
                message = 'Operation failed.';
            }
            setError(message);
        }).finally(() => {
            setLoading(false);
        });
    }

    return [loading, error, send];
}