//Gathers posts and stores them.
var posts = new Array(2);
var tags = new Array(10);
var postTitles = new Array(10);
var postBody = new Array(2);
var postSlice = new Array(2);
var postAccessCount = new Array(2);
var chronoPosts = new Array(2);
var postsChrono = new Array(2);
var postNumber = 0;

exports.addPost = function (post, postbody, tagCollection) {
	postbody = postbody.replace('<h1>', '<a href="?post=' + post + '"><h1>');
	postbody = postbody.replace('</h1>', '</h1></a>');
    posts[post] = tagCollection;
    postBody[post] = postbody;
	postSlice[post] = postbody.slice(0, postbody.search("<!--Slice-->"));
    postAccessCount[post] = 0;
	chronoPosts[postNumber] = post;
	postsChrono[post]=postNumber;
	postNumber++;
    for (tag in tagCollection) {
        if (tagCollection[tag] in tags) {
            console.log("pushing old tag " + tagCollection[tag]);
            tags[tagCollection[tag]].push(post);
        } else {
            console.log("makeing new tag " + tagCollection[tag]);
            tags[tagCollection[tag]] = new Array(2);
            tags[tagCollection[tag]].push(post);
        }
    }
	postTitles[post] = postbody.substring(postbody.search('<h1>') + 4, postbody.search('</h1>'));
	
//	console.log(postTitles[post]);
};

var postDivOdd =  '<div class= "oddPost">';
var postDivEven = '<div class="evenPost">';
var postbloggity = '<div class="BlogityBox"><iframe src="//www.facebook.com/plugins/like.php?href=www.thedailynerd.com/?post=' 
var postFB = '&amp;send=false&amp;layout=box_count&amp;width=90&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font=verdana&amp;height=90&amp;appId=342906746221" scrolling="no" frameborder="0" style="border:none; overflow:hidden; height:60px; width:60px;" allowTransparency="true"></iframe>';
var postTwitter = '<a href="https://twitter.com/share" class="twitter-share-button" data-url="www.thedailynerd.com/?post=';
var postTwitterURL ='" data-text="' ;
var postTwitterTweetText= '" data-count="vertical" data-via="ntkachov">Tweet</a><script type="text/javascript" src="//platform.twitter.com/widgets.js"></script></div>';
var postDivEnd = '</div>';
var postMore = '<a href="@#$URL$#@" style="right:0px;margin:15px; margin-left:90%">more... </a>';

exports.getPostByNumber = function (num)
{	
	return chronoPosts[num];
};

exports.removePost = function (post) {
    posts.splice(post, 1);
	postNumber--;
};

exports.getPost = function (path) {
    postAccessCount[path] = postAccessCount[path] + 1;
	if(postBody[path] != undefined){
	if((postsChrono[path] % 2) == 0)
		return postDivEven + postbloggity + path + postFB + postTwitter + path + postTwitterURL + "The Daily Nerd: " + postTitles[path] + "http://www.thedailynerd.com/?post=" + path + postTwitterTweetText + postBody[path] + postDivEnd;
	else
		return postDivOdd + postbloggity  + path + postFB + postTwitter + path + postTwitterURL + "The Daily Nerd: " + postTitles[path] + "http://www.thedailynerd.com/?post=" + path + postTwitterTweetText + postBody[path] + postDivEnd;
	}
	else
		return undefined;
};

exports.getShort = function (path){
  postAccessCount[path] = postAccessCount[path] + 1;
	if(postBody[path] != undefined){
	if((postsChrono[path] % 2) == 0)
		return postDivEven + postbloggity + path + postFB + postTwitter + path + postTwitterURL + "The Daily Nerd: " + postTitles[path] + "http://www.thedailynerd.com/?post=" + path + postTwitterTweetText + postSlice[path] + postMore.replace('@#$URL$#@',"http://www.thedailynerd.com/?post=" + path) + postDivEnd;
	else
		return postDivOdd + postbloggity  + path + postFB + postTwitter + path + postTwitterURL + "The Daily Nerd: " + postTitles[path] + "http://www.thedailynerd.com/?post=" + path + postTwitterTweetText + postSlice[path] + postMore.replace('@#$URL$#@',"http://www.thedailynerd.com/?post=" + path) + postDivEnd;
	}
	else
		return undefined;
};

exports.getPostByTag = function (tag) {
    return tags[tag];
};

exports.getTags = function (path) {
    return posts[path];
};

exports.debug = function () {
    return posts.toString() + tags.toString() + postBody.toString();
};

exports.getPostCounts = function()
{
	return postAccessCount;
};

exports.clearPosts = function()
{
 posts = [];
 tags = [];
 postBody = [];
 postAccessCount = [];
 chronoPosts = [];
 postsChrono = [];
 postNumber = 0;
}