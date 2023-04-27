import { Observable } from 'rxjs';
import { ImageSize, PostType, StreamProviderType } from '../enums';
import { PermissionValues } from '../types';

export interface IBasicUser {
    id: string;
    firstName: string;
    fullName: string;
    avatar?: string;
    externalId?: string;
 }

export interface IUser extends IBasicUser {
    email: string;
    localAvatar?: string;
    providerAvatar?: string;
    jobTitle?: string;
    phoneNumber?: string;
    isEnabled?: boolean;
    isLockedOut?: boolean;
    isAdmin?: boolean;
    emailConfirmed?: boolean;
    identityProvider?: string;
    localAccount?: boolean;
    roles?: string[];
    permissions: PermissionValues[];
}

export interface IEntity {
    uid: string;
    name: string;
    createDate?: Date;
    updateDate?: Date;
    segment?: string;
    contentType?: string;
}

export interface IPublishable {
    publishedAt?: Date;
    firstPublishedAt?: Date;
    featured: boolean;
}
    
export interface IEntityDetail extends IEntity {
    description?: string;
    strapline?: string;
    shortDescription?: string;
    hint?: string;
    disclaimer?: string;
    altTitle?: string;
}

export interface ISubject {
    name: string;
    subject: string;
    subjectInTitle: boolean;
    fullTitle?: string;
}

export interface IComment {
    commentEnabled: boolean;
    commentPaused: boolean;
    commentCount: number;
}

export interface IVideo {
    id: number;
    thumbUrl: string;
    posterUrl: string;
    src: string;
    hdSrc: string;
    videoTitle: string;
    type: string;
    provider: string;
}

export interface IMedia extends IEntity  {
    id: number;
    image?: IImageUrl;
    type: string;
    src: string;
    width: number;
    height: number;
    credits?: IPerson;
    description: string;
    provider: string;
}

export interface IProfile {
    id: any;
    name: string;
    iso3: string;
    country: string;
}

export interface ISocialLink {
    url: string;
    provider: string;
    icon: string;
    handle: string;
    ordinal: number;
}

export interface IPerson {
    avatar?: IImageUrl;
    website: string;
    role: string;
    socialLinks?: ISocialLink[];
}

export interface INodeInfo {
    backgroundUrl: string;
    color: string;
    caption: string;
    description: string;
    location: string;
}

export interface IBranding {
    primaryTheme?: string;
    secondaryTheme?: string;
    textAlignment?: string;
    darkMode?: boolean;
    icon?: string;
    image?: IImageUrl;
}

export interface ISortable {
    ordinal: any;
}

export interface IPage extends IEntity, ISortable  {
    title: string;
    content: string;
    emphasised: boolean;
    banner: IMedia;
    links?: IDocumentLinks;
}
export interface IInformationLink extends IEntity, ISortable  {
    title: string;
    content: string;
    emphasised: boolean;
    banner: IMedia;
    links?: IDocumentLinks;
}

export interface IPaging<T> {
    total?: number;
    page: number;
    pages: number;
    size: number;
    list: T[];
    title: string;
}

export interface ILink {
    href: string;
    text: string;
    type?: string;
}

export interface IAction {
    text: string;
    icon?: string;
}

export interface IDocument extends IEntity {
    instructions: string;
    disclaimer: string;
    description: string;
    icon: string;
    embedUrl: string;
    action: IAction;
    download: boolean;
    isPdf: boolean;
    external?: boolean;
    clickable?: boolean;
    file?: string;
    source?: ILink;
    linkUrl?: string;
    publishDate?: Date;
    author?: string;
    website?: string;
   
}

export interface IDocumentLinks {
    header: string;
    links: IDocument[];
}

export interface IEntityResponse {
    id: string;
}


export interface ISelectable<T> {
    id: T;
    selected: boolean;
}

export interface ISelectableState {
    display: string;
    count: number;
    total: number;
    totalDisplay: string;
    all: boolean;
    none: boolean;
}

export interface ISelectableOption {
    label: string;
    plural: string;
    multiple?: boolean;
}

export interface IOption<T> extends ISelectable<T> {
    id: T;
    name: string;
    description: string;
    meta: string;
    imageUrl: string;
}

export interface IDateFormat {
    format(date: Date, format: string): string;
}

export interface IPost {
    title: string;
    description: string;
    url: string;
    date: Date;
    src: string;
    size: ImageSize;
    type: PostType;
    author: IPerson;
    profile: IEntityDetail;
}

export interface IStream {
    isStream: boolean;
    isStreaming: boolean;
    streamOnly: boolean;
    streamDisabled: boolean;
    streamStart: Date;
    streamEnd: Date;
    streamLink: string;
    chatLink: string;
    streamProvider: StreamProviderType;
}

export interface IImageUrl {
    original: string;
    thumbnail: string;
    avatar?: string;
    url: string;
    crop: string;
}

export interface ICard {
    uid: string;
    title: string;
    altTitle?: string;
    subject?: string;
    description?: string;
    hint?: string;
    content?: string;
    tags?: IAction[];
    timeAgo?: boolean;
    imageUrl: string;
    href?: string;
    date?: Date;
    active?: boolean;
    type?: 'video' | 'audio' | 'image';
    aspect?: 'video' | 'square' | 'auto' | 'none';
    noInfo?: boolean;
    isMedia?: boolean;
    source?: any;
}

export interface ICardOption {
    theme: string;
    feature: string;
    sidebar: string;
}

export interface IBanner {
    banner?: IMedia;
    bannerTopOffset?: string;
    bannerLeftOffset?: string;
}

export interface IListService {
    getCards: (page: number, size: number) => Observable<IPaging<ICard>>;
}
