# Index

- [About this project](#About-this-project)
- [Configuration](#Configuration)
- [Endpoints](#Endpoints)
- [POSTMAN DOCUMENTATION](https://documenter.getpostman.com/view/21643141/2s9YC1Vu9P)

## About this project


## Configuration

To use this project in your local follow the next steps:

- Create an account on [mongodb atlas](https://www.mongodb.com/atlas).
- Select the `free version` of the cloud storage for your api.
- Create yours credentials (username, password) for yours db.
- go to `Network Access` and add your IP Address and confirm.
- Once we have our `cluster, user, and IP`, we can go to the `Database section` (located on the left side of the panel, at the top), and choose the connection method. For this case, we will select `Connect your application.`
- Now you have an URL like this `mongodb+srv://username:password@cluster0.hfisa.mongodb.net/?retryWrites=true&w=majority`
- Now, you need to create a `.env` file in the root of your local project, and now paste this:
  `MONGO=mongodb+srv://username:password@cluster0.hfisa.mongodb.net/?retryWrites=true&w=majority`
  (Remember to change`username` and `password` with yours credentials).
- Now open a terminal and run `npm run dev` to build your Ts application run `npm run build` .

## Endpoints:


