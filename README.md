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

Get User counter followed and following
`https://api-social-media-node.onrender.com/api/user/counter/63e1d31c96976751ba21c66d`

### Put
Update user data:
`https://api-social-media-node.onrender.com/api/user/update`
You can update all these fiels

![alt text](https://github.com/Martin-J-Larre/api-social-media-node/blob/main/public/img/img-update.png?raw=true)




## Server runnig for check

- URL - [https://](https://)
