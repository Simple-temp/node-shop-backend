import bcrypt from "bcryptjs"

export default [
    {
        name : "Aziz",
        email : "admin@example.com",
        password : bcrypt.hashSync("123456"),
        isAdmin : true ,
    },
    {
        name : "Jhon",
        email : "user@example.com",
        password : bcrypt.hashSync("123456"),
        isAdmin : false ,
    },
]