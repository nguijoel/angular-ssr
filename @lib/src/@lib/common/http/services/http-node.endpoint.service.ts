import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments';
import { Util } from '../../../utilities';


@Injectable({ providedIn: 'root' })
export class CoreNodeEnpointService {
  private config = (environment as any)['comment'];
  private isACL = Util.isACL(environment);

  constructor(private http: HttpClient) { }

  get apiKey() { return this.config.apiKey; }
  get host() { return this.config.host; }

  get = (url: string) => this.http.get(url, this.options);
  getUser = () => this.http.get(this.url('user'), this.options);
  signOut = () => this.http.get(this.url('signout'), this.options);


  vote = (uid: string, scope: string, like: boolean, request: any) =>
    this.http.post(this.url(`${scope}/${uid}/${like ? 'like' : 'dislike'}`), request, this.options);


  saveFav = (uid: string, add: boolean, request: any) =>
    this.http.post(this.url(`favourite/${uid}/${add ? 'add' : 'remove'}`), request, this.options);

  getFavs = (page?: number, size?: number) => this.http.get(this.url('favourite'), this.options);

  contentVote = (slug: string, like: boolean, request: any) =>
    this.http.post(this.url(`content/${slug}/${like ? 'like' : 'dislike'}`), request, this.options);

  commentVote = (commentId: number, like: boolean, request: any) =>
    this.http.post(this.url(`comment/${commentId}/${like ? 'like' : 'dislike'}`), request, this.options);

  commentReplies = (uid: string, parent?: boolean) =>
  this.http.get(this.url(`comment/${uid}/replies${this.qp('parent', parent)}`), this.options);

  getComments = (slug: string, action: boolean, parent?: boolean) =>
  this.http.get(this.url(`comments/${slug}${this.qp('action', action)}${this.qp('parent', parent, true)}`), this.options);

  getComment = (uid: string) => this.http.get(this.url(`comment/${uid}`), this.options);

  getNotify = () => this.http.get(this.url('notify'));

  getUserSettings = (property: string) => this.http.get(this.url(`user/setting/${property}`), this.options);
  saveUserSettings = (property: string, request: any) => this.http.post(this.url(`user/setting/${property}`), request, this.options);

  saveMediaComment = (slug: string, comment: any) => this.http.post<any>(this.url(`comments/${slug}`), comment, this.options);


  saveContent = (content: any) => this.http.put<any>(this.url(`content`), content, this.options);

  getContents = (type: string, size?: number) => this.http.get<any>(this.url(`content?type=${type || ''}&size=${size || ''}`), this.options);

  getContent = (uid: string) => this.http.get<any>(this.url(`content/${uid}`), this.options);

  subscribe = (publicKey: string, auth: string, endpoint: string) =>
    this.http.post(this.url('subscribe'), { publicKey, auth, endpoint }, this.options);

  private url = (path: string): string => `${this.config.host}/${path}`;

  private get options() {
    return {
      withCredentials: true,
      headers: this.headers
    };
  }

  private get headers(): HttpHeaders {
    const headers: any =
    {
      'x-client-id': environment.clientId
    };
    if (this.isACL) headers['x-acl'] = environment.clientId;

    return new HttpHeaders(headers);
  }

  private qp(name: string, value?: boolean, append?: boolean): string {
    return append
      ? `&${name}=${value === true}`
      : `?${name}=${value === true}`;
  }

}

