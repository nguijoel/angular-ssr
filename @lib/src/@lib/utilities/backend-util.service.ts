import { IEntity, IEntityDetail, IPerson, ISocialLink, IBranding, IMedia, ISortable, IStream, IProfile, IImageUrl, IDocumentLinks, ILink, IDocument, IPublishable, IBanner, ISubject, IVideo, IComment } from '@lib/common/interfaces';
import { Util } from './util.service';
import { StreamProviderType, MediaType } from '@lib/common/enums';

export class BEUtil {

    static createEntityLink(e: any, routes: any, action?: boolean): ILink {
        const route = routes && routes[e.contentType],
        href  =  route 
        ? route.path.replace('{uid}',e.uid || e.id )
                    .replace('{segment}',e.segment || e.urlSegment) 
        : '',
        text  = action
        ?  route?.action || e.name 
        : e.name,
        type= route?.type || e.contentType;

        //if(!href) console.log('NO ROUTE', e.contentType);

        return {href, text, type};
    }

    static setEntity(model: IEntity, data: any): void {
        if (!(data && data.system)) return;
        const system = data.system;

        if(!system) return console.log('NO SYSTEM:', data);
        model.uid = system.id;
        model.name = system.name;
        model.segment = system.urlSegment;
        model.contentType = system.contentType;
        model.createDate = Util.parseExactDate(system.createdAt);
        model.updateDate = Util.parseExactDate(system.editedAt);
    }

    static setIDocument(model: IDocument, data: any, action: string = 'form'): void {
        model.description = data.description;
        model.instructions = data.instructions;
        model.disclaimer = data.disclaimer;
        model.embedUrl = data.embedUrl;
        model.file = Util.resolveUrl(data.file);
        model.icon = Util.getFileExtension(data.file) || action || 'pdf';
        model.action = Util.createAction(action);
        model.isPdf = data.embedUrl && model.embedUrl.toLocaleLowerCase().endsWith('.pdf');
        model.download = model.isPdf;
        model.external = data.type === 'External';

        model.linkUrl = data.linkUrl;
        model.publishDate = Util.parseExactDate(data.publishDate);
        model.author = data.author;
        model.website = data.website;

        if (data.source)
            model.source = {
                href: data.source.url,
                text: data.source.name
            } as ILink;
    }

    static copyEntity(model: IEntity, source: IEntity): void {

        if (!source)
            return;
        model.uid = source.uid;
        model.name = source.name;
        model.createDate = source.createDate;
        model.updateDate = source.updateDate;
    }

    static setEntityDetail(data: any,  model?: IEntityDetail): IEntityDetail {

        if (!data) return;

        model = model || {} as IEntityDetail;

        const fields = BEUtil.getFields(data);
        BEUtil.setEntity(model, data);
        model.strapline = fields.strapline;
        model.description = fields.description;
        model.shortDescription = fields.shortDescription;
        model.hint = fields.hint;
        model.disclaimer = fields.disclaimer;
        model.altTitle = fields.altTitle;
        return model;
    }

    static copyEntityDetail(model: IEntityDetail, source: IEntityDetail): void {
        if (!source)
            return;
        BEUtil.copyEntity(model, source);
        model.strapline = source.strapline;
        model.description = source.description;
        model.shortDescription = source.shortDescription;
    }

    static setMedia(data: any, model?: IMedia, crop?: string, ignoreEntity?: boolean): IMedia {
        if (!data)
            return;
            
        model = model || {} as IMedia;
        
        const fields = BEUtil.getFields(data) || {};

        if(!ignoreEntity){
            BEUtil.setEntity(model, data);
            model.description = fields.description;
        }
       
        model.type = BEUtil.getContentType(data);
        model.credits = BEUtil.setIPerson(fields.credits);

        if (model.type === 'video'){
           const video =  BEUtil.setIVideo(fields);
           model.id = video.id;
           model.provider = video.provider;
           model.src = video.hdSrc;
           model.image = {
            original: video.posterUrl,
            thumbnail: video.thumbUrl,
            url: video.posterUrl,
            crop: 'wide'
        };}
        else if (model.type === 'audio')
            model.src =   Util.resolveUrl(fields.umbracoFile);
        else
            model.image = BEUtil.createImgeUrl(fields.umbracoFile, crop || 'wide');

        return model;
    }

    static setIProfile(model: IProfile, data: any, prop: any): void { //TODO: Inherit from IEnity
        model.iso3 = Util.getProperty<string>(data, 'country');
        model.country = model.iso3;
    }

