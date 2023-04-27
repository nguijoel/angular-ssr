// ====================================================
// Creative Medium 29/12/2018
// ====================================================

import { environment } from "../../environments";


export class ConfigurationService {
    public static readonly apiVersionNumber =  environment.apiVersion || 1;
    public static readonly apiVersion = '/rest/v' + environment.apiVersion || 1;
    public static readonly apiPath = environment.apiVersion === 2 ?  '/api' : '/umbraco/api';
    public static readonly appVersion: string = '2.7.1';
    public static apiUrl = environment.baseUrl + ConfigurationService.apiPath;
    public static webUrl = environment.baseUrl;
    public static memberApiUrl = environment.memberBaseUrl;
    public static reCaptchaKey = environment.reCaptchaKey;
    public static readonly memberApiVersion: string = '';
    public static readonly credentials =
    {
        username:'',//environment.siteUsername,
        password:''//environment.sitePassword
    };
    public static readonly clientId = environment.clientId;
}
