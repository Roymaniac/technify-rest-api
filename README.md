# User Management MVP

> It's a simple Rest API project for user management built with Javascript, NodeJS, and other technologies.
>
> This MVP has basic objectives for now:
>
> * create and edit a user
> * login and authenticate.

## 🚀 Technologies

* Node.js
* Express
* MongoDB
* JWT
* Cloudinary

## 📌 Features

* Register
* Login
* Edit Profile
* View Profile
* Upload profile picture
* Delete Profile

## Routes

| Routes | API Endpoint          |
|--------|-----------------------|
|Register | `api/users/register` |
| Login | `api/users/login`      |

 Protected Routes | API Endpoint          | Required             |
|--------|-----------------------|----------------------|
|View Profile | `api/users/me`   |  `Auth token`        |
| Upload Picture | `api/users/me/upload` | `Auth token` |
| Edit Profile | `api/users/me/edit` |   `Auth token`  |
| Delete Profile | `api/users/me/delete` |`Auth token`  |

## **:arrow_down:** Clone this project

```bash
# Clone this repository
git clone https://github.com/roymaniac/technify-rest-api

# Go into the directory
$ cd technify-rest-api

# Install dependencies
npm i

# Add and config .env file

# Start the server
$ npm run server
```

### Create

A <a href="https://cloudinary.com/">Cloudinary account</a>

### Environment variables (`.env` file)

```env
PORT=
SALT=
JWT_SECRET=
NODE_ENV=
MONGO_URI=
CLOUD_NAME=
API_KEY=
API_SECRET=
CLOUDINARY_DEFAULT_URL= // default image url
CLOUDINARY_DEFAULT_PUBLIC_ID= // default image public_id
```

## Author

* Github - [Roymaniac](https://www.github.com/Roymaniac)

* Twitter - [@awele_roy](https://www.twitter.com/awele_roy)
