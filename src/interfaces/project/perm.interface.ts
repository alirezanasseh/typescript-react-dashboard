export interface IPerm {
    _id: string;
    role: Array<string>;
    entity: string;
    allowed: Array<'create' | 'read' | 'update' | 'delete'>;
    create: any;
    read: object;
    update_filter: object;
    update_update: any;
    delete: object;
}