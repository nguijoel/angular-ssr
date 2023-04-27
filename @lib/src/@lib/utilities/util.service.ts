// ====================================================
// Creative Medium Templates
// ====================================================
import { ConfigurationService } from '../common/configuration/configuration.service';
import { PagingModel } from '@lib/common/models/paging.model';

const providerIcons = {
    
    twitter: {
        handle: true,
        icon: 'feather:twitter',
        ordinal: 1
    },

    facebook: {
        handle: true,
        ordinal: 2
    },

    instagram: {
        icon: 'feather:instagram',
        ordinal: 3
    },
    linkedin: {
        icon: 'social:linkedin'
    }
    ,
    google: {
        icon: 'social:google'
    },
    local: {
        icon: 'mat_outline:email'
    }
    ,
    apple: {
        icon: 'social:apple'
    },
    microsoft: {
        icon: 'social:microsoft'
    }
};

export class Util {
    static isInIframe(): boolean { return window?.self !== window?.top ? true : false; }

    static isProduction(env: any): boolean { return env.production || env.pilot; }

    static isACL(env: any): boolean { return env.acl; }

    static getFullUrl(path: string): string {
        if (!path) return path;
        return Util.isFullUrl(path) ? path : `${location.protocol}//${location.host}${path}`;
    }

    static isFullUrl(url: string): boolean {
        return url && url.toLowerCase().startsWith('http');
    }

    static truncate(text: string, maxLength: number): string {
        return text && text.length > maxLength
            ? text.substring(0, maxLength - 1) + '…'
            : text;
    }

    static $ = (s: string, c?: HTMLElement): HTMLElement => (c || document).querySelector(s) as HTMLElement;

    static sortBy<T>(source: T[], field: string, desc?: boolean): T[] {

        const gt = desc ? -1 : 1,
            lt = desc ? 1 : -1;

        return source?.sort((a, b) => {
            if (a[field] > b[field])
                return gt;

            if (a[field] < b[field])
                return lt;

            return 0;
        });
    }

    static slugify(value: string): string {
        if (value)
            return value.toLowerCase()
                .replace(/^-+/g, '')         // remove one or more dash at the start of the string
                .replace(/[^\w-]+/g, '-')    // convert any on-alphanumeric character to a dash
                .replace(/-+/g, '-')         // convert consecutive dashes to singuar one
                .replace(/-+$/g, '');

        return value;
    }


    static pluralize(count: number, label: string, pluralLabel: string, prepend?: boolean): string {

        const text = (count > 1 ? pluralLabel : label);

        if (!prepend) return text;

        return (count ? count + ' ' : 'no ') + text;
    }
    static format(text: string, ...args: any[]): string {
        return text.replace(/{(\d+)}/g, (match, num) => typeof args[num] !== 'undefined' ? args[num] : match);
    }
    static addDays(date: Date, days: number): Date {
        const d = new Date();
        d.setDate(date.getDate() + days);
        return d;
    }

    static parseDate(value: any, checkNull?: boolean): Date {
        if (!value)
            return;

        let date: Date;

        if (value instanceof Date)
            date = value;

        else if (typeof value === 'string' || value instanceof String) {
            if (value.search(/[a-su-z+]/i) === -1)
                value = value + 'Z';

            date = new Date(value);
        }
        else if (typeof value === 'number' || value instanceof Number)
            date = new Date(value as any);

        return checkNull ? Util.checkNullDate(date) : date;
    }

    static checkNullDate(date: Date): Date {
        if (!date || date.getFullYear() === 0)
            return;

        return date;
    }

    static parseDateFromTs(timestamp: number): Date {
        if (timestamp)
            return new Date(timestamp * 1000);
    }

    static isArray(data: any): boolean {
        return data && data instanceof Array;
    }

    static removeArrayItem<T>(source: T[], item: T) {
        const index = source.indexOf(item, 0);
        if (index > -1)
            source.splice(index, 1);
    }

    static toArray<T>(source: any, setDefault = true): T[] {
        if (!source)
            return setDefault ? [] : source;

        return Util.isAny(source) ? source : [source];
    }

    static isAny(data: any): boolean {
        return Util.isArray(data) && data.length;
    }


    static getPublishDate(data: any): Date {
        return Util.parseExactDate(data.publishDate || data.publishedAt);
    }

    static getFirstPublishDate(data: any): Date {
        return Util.parseExactDate(data.firstPublishDate || data.firstPublishedAt);
    }

    static firstOrDefault<T>(data: T[]): T {
        if (data && data.length)
            return data[0];

    }

    static forEach<T>(data: T[], predicate: (datum: T) => void) {
        if (data && data.length)
            for (const datum of data)
                predicate(datum);
    }

    static parseExactDate(date: string, checkEpoc?: boolean): Date {

        if (!date) return;

        const d = new Date(date);

        if (checkEpoc && d.getFullYear() < 1000) return;

        return d;
    }

