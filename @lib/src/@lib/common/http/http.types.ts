/* eslint-disable @typescript-eslint/naming-convention */

export enum StatusCode
{
    Forbidden = 403
}

export interface ILoginResponse 
{
    access_token: string;
    id_token: string;
    refresh_token: string;
    expires_in: number;
    cookie: boolean;
}

export interface IHttpResponse 
{
    statusCode: StatusCode;
    message: string;
}