    static setISortable(model: ISortable, prop: any): void {
        model.ordinal = prop.ordinal;
    }

    static setIBranding(model: IBranding, fields: any, crop?: string): void {
        model.primaryTheme = fields.primaryTheme;
        model.secondaryTheme = fields.secondaryTheme;
        model.darkMode = fields.darkMode;
        model.textAlignment = fields.textAlignment;
        model.icon = fields.icon;
        if(fields.image) model.image = BEUtil.createImgeUrl(BEUtil.getFields(fields.image)?.umbracoFile, crop || 'wide');
    }

    static setIPublishable(model: IPublishable, fields: any): void {
        model.publishedAt = Util.getPublishDate(fields);
        model.firstPublishedAt = Util.getFirstPublishDate(fields);
        model.featured = fields.featured;
    }

    static setIVideo(fields: any, model?: IVideo): IVideo {
        if (!fields) return;
        if (!model) model = {} as IVideo;
        model.id = fields.videoId;
        model.videoTitle = fields.videoTitle;
        model.thumbUrl = fields.imageUrl;
        model.provider = fields.provider;
        model.posterUrl = BEUtil.changeVideoImageSizeUrl(fields.imageUrl);
        return model;
    }

    static setISubject(model: ISubject, fields: any): void {
        model.subject = fields.subject;
        model.subjectInTitle = fields.subjectInTitle;
        model.fullTitle = (model.subject && model.subjectInTitle ? model.subject + ': ' : '') + model.name;
    }

    static setIComment(model: IComment, fields: any): void {
        model.commentCount = Number(fields.commentCount);
        model.commentEnabled = fields.commentEnabled;
        model.commentPaused = fields.commentPaused;
    }

    static setIBanner(model: IBanner, fields: any, media?: IMedia): void {
        if (fields.bannerDisabled || (fields.mediaAsBanner && !media)) return;
        model.banner = fields.mediaAsBanner ? media : BEUtil.setMedia(fields.banner, null, 'wide');
        model.bannerTopOffset = fields.topPosition ? `${fields.topPosition}%` : null;
        model.bannerLeftOffset = fields.leftPosition ? `${fields.leftPosition}%` : null;
    }

    static setIStream(model: IStream, prop: any): void {
        model.streamLink = prop.streamLink;

        if (!model.streamLink)
            return;

        const now = new Date();
        model.streamStart = Util.parseDate(prop.streamStart);
        model.streamEnd = Util.parseDate(prop.streamEnd);
        model.streamOnly = prop.streamOnly;
        model.streamDisabled = prop.streamDisabled;
        model.chatLink = prop.chatLink;

        if (model.streamLink.indexOf('facebook') > -1)
            model.streamProvider = StreamProviderType.facebook;
        else if (model.streamLink.indexOf('twitch') > -1)
            model.streamProvider = StreamProviderType.twitch;

        model.isStream = model.streamEnd > now;
        model.isStreaming = model.isStream && model.streamStart <= now;
    }

    static setIPerson(fields: any, model?: IPerson): IPerson {
        if (!fields)
            return;

        if (!model) model = {} as IPerson;
        model.avatar = BEUtil.createAvatar(fields.avatar);
        model.socialLinks = BEUtil.createSocialLinks(fields);
        model.website = fields.website;
        model.role = fields.role;
        return model;
    }

    static setIMediaVideo(model: IMedia, prop: any, videoType?: MediaType) {

        const node = BEUtil.getVideoNode(videoType) + '.items',
            items = Util.map(prop, node),
            item = items ? items[0] : {},
            details = item.details || {};

        model.name = item.title;
        model.credits = prop['director'];
        model.description = item.description;
        model.image = item.thumbnail
            ? Util.resolveUrl(item.thumbnail.cropUrl || item.thumbnail.url)
            : Util.map(details, 'thumbnails.0.url');

        model.src = Util.map(details, 'files.0.secure');
    }

    static getVideoNode(videoType?: MediaType) {
        return videoType === MediaType.Trailer
            ? 'trailer'
            : 'link';
    }

    static sort<T>(data: (T & ISortable)[]): T[] {
        return data.sort((n1, n2) => n1.ordinal - n2.ordinal);
    }

    static sortDesc<T>(data: (T & ISortable)[], decending?: boolean): T[] {
        return data.sort((n1, n2) => n2.ordinal - n1.ordinal);
    }

