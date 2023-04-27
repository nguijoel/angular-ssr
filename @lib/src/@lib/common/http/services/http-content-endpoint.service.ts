
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthEndpointFactory } from '@lib/core/auth/services/auth-endpoint-factory.service';

@Injectable()
export class ContentEndpoint extends AuthEndpointFactory {

  protected get contentType() { return null; }
  private readonly contentUrlPath: string = '/content/';

  getContentNodeEndpoint<T>(node: string): Observable<T> {
    return this.http.get<T>(this.nodeUrl(node), this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error, () => this.getContentNodeEndpoint(node))));
  }

  getContentEndpoint<T>(uid?: string, node?: string): Observable<T> {
    return this.http.get<T>(this.resolveUrl('latest', uid, node), this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error, () => this.getContentEndpoint(uid, node))));
  }

  getSegmentEndpoint<T>(segment: string): Observable<T> {
    return this.http.get<T>(this.resolvePath('segment', segment), this.getRequestHeaders())
      .pipe<T>(catchError(error => this.handleError(error, () => this.getSegmentEndpoint(segment))));
  }

  getContentsEndpoint<T>(page?: number, size?: number, level?: number, sort?: string, node?: string): Observable<T> {
    const url = this.resolveUrl('list', null, node) + this.appendPagingQuery(page, size, level, sort);
    return this.http.get<T>(url, this.getRequestHeaders())
    .pipe<T>(catchError(error => this.handleError(error, () => this.getContentsEndpoint(page, size, level, sort, node))));
  }

  getFeaturedEndpoint<T>(page?: number, size?: number, level?: number, sort?: string, exclude?: boolean): Observable<T> {
    const url = this.resolveUrl('featured') + this.appendPagingQuery(page, size, level, sort,[`exclude=${exclude === true}`]);
    return this.http.get<T>(url, this.getRequestHeaders())
    .pipe<T>(catchError(error => this.handleError(error, () => this.getFeaturedEndpoint(page, size, level, sort, exclude))));
  }

  getSummaryEndpoint<T>(): Observable<T> {
    return this.http.get<T>(this.resolveUrl('summary'), this.getRequestHeaders())
    .pipe<T>(catchError(error => this.handleError(error, () => this.getSummaryEndpoint())));
  }

  //#region Helpers
  private contentUrl = (method: string, node?: string) => this.baseApiUrl + this.contentUrlPath + method + '/'+ (node || this.contentType);
  private getUrl = (uid: string) => this.baseApiUrl + this.contentUrlPath +  this.getPath + uid;
  private getPathUrl = (node: string, path: string) => this.baseApiUrl + this.contentUrlPath + this.getPath + node + '?path=' + path;
  private nodeUrl = (uid: string) => this.baseApiUrl + this.contentUrlPath + uid;
  private resolveUrl = (method: string, uid?: string, node?: string) => uid ? this.getUrl(uid) : this.contentUrl(method, node);
  private resolvePath = (method: string, path: string) => this.contentUrl(method) + '/' +  path;
  private get getPath() {return this.apiVersionNumber === 2 ? '' : 'get/'; }
  //#endregion

}
