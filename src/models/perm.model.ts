import {IPerm} from '../interfaces/project';
import {IModel} from '../interfaces/system';

export const PermModel: IModel<IPerm> = {
    title: 'Permission',
    route: 'permissions',
    fields: {
        role: {
            type: 'text_array',
            list: {
                guest: "Guest",
                student: "Student",
                tutor: "Tutor"
            }
        },
        entity: {type: 'text'},
        allowed: {
            type: 'text_array',
            list: {
                create: 'Create',
                read: 'Read',
                readOne: 'Read One',
                update: 'Update',
                delete: 'Delete',
            }
        },
        create: {type: 'json'},
        read: {type: 'json'},
        update_filter: {type: 'json'},
        update_update: {type: 'json'},
        delete: {type: 'json'}
    }
};