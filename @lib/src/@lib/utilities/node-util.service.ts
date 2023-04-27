
import { INodeVote ,INodeAuthor, INodeContent, INodeEntity, INodeMedia } from '../common/node';

export class NodeUtil {
  static setMedia = (data: any, model?: INodeMedia): INodeMedia => {
    model = model || {} as INodeMedia;
    model.mediaUrl = data.media_url;
    model.mediaId = data.media_id;
    model.mediaType = data.media_type;
    if(data.image_url) model.imageUrl = data.image_url;
    return model;
  };  
  
  static setUserVote = (data: any, model?: INodeVote): INodeVote => {
    model = model || {} as INodeVote;
    if(data.vote_up)model.likes = data.vote_up;
    if(data.vote_down)model.dislikes = data.vote_down;
    if(data.user_vote?.action)model.vote = data.user_vote.action;
    if(data.user_vote?.created_at)model.voteAt = data.user_vote.created_at;
    
    NodeUtil.setUserVoteFav(data, model);

    return model;
  };

  static setUserVoteFav = (data: any, model: INodeVote): void => {
    if(data.user_fav?.created_at || model.favorite) model.favorite = data.user_fav.created_at;
  };  

  static setReplyEntity = (data: any, model?: INodeContent): INodeContent |undefined => {

    if (!data.reply_uid) return;

    model = model || {} as INodeContent;

    model.reply = {
      uid: data.reply_uid,
      author: NodeUtil.createAuthor(data.reply_author_id, data.reply_author, data.reply_avatar)
    } as INodeEntity;

    return model;
  };

  static setPostEntity = (data: any, model?: INodeContent): INodeContent | undefined => {

    if (!data.post_uid) return;

    model = model || {} as INodeContent;

    model.post = {
      uid: data.post_uid,
      description: data.post_description,
      title: data.post_title,
      author: NodeUtil.createAuthor(data.post_author_id, data.post_author, data.post_avatar)
    } as INodeEntity;

    return model;
  };

  static createAuthor = (id: number, name: string, avatar: string): INodeAuthor => ({ id, name, avatar } as INodeAuthor);

}
