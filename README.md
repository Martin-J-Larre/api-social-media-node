# api-social-media-node
This a RESTful API with node for a ...
## Built with

- NodeJS (CommonJS)
- Express
- Cors
- Dotenv
- Moment
- Validator
- Bcrypt
- Jwt-simple
- Mongo Atlas DB
- Mongoose
- Multer

## CRUD and Endpoints User

### Post
Create user:   
`https://api-social-media-node.onrender.com/api/user/register`  

![alt text](https://github.com/Martin-J-Larre/api-social-media-node/blob/main/public/img/post-1.png?raw=true)

Login:   
`https://api-social-media-node.onrender.com/api/user/login`  

![alt text](https://github.com/Martin-J-Larre/api-social-media-node/blob/main/public/img/post-2.png?raw=true)

Add token authorization in Headers that is in response login for all routes that need auth:   

![alt text](https://github.com/Martin-J-Larre/api-social-media-node/blob/main/public/img/post-3.png?raw=true)

Upload avatar file:   
`https://api-social-media-node.onrender.com/api/user/upload-avatar`  

![alt text](https://github.com/Martin-J-Larre/api-social-media-node/blob/main/public/img/post-4.png?raw=true)


### Get
Get User Profile (id user in params):

`https://api-social-media-node.onrender.com/api/user/profile/63e1d31c96976751ba21c66d`  

Get Users Profiles( page in params optional):

`https://api-social-media-node.onrender.com/api/user/profiles/2`

Get imagen avatar ( filename in params ):

`https://api-social-media-node.onrender.com/api/user/avatar/avatar-1676177126160-lajoya.png`

Get User counter followed and following:

`https://api-social-media-node.onrender.com/api/user/counter/63e1d31c96976751ba21c66d`

### Put
Update user data:

`https://api-social-media-node.onrender.com/api/user/update`

You can update all these fiels

![alt text](https://github.com/Martin-J-Larre/api-social-media-node/blob/main/public/img/img-update.png?raw=true)

## CRUD and Endpoints Follow

### Post
Follow/save a user:

`https://api-social-media-node.onrender.com/api/follow/save`  

Id user to follow in value

![alt text](https://github.com/Martin-J-Larre/api-social-media-node/blob/main/public/img/follow-1.png?raw=true)

### Get

Users following (user auth):
`https://api-social-media-node.onrender.com/api/follow/following`

Users following (id another user in params/page in params optional):
`https://api-social-media-node.onrender.com/api/follow/following/63e1d31c96976751ba21c66d/1`

Users followers (user auth):
`https://api-social-media-node.onrender.com/api/follow/followers`

Users followers (id another user in params/page in params optional):
`https://api-social-media-node.onrender.com/api/follow/followers/63e1d31c96976751ba21c66d/1`

### Delete

User fallowed (id user followed in params)

`https://api-social-media-node.onrender.com/api/delete/63e8609fe68b5544b12410ab`

## CRUD and Endpoints Post (publications)

### Post

Create a post (Publications):

`https://api-social-media-node.onrender.com/api/post/save` 

![alt text](https://github.com/Martin-J-Larre/api-social-media-node/blob/main/public/img/postmodel-1.png?raw=true)

Upload image (id post/publication in params)

`https://api-social-media-node.onrender.com/api/post/upload-img/63ec556ca76c93d967b24165`

![alt text](https://github.com/Martin-J-Larre/api-social-media-node/blob/main/public/img/post-4.png?raw=true)

### Get

Get image file (filename in params):

`https://api-social-media-node.onrender.com/api/post/image/post-1676435317435-avatar-messi.png`

Get feed users (page in params optional):

`https://api-social-media-node.onrender.com/api/post/feed/1`

Get detail/one post (id post in params):

`https://api-social-media-node.onrender.com/api/post/detail/63ec556ca76c93d967b24165`

Get user/another user posts (id user in params/ optional page in params):

`https://api-social-media-node.onrender.com/aapi/post/user/63e860dbe68b5544b12410ae/1`

### Delete

Delete Post/Publication (id post in params)

`https://api-social-media-node.onrender.com/api/delete/63e488ac0007a062f77acca0`

## Server runnig for check

- URL - [https://api-social-media-node.onrender.com/](https://api-social-media-node.onrender.com/)
