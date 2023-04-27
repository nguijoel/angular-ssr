export class MediaUtil {
    static isMedia(type: string): boolean {return type === 'video' || type === 'audio'}
    static icon(type: string): string {return type === 'audio'? 'volume_mute': 'play_arrow'}
}
