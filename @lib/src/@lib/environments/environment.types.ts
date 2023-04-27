export interface  IEnvironment {
    baseUrl:  string;
    apiVersion: number;
    memberBaseUrl:  string;
    reCaptchaKey:  string;
    clientId:  string;
    appName:  string;
    production?: boolean;
    pilot?: boolean;
    hmr?: boolean;
    ts?: number;
    keys?: any;
    plugins?: any;
};