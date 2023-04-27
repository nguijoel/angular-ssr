// ====================================================
// Creative Medium 29/12/2018
// ====================================================

import { environment } from "../../environments";

export class ConfigurationService {
    static readonly apiVersionNumber =  environment.apiVersion || 1;
    static readonly apiVersion = '/rest/v' + environment.apiVersion || 1;
    static readonly apiPath = environment.apiVersion === 2 ?  '/api' : '/umbraco/api';
    static readonly appVersion: string = '2.7.1';
    static apiUrl = environment.baseUrl + ConfigurationService.apiPath;
    static webUrl = environment.baseUrl;
    static memberApiUrl = environment.memberBaseUrl;
    static reCaptchaKey = environment.reCaptchaKey;
    static readonly memberApiVersion: string = '';
    static readonly clientId = environment.clientId;
}
