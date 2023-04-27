import { Observable} from "rxjs";
import { IHttpResponse } from "../common/http";
import { User } from "./models/user.model";


export interface IIconGroup {
    iconSet?: boolean;
    namespace?: string;
    folder: string;
    icons: string[];
}

export interface IIconProvider {
    getIcons(): Observable<IIconGroup[]>;
}

export interface IResxProvider {
    resx: any;
}

export interface ILoginProvider {
 
    authenticated: boolean;
    state: Observable<boolean>;
    ready: Observable<boolean>;

    /**
     * Notifies an oauth request response
     */
    oauth: Observable<IHttpResponse>;

    /**
     * Get the current user's model
     */
    user: User;
    
    /**
     * Sets the access token for ACL access
     */
    accessToken: string;

    signIn: () => void;
    signOut: () => void;
 }
