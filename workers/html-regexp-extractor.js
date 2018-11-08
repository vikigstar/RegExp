export default {
  
  
  getH1 (html)  {
    try{
      var h1Regx = /\<h1\>(.*)\<\/h1\>/i;
      return html.match(h1Regx)[1]||"";
    }catch(e){
      return false;
    }
  },

  setH1 (html, value)  {
    try{
      var titleRegx = /(\<h1\>)(.*)(\<\/h1\>)/i;
      return html.replace(titleRegx,"$1"+value+"$3");
    }catch(e){
      return false;
    }
  },

  getTitle (html)  {
    try{
      var titleRegx = /\<title\>(.*)\<\/title\>/i;
      return html.match(titleRegx)[1]||"";
    }catch(e){
      return false;
    }
  },
  
  setTitle (html, value)  {
    try{
      var titleRegx = /(\<title\>)(.*)(\<\/title\>)/i;
      return html.replace(titleRegx,"$1"+value+"$3");
    }catch(e){
      return false;
    }
  },
 
  getMetaTags (html)  {
    // regexp to get all meta tags and build key value as follows
    // <meta name="description" content="This description">
    // <meta name="keywords" content="This keyword">
    //
    // returns  
    //
    // { meta_description: 'This description', meta_keywords: 'This keyword' }
    try{
      var metas = {};
      var metaRegex = /\<meta.*?name=["'](.*)["'].*?content=["'](.*)["'].*?\>|\<meta.*?content=["'](.*)["'].*?name=["'](.*)["'].*?\>|\<meta.*?property=["'](.*)["'].*?content=["'](.*)["'].*?\>|\<meta.*?content=["'](.*)["'].*?property=["'](.*)["'].*?\>/gi;
      var match = metaRegex.exec(html);
      while (match != null) {
        for (var i = 1; i < 10; i++) {
          if(match[i]!=undefined) break;
        }
        metas[match[i]] = match[i+1];
        match = metaRegex.exec(html);
      }

      return metas;
    }catch(e){
      return false;
    }
  },
  
  getMetaTag (html, name)  {
    // get the meta tag "content" value, by the meta "name"
    // getMetaTag(html, 'description')
    // with HTML of <meta name="description" content="This description">
    // would return 'This description'
    try{
      var metaRegex = new RegExp('\<meta.*?name=["\']'+name+'["\'].*?content=["\'](.*)["\'].*?\>|\<meta.*?content=["\'](.*)["\'].*?name=["\']'+name+'["\'].*?\>|\<meta.*?content=["\'](.*)["\'].*?property=["\']'+name+'["\'].*?\>|\<meta.*?property=["\']'+name+'["\'].*?content=["\'](.*)["\'].*?\>', 'i');
      var match = html.match(metaRegex);
      for (var i = 1; i < 10; i++) {
          if(match[i]!=undefined) break;
        }
      return match[i];
    }catch(e){
      return false;
    }
  },
  
  setMetaTag (html, name, value)  {
    // set the meta tag "content" value, by the meta "name"
    // setMetaTag(html, 'description', 'Value')
    // with HTML of <meta name="description" content="This description">
    // would return html with <meta name="description" content="Value">
    try{
      var metaRegex = new RegExp('(\<meta.*?name=["\']'+name+'["\'].*?content=["\'])(.*)(["\'].*?\>)|(\<meta.*?content=["\'])(.*)(["\'].*?name=["\']'+name+'["\'].*?\>)|(\<meta.*?property=["\']'+name+'["\'].*?content=["\'])(.*)(["\'].*?\>)|(\<meta.*?content=["\'])(.*)(["\'].*?property=["\']'+name+'["\'].*?\>)', 'i');
      var match = html.match(metaRegex);
      for (var i = 1; i < 14; i++) {
        if(match[i]!=undefined) break;
      }
      return html.replace(metaRegex,"$"+i+value+"$"+(i+2));
    }catch(e){
      return false;
    }
  },

  parse (html)  {
    const attrs = {
      page_title: this.getTitle(html),
      h1: this.getH1(html)
    }
    
    const meta = this.getMetaTags(html)
    
    return Object.assign(attrs, meta)
  }
}
