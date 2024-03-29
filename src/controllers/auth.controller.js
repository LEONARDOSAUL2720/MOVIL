import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { creartoken } from "../libs/jwt.js";




export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find({}, 'username email rfid').limit(10); // Obtiene los usuarios con solo los campos username, email y rfid
    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({ message: "No se encontraron usuarios." });
    }
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};


export const register = async (req, res) => {
  const { username, email,  rfid, puerta } = req.body;
  try {
    //  const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      // password: passwordHash,
      rfid,
      puerta
    });
    
    const userSave = await newUser.save();
    const token = await creartoken({ id: userSave._id });

    res.cookie("token", token);
    res.json({
      id: userSave._id,
      username: userSave.username,
      email: userSave.email,
      rfid: userSave.rfid,
      puerta: userSave.puerta
    });
  } catch (error) {
    console.error("Error en el registro:", error); // Imprimir el error en la consola del servidor
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// export const register = async (req, res) => {
//   const { username, email, password, rfid, puerta } = req.body;
//   try {
//      const passwordHash = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       username,
//       email,
//       password: passwordHash,
//       rfid,
//       puerta
//     });
//     const userSave = await newUser.save();
//     const token = await creartoken({ id: userSave._id });

//     res.cookie("token", token);
//     res.json({
//       id: userSave._id,
//       username: userSave.username,
//       email: userSave.email,
//       rfid: userSave.rfid,
//       puerta: userSave.puerta
//     });
//   } catch (error) {
//     console.error("Error en el registro:", error); // Imprimir el error en la consola del servidor
//     res.status(500).json({ message: "Error interno del servidor" });
//   }
// };




// entramso a la sesion
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (!userFound)
      return res.status(400).json({ message: "usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: "credenciales invalidas" });

    const token = await creartoken({ id: userFound._id });

    res.cookie("token", token);
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; // cierra login

// salimos de la sesion
export const logout = async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
}; // cierra logout

// validamos sesiones
export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);
  if (!userFound)
    return res.status(400).json({ message: "usuario mo encontrado" });

  return res.json({
    id: userFound._id,
    email: userFound.email,
    username: userFound.username,
  });
}; // cierra profile


