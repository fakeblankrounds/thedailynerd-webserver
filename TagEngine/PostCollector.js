//Gathers posts and stores them.
var posts = new Array(2);
var tags = new Array(10);
var postBody = new Array(2);
var postAccessCount = new Array(2);
var chronoPosts = new Array(2);
var postsChrono = new Array(2);
var postNumber = 0;

exports.addPost = function (post, postbody, tagCollection) {
    posts[post] = tagCollection;
    postBody[post] = postbody;
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
};

var postDivOdd = '<div class="oddPost">';
var postDivEven = '<div class="evenPost">';
var postDivEnd = '</div>';


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
		return postDivEven + postBody[path] + postDivEnd;
	else
		return postDivOdd + postBody[path] + postDivEnd;
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