    static jsonTryParse(value: string) {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            if (value === 'undefined')
                return void 0;

            return value;
        }
    }

    static parseBool(value: string | number | boolean) {

        if (!value)
            return false;

        if (typeof value == 'string')
            value = value.toLowerCase();

        switch (value) {
            case true:
            case 'true':
            case 1:
            case '1':
            case 'on':
            case 'yes':
                return true;
            default:
                return false;
        }
    }

    /**
     * Resolves a social media provider icon.
     * @param provider The provider name
     * @returns A custom icon or falls back to the provider name
     */
    static resolveProviderIcon(provider: string): string {

        return providerIcons[provider]?.icon || provider
    }

    static parseScocialMediaLink(link: string): any {
        if (!link) return;
        const parts = link.split('|'),
            url = parts[0].toLowerCase(),
            $url = new URL(url),
            provider = $url.host.replace('www.', '').split('.')[0],
            $provider = providerIcons[provider],
            model = { url, provider } as any;

        if (parts.length > 1) model.handle = parts[1];

        if ($provider) {
            model.icon = $provider.icon;
            model.ordinal = $provider.ordinal;
            if (!model.handle && $provider.handle)
                model.handle = '@' + Util.last(parts[0].split('/'));
        }
        model.icon = model.icon || provider;
        return model;
    }

    static map(data: any, path: string): any {
        if (data && path) {
            const locations = path.split('.');

            for (const location of locations) {
                data = data[location];

                if (!data)
                    break;
            }
        }
        return data;
    }

    static resolveUrl(url: string): string {
        return url
            ? ConfigurationService.webUrl + url
            : null;
    }

    static resolveImageSrc(data: any): string {
        return data && data.src
            ? Util.resolveUrl(data.src)
            : null;
    }
    static resolveContentImageSrc(content: string, media: any): string {
        if (media)
            content = content.replace(/<img\s[^>]*?src\s*=\s*['\"]([^'\"]*?)['\"][^>]*?>/gi, x => Util.resolveImageCredit(x, media));

        return content.replace(/<img([^>]*)\ssrc=(['"])(\/[^\2*([^\2\s<]+)\2/gi, '<img$1 src=$2' + ConfigurationService.webUrl + '$3$2');
    }

    static resolveImageCredit(img: string, media: any): string {

        for (const m of media)
            if (img.indexOf(m.fields.umbracoFile.src) > -1) {
                const c = [];
                if (m.fields.description)
                    c.push(m.fields.description);

                if (m.fields.credit)
                    c.push('Photo by ' + m.fields.credit.system.name);

                if (c.length)
                    return img + '<small class="d-block hint-text">' + c.join(', ') + '</small>';
                else
                    return img;
            }

        return img;
    }


    static resolveImageUrl(data: any): string {
        return data && data.url
            ? Util.resolveUrl(data.url)
            : null;
    }

    static resolvePaging<T>(data: any, provider: (tdata: any) => T[], $page?: number, $size?: number): PagingModel<T> {
        const total: number = data.totalResults,
            pages: number = data.totalPages,
            page: number = data.page || $page,
            size: number = data.pageSize || $size,
            model: PagingModel<T> = new PagingModel(total, page, pages, size);
        model.list = provider(data);
        model.total = total || model.list.length;
        return model;
    }

    static mapTo(source: any, keys: string[]): any {
        const target = {};
        keys.forEach(key => target[key] = source[key]);
        return target;
    }

    static getPropertyBool(model: any, name: string, defaultValue?: boolean): boolean {
        return Util.getProperty<boolean>(model, name, defaultValue, value => Util.parseBool(value));
    }

    static getProperty<T>(model: any, name: string, defaultValue?: T, parser?: (value: any) => T): T {

        if (!model.properties)
            return defaultValue;

        const prop = model.properties.find((e: { name: string }) => e.name === name);

        if (!prop)
            return defaultValue;

        if (parser)
            return parser(prop.value);

        return prop.value as T;
    }

    static setPropertyBool(model: any, name: string, value: boolean, ignoreNull?: boolean): void {
        Util.setProperty(model, name, '' + value, ignoreNull);
    }
    static setProperty(model: any, name: string, value: string, ignoreNull?: boolean): void {

        if (ignoreNull && !value)
            return;

        const prop = model.properties.find((e: { name: string }) => e.name === name);

        if (!prop)
            model.properties.push({ name: name, value: value });
        else {
            prop.name = name;
            prop.value = value;
        }
    }

    static getFirstName(fullName: string): string {
        return fullName
            ? fullName.split(' ')[0]
            : fullName;
    }

    static getFileExtension(filename: string) {
        return filename
            // eslint-disable-next-line no-bitwise
            ? filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
            : '';
    }

    static createAction(action: string): any {
        if (action === 'form') return { text: 'Complete', icon: 'edit' };
        if (action === 'link') return { text: 'Open', icon: 'link' };
    }

    static last<T>(data: T[]): T {
        if (Util.isArray(data)) return data[data.length - 1];
    }

}
