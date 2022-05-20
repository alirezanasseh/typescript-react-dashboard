type IFieldType = 'id'
    | 'text'
    | 'textarea'
    | 'text_array'
    | 'number'
    | 'date'
    | 'datetime'
    | 'time'
    | 'currency'
    | 'foreign'
    | 'foreign_array'
    | 'function'
    | 'list'
    | 'image'
    | 'images'
    | 'nested'
    | 'nested_array'
    | 'json'
    | 'boolean'
    | 'password'
    | 'video'
    | 'video_array'
    | 'file'
    | 'file_array';

type IFileTypes = 'image' | 'other';

export interface IFieldProps {
    type: IFieldType;
    foreign?: {
        route: string;
        field: string;
    };
    fields?: {
        [field: string]: IFieldProps;
    }
    function?: (value: any) => any;
    list?: {
        [x: string]: string;
    };
    rows?: number;
    hide_in_list?: boolean;
    hide_in_item?: boolean;
    file_type?: IFileTypes;
    image_width?: number;
    image_height?: number;
}

export interface IModel<T> {
    title: string;
    route: string;
    fields: {
        [field in keyof Partial<T>]: IFieldProps;
    }
}

export type IPopulate = Array<{path: string; select: string}>;