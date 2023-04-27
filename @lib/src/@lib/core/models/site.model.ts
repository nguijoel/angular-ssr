import { IEntity, IEntityDetail, IImageUrl, ILink, ISocialLink } from "../../common/interfaces";
import { BEUtil } from "../../utilities";

export class SiteInfo implements IEntity, IEntityDetail  {
    uid: string;
    name: string;
    createDate?: Date;
    updateDate?: Date;
    strapline?: string;
    description?: string;
    shortDescription?: string;
    hint?: string;
    
    noReplyEmail: string;
    logo?: IImageUrl;
    socialLinks?: ISocialLink[];
    address: string;
    email: string;
    mobile: string;
    phone: string;
    disclaimer: string;
    openingTimesId?: string;
    timezone: string;
    policies?: ILink[];

    constructor (data: any){ 
  
        const fields = BEUtil.getFields(data),
              e = BEUtil.setEntityDetail(data, this);
        
        this.name = e.name;      
        this.uid = e.uid;
        this.createDate = e.createDate;
        this.updateDate = e.updateDate;

        this.address = fields.address;
        this.email = fields.email;
        this.noReplyEmail = fields.noReplyEmail;
        this.mobile = fields.mobile;
        this.phone = fields.phone;
        this.logo = BEUtil.createImgeUrl(fields.logo,'logo');
        this.socialLinks =  BEUtil.createSocialLinks(fields);
        this.disclaimer =  fields.disclaimer;
        this.openingTimesId = BEUtil.getLinkContentId(fields,'openingTimes');
        this.timezone =  fields.timezone;
        this.policies = BEUtil.createContentLinks(fields.policies);
    }
}
