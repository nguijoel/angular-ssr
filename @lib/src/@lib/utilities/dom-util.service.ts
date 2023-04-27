
export class DomUtil {

  /**
   * Opens a centralised popup window 
   * @param url 
   * @param title 
   * @param w 
   * @param h 
   * @returns 
   */
  static popupCenter(url: string | URL, title: string, w: number, h: number) {
    const hasSpace = window.matchMedia(`(min-width: ${w + 20}px) and (min-height: ${h + 20}px)`).matches;
    const isDef = (v: number) => typeof v !== 'undefined';
    const screenX = isDef(window.screenX) ? window.screenX : window.screenLeft;
    const screenY = isDef(window.screenY) ? window.screenY : window.screenTop;
    const outerWidth = isDef(window.outerWidth) ? window.outerWidth : document.documentElement.clientWidth;
    const outerHeight = isDef(window.outerHeight) ? window.outerHeight : document.documentElement.clientHeight - 22;
    const targetWidth = hasSpace ? w : null;
    const targetHeight = hasSpace ? h : null;
    const ratio = screenX < 0 ? window.screen.width + screenX : screenX;
    const left = parseInt('' + (ratio + (outerWidth - (targetWidth || 0)) / 2), 10);
    const right = parseInt('' + (screenY + (outerHeight - (targetHeight ||0)) / 2.5), 10);
    const features = [];
  
    if (targetWidth !== null) features.push(`width=${targetWidth}`);
    if (targetHeight !== null) features.push(`height=${targetHeight}`);
  
    features.push(`left=${left}`);
    features.push(`top=${right}`);
    features.push('scrollbars=1');
  
    const newWindow: any = window.open(url, title, features.join(','));
  
    if ((window as any).focus) newWindow.focus();
  
    return newWindow;
  }

}
