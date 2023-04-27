export enum Gender {
    None,
    Female,
    Male
}

export enum MediaType {
    BackgroundImage = "backgroundimage",
    Background = "background",
    Trailer = "trailer",
    Flyer = "flyer",
    Avatar = "avatar",
    Image = "image",
    Video = "video",
    Media = "media"
}

export enum ImageSize {
    square = 'square',
    rec = 'rec',
    wide = 'wide',
    semiWide = 'semi-wide'
}

export enum PostType {
    feature = "feature",
    editorial = "editorial",
    cluster = "cluster"
}

export enum StreamProviderType {
    facebook = "facebook",
    twitch = "twitch"
}

export enum PanelType {
    userMenu = "user-menu-panel",
    pageMenu = "page-menu-panel"
}

export enum AvatarChoice {
    none = 0,
    provider = 1,
    local = 2
}

export enum EntityStateType {
    created,
    updated,
    deleted
}