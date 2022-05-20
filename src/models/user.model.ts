import {IUser} from '../interfaces/project';
import {IModel} from '../interfaces/system';

const roleList = {
    student: 'Student',
    tutor: 'Tutor',
    admin: 'Admin'
};

export const UserModel: IModel<IUser> = {
    title: 'User',
    route: 'users',
    fields: {
        _id: {type: 'id'},
        avatar: {type: 'image'},
        name: {type: 'text'},
        email: {type: 'text'},
        password: {
            type: 'password',
            hide_in_list: true
        },
        mobile: {type: 'text'},
        role: {
            type: 'list',
            list: roleList
        },
    }
};