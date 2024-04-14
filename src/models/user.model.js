// modelo para el guardado de usuarios normales 

import { mongoose } from "mongoose";

 const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,

    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true,

    },
    emailAdmin:{
        type: String,
        required: true,

    },
    rfid: {
        type: String,
        required: true,
        trim: true,
        unique: true,

    }, 
     puerta :[{ 

        puerta_id: { type: String }
         
    }]

},{versionKey : false,timestamps: true})

export default mongoose.model('usuarios', userSchema)