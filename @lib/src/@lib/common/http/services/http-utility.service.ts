// ====================================================
// Creative Medium
// ====================================================

import { Injectable } from '@angular/core';
import { HttpResponseBase, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { HttpResponseMessage } from '../models/http-response-message.model';

@Injectable()
export class HttpUtil {
    public static readonly captionAndMessageSeparator = ':';
    public static readonly labelNoNetworkCaption = 'No Network';
    public static readonly labelNoNetworkDetail = 'The server cannot be reached';
    public static readonly labelAccessDeniedCaption = 'Access Denied!';
    public static readonly labelAccessDeniedDetail = '';

    private static readonly labelGenericErrorCaption = 'Error';
    private static readonly labelGenericErrorDetail = 'Please try again later';

    private static readonly errorDescriptionKey = 'error_description';
    private static readonly errorTitleKey = 'error_title';
    private static readonly errorCodeKey = 'error';

    //#region Public Methods
    public static getHttpResponseMessage(data: HttpResponseBase | any): string[] {
        const responses: string[] = [];

        if (data instanceof HttpResponseBase) {
            if (this.checkNoNetwork(data)) 
                responses.push(`${this.labelNoNetworkCaption}${this.captionAndMessageSeparator} ${this.labelNoNetworkDetail}`);
            
            else {
                const responseObject = this.getResponseBody(data);

                if (responseObject && (typeof responseObject === 'object' || responseObject instanceof Object)) 
                    for (const key in responseObject) 
                        if (key)
                            responses.push(`${key}${this.captionAndMessageSeparator} ${responseObject[key]}`);
                        else if (responseObject[key])
                            responses.push(responseObject[key].toString());
                    
                
            }

            if (!responses.length && this.getResponseBody(data))
                responses.push(`${data.statusText}: ${this.getResponseBody(data).toString()}`);
        }

        if (!responses.length)
            responses.push(data.toString());

        if (this.checkAccessDenied(data))
            responses.splice(0, 0, `${this.labelAccessDeniedCaption}${this.captionAndMessageSeparator} ${this.labelAccessDeniedDetail}`);

        return responses;
    }

    public static getHttpErrorMessage(data: HttpResponse<any> | any): HttpResponseMessage {
        
        const  resposnse = new HttpResponseMessage();

        if(data.error && data.error.errorDescription)
        {
            resposnse.message = data.error.errorDescription;
            resposnse.code = data.error.error; 
            return resposnse;
        }
          
        const httpMessages = this.getHttpResponseMessage(data);
        resposnse.code = this.findHttpResponseMessagePart(this.errorCodeKey, httpMessages, true, false);
        resposnse.title = this.findHttpResponseMessagePart(this.errorTitleKey, httpMessages, true, false) || this.labelGenericErrorCaption;
        resposnse.message = this.findHttpResponseMessagePart(this.errorDescriptionKey, httpMessages, false, false) || this.labelGenericErrorDetail;

        return resposnse;
    }


    public static checkConsentRequired(response: HttpResponseMessage): boolean{
        return  response && response.code === 'consent_required';
    }

    public static findHttpResponseMessage(messageToFind: string, data: HttpResponse<any> | any, seachInCaptionOnly = true, includeCaptionInResult = false): string | undefined {
        return this.findHttpResponseMessagePart(
            messageToFind.toLowerCase(),
            this.getHttpResponseMessage(data),
            seachInCaptionOnly,
            includeCaptionInResult);
    }

    public static getResponseBody(response: HttpResponseBase) {
        if (response instanceof HttpResponse)
            return response.body;

        if (response instanceof HttpErrorResponse)
            return response.error || response.message || response.statusText;
    }

    public static checkNoNetwork(response: HttpResponseBase) {
        if (response instanceof HttpResponseBase) 
            return response.status == 0;
        

        return false;
    }

    public static checkAccessDenied(response: HttpResponseBase) {
        if (response instanceof HttpResponseBase) 
            return response.status == 403;
        

        return false;
    }

    public static checkNotFound(response: HttpResponseBase) {
        if (response instanceof HttpResponseBase) 
            return response.status == 404;
        

        return false;
    }

    public static checkIsLocalHost(url: string, base?: string) {
        if (url) {
            const location = new URL(url, base);
            return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
        }

        return false;
    }

    public static splitInTwo(text: string, separator: string): { firstPart: string; secondPart: string | undefined  } {
        const separatorIndex = text.indexOf(separator);

        if (separatorIndex == -1)
            return { firstPart: text, secondPart: undefined };

        const part1 = text.substr(0, separatorIndex).trim(),
         part2 = text.substr(separatorIndex + 1).trim();

        return { firstPart: part1, secondPart: part2 };
    }

    public static safeStringify(object: any) {
        let result: string;

        try {
            result = JSON.stringify(object);
            return result;
        }
        catch (error) {
            console.log(error);
        }

        const simpleObject: any = {};

        for (const prop in object) {
            if (!object.hasOwn(prop)) 
                continue;
            
            if (typeof (object[prop]) == 'object') 
                continue;
            
            if (typeof (object[prop]) == 'function') 
                continue;
            
            simpleObject[prop] = object[prop];
        }

        result = '[***Sanitized Object***]: ' + JSON.stringify(simpleObject);

        return result;
    }

    public static JSonTryParse(value: string) {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            if (value === 'undefined')
                return void 0;

            return value;
        }
    }

    public static baseUrl() {
        let base = '';

        if (window.location.origin)
            base = window.location.origin;
        else
            base = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

        return base.replace(/\/$/, '');
    }

    //#endregion

    //#region Private

    private static findHttpResponseMessagePart(searchString: string, httpMessages: string[], seachInCaptionOnly = true, includeCaptionInResult = false): string {
        for (const message of httpMessages) {
            const fullMessage = HttpUtil.splitInTwo(message, this.captionAndMessageSeparator);

            if (fullMessage.firstPart && fullMessage.firstPart.toLowerCase().indexOf(searchString) != -1)
                return includeCaptionInResult ? message : fullMessage.secondPart || fullMessage.firstPart;
        }

        if (!seachInCaptionOnly) {
            const messages: string[] = [];

            let extract: string;

            for (const message of httpMessages) {
                extract = this.extractHttpResponseMessagePart(message, includeCaptionInResult);

                if (message.toLowerCase().indexOf(searchString) != -1)
                    return extract;

                messages.push(extract);
            }

            return messages.join('<br>');
        }

        return '';
    }

    private static extractHttpResponseMessagePart(message: string, includeCaptionInResult: boolean): string {
        if (includeCaptionInResult || !message)
            return message;

        const fullMessage = HttpUtil.splitInTwo(message, this.captionAndMessageSeparator);
        return fullMessage.secondPart || fullMessage.firstPart;
    }

    //#endregion
}
