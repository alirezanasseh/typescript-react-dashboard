import {
    IUserRole,
} from './index';

export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    mobile?: string;
    avatar?: string;
    role: IUserRole;
    isEmailVerified: boolean;
}

export type IUserDTO = Omit<IUser, '_id' | 'role' | 'isEmailVerified'>;