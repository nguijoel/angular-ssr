/* eslint-disable no-shadow */
export enum NodeScopeType {
    content = 'content',
    comment = 'comment'
}

export enum NodeLevelType {
    content = 0,
    comment = 1,
    reply = 2,
}

export enum NodeAudioStateType {
    playing = 'playing',
    paused = 'paused'
}

export enum NodeVoteType {
    like = 'like',
    dislike = 'dislike'
}

export interface INodeVote {
    likes: number;
    dislikes: number;
    vote: NodeVoteType;
    voteAt: Date;
    favorite: Date;
}

export interface INodeAuthor {
    id: number;
    name: string;
    avatar: string;
}

export interface INodeEntity {
    uid: string;
    title: string;
    descriptiveTitle: string;
    description: string;
    author: INodeAuthor;
}
export interface INodeIdentifier {
    slug: string;
    contentId: number;
    scope: NodeScopeType;
    type: string;
    level: number;
}

export interface INodeMedia {
    mediaUrl: string;
    mediaId: string;
    imageUrl: string;
    mediaType: string;
}

export interface INodeContent {
    post: INodeEntity;
    reply: INodeEntity;
    replies: number;
    comments: INodeContent[];
}

export interface INodeState {
    editable: boolean;
    stateLoaded: boolean;
    loading: boolean;
}

export interface INavigation {
    href: string;
    queryParams: any;
}

export interface INodeAudit {
    date: Date;
    userId: number;
}

export interface INodeAudioState {
    status: NodeAudioStateType;
}

export interface INodeNavigation {
    href: string;
    queryParams: any;
}


