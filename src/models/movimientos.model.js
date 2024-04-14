import { mongoose } from "mongoose";

// modelo para el guardado de movimientos 

 const movimientosSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        
    },
    emailAdmin:{
        type: String,
        required: true,

    },
    rfid: {
        type: String,
        required: true,
        trim: true,
        

    },
    puerta:{
        type: Number,
        required: true,
        trim: true,
        
    },
    fecha: {
        type: Date, // Cambiado a tipo Date para almacenar la fecha
        default: Date.now, // Establecer la fecha actual por defecto
    },
},{versionKey : false,timestamps: true})

export default mongoose.model('movimientos', movimientosSchema)