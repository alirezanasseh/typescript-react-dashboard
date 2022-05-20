import {IFieldProps, IPopulate} from '../interfaces/system';

export function populate<T>(fields: any, pre: string = ''): IPopulate {
    if (!fields) return [];
    let val: IFieldProps;
    let populateFields: IPopulate = [];
    for (const [key, value] of Object.entries(fields)) {
        val = value as IFieldProps;
        if (val.foreign?.field) {
            populateFields.push({
                path: pre + key,
                select: val.foreign.field
            });
        }
        if (val.type === 'json') {
            populateFields = populateFields.concat(populate(val.fields, key + '.'));
        }
    }
    return populateFields;
}