    static createAvatar(data: any): IImageUrl {
        if (!data) return;
        return BEUtil.createImgeUrl(BEUtil.getFields(data)?.umbracoFile);
    }

    static createSocialLinks(fields: any): ISocialLink[] {

        if (!Util.isAny(fields.socialLinks))
            return;

        const model: ISocialLink[] = [];

        fields.socialLinks?.forEach((field: string) => {
            const link = Util.parseScocialMediaLink(field) as ISocialLink;
            if (link) model.push(link);
        });

        return Util.sortBy(model, 'provider');
    }

   static createContentLinks(links: any[]): ILink[] {
     if (!Util.isAny(links))
            return;
        const result = links.map(link => BEUtil. createContentLink(link));
        return Util.sortBy(result, 'text');
    }

    static createContentLink(link: any): ILink {
        if(link) return {href: link.url, text: link.name};
    }

    static createImgeUrl(field: any, crop?: string): IImageUrl {

        if (!field)
            return;

        const crops = field.crops || {},
            cropUrl = crop ? crops[crop] : null,
            image =  {
            original: Util.resolveUrl(field.src),
            thumbnail: Util.resolveUrl(crops.thumbnail),
            url: Util.resolveUrl(cropUrl || field.src),
            crop: cropUrl ? crop : null
        } as IImageUrl;

       if(image.thumbnail === image.url)
           image.thumbnail = BEUtil.createImgeCropUrl(image.url, 600); 

        image.avatar = BEUtil.createImgeCropUrl(image.url, 64); 
        
        return image;
    }

    static createImgeCropUrl(baseUrl: string, crop: number): string {
        return  baseUrl ? `${baseUrl}?mode=crop&width=${crop}`: null; 
    }

    static createDocumentLinks(field: any): any {
        if (Util.isAny(field.links))
            return {
                header: field.linkGroup,
                links: field.links.map((e: any) => BEUtil.createIDocumentFromLink(e))
            } as IDocumentLinks;
    }

    static createIDocumentFromInfoLink(data: any): IDocument {

        const model = {
            uid: '',
            name: data.link.name,
            createDate: null,
            updateDate: null,
            clickable: true
        } as IDocument;

        BEUtil.setIDocument(
            model,
            {
                description: data.description,
                embedUrl: data.link.url,
                file: data.link.url,
                type: data.link.type,
                source: data.source
            },
            'link');
        return model;
    }

    static getLinkContentId(fields: any, name: string): string {
        if (fields && fields[name])
            return fields[name]['id'];
    }

    static isMedia(type: string): boolean {
       return type === 'video' || type === 'audio';
    }

    //#region Members

    static mapVideoFiles(prop: any): any {
        const map = {} as any;
        if (Util.isAny(prop.files)) {
            const files = Util.sortBy<any>(prop.files, 'size', true);
            map.sd = files?.find(e => e.quality === 'sd');
            map.hd = files?.find(e => e.quality === 'hd');
            map.hls = files?.find(e => e.quality === 'hls');
        }
        return map;
    }

    static mapVideoPictures(prop: any): any {
        const map = {} as any;
        if (Util.isAny(prop?.pictures?.sizes)) {
            for (const e of prop.pictures.sizes)
                map['P' + e.width] = e.link;
            map.base = BEUtil.changeVideoImageSizeUrl(prop.pictures.sizes[0].link, 0);
        }
        return map;
    }

    static getVideoSD(files: any): any {
        return files.sd || files.hd || files.hls;
    }

    static getVideoHD(files: any): any {
        return files.hls || files.hd || files.sd;
    }

    static getVideoImageUrl(sizes: any, width = 1920): string {
        return sizes['P' + width] || sizes.base + '-d_' + width;
    }

    static changeVideoImageSizeUrl(url: string, width = 1920): string {

        if (url) {
            url = url?.split('-d_')[0];
            if (width) url += '-d_' + width;
        }
        return url;
    }
    //#endregion

    //#region Helpers
    static getFields(data: any): any { return data['fields']; }

    private static getContentType(data: any): any { return data.system ?  data.system.contentType.toLowerCase(): null; }

    private static createIDocumentFromLink(data: any): IDocument {
        const model = {
            uid: '',
            name: data.name,
            createDate: null,
            updateDate: null
        } as IDocument;

        BEUtil.setIDocument(
            model,
            {
                embedUrl: data.url,
                file: data.url
            },
            'link');
        return model;
    }
    //#endregion
}
