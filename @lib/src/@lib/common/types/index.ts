export type PermissionNames =
    'View Users' | 'Manage Users' |
    'View Roles' | 'Manage Roles' | 'Assign Roles';

export type PermissionValues =
    'users.view' | 'users.manage' |
    'roles.view' | 'roles.manage' | 'roles.assign' |
    'posts.view' | 'posts.manage';

export interface IRouteProvider {
    routes: any;
}


export interface  IEnvironment {
    baseUrl:  string;
    apiVersion: number;
    memberBaseUrl:  string;
    reCaptchaKey:  string;
    clientId:  string;
    
    production?: boolean;
    pilot?: boolean;
    hmr?: boolean;
    ts?: number;
    keys?: any;
    plugins?: any;
}


export interface IMessageOptions {
    message: string;
    title?: string;
    confirm?: string;
    cancel?: string | boolean;
    hint?: string;
 }