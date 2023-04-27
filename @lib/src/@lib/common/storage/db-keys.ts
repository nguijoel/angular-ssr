/* eslint-disable @typescript-eslint/naming-convention */
// ====================================================
// Creative Medium 29/12/2018
// ====================================================
import { Injectable } from '@angular/core';

@Injectable()
export class DBkeys {

    public static readonly CURRENT_USER = 'current_user';
    public static readonly USER_PERMISSIONS = 'user_permissions';
    public static readonly ACCESS_TOKEN = 'access_token';
    public static readonly ID_TOKEN = 'id_token';
    public static readonly REFRESH_TOKEN = 'refresh_token';
    public static readonly TOKEN_EXPIRES_IN = 'expires_in';
    public static readonly REMEMBER_ME = 'remember_me';
    public static readonly APP_TS = 'app_ts';

    public static readonly CURRENT_MEMBER = 'current_member';
    public static readonly MEMBER_ACCESS_TOKEN = 'member_access_token';
    public static readonly MEMBER_ID_TOKEN = 'member_id_token';
    public static readonly MEMBER_REFRESH_TOKEN = 'member_refresh_token';
    public static readonly MEMBER_TOKEN_EXPIRES_IN = 'member_expires_in';
    public static readonly MEMBER_REMEMBER_ME = 'member_remember_me';
    public static readonly MEMBER_USE_LOCAL_AVATAR = 'member_user_local_avatar';

    public static readonly CURRENT_CONTEXT = 'current_context';

    public static readonly LANG_MULTI = 'language_multi';
    public static readonly LANG_ACCEPT = 'language_accept';


    
}
