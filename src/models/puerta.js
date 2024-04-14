// modelo para el guardado de movimientos 

import { mongoose } from "mongoose"

const puertaSchema = new mongoose.Schema({
    numero : {
        type: Number,
    },
    emailAdmin:{
        type: String   
    },
    idPuerta:{
        type: String
    },
    status :{
        type: Boolean
    },
    acceso : {
        type : Boolean
    },
    alarma: {
        type: Boolean
    },
    activacion:{
        type: String
    },
    usuarios: [{ 
        email: { type: String }
    }]
   
   
}, {timestamps:true, versionKey: false})



export default  mongoose.model("puerta", puertaSchema)