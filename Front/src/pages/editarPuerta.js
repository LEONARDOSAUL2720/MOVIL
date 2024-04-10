import React, { useState, useEffect, useRef  } from "react";
import IPADRESS from "../../Config/IP_Local";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
  ScrollView,
  
} from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";


function EditarPuerta({route}) {

 const navigation = useNavigation();

 const { _id, numeroPuerta, usuarios, id_Puerta } = route.params; 



 console.log(`
    _id: ${_id}
    numero: ${numeroPuerta}
    id_puerta: ${id_Puerta}
    usuarios: ${usuarios}
  `)

  const [numeroPuertaInput, setNumeroPuertaInput] = useState('');
  const [idPuerta, setIdPuerta] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [usuariosPuerta, setUsuariosPuerta] = useState([]); // Nuevo estado para almacenar los usuarios y sus rfid_id
  const [nuevoUsuario, setNuevoUsuario] = useState(""); // Estado 
  const usuariosPuertaOriginalesRef = useRef([]);

  useEffect(() => {
    // Guardar una copia de los usuarios originales al montar el componente
    usuariosPuertaOriginalesRef.current = usuarios;
  }, [usuarios]);

  // Restaurar los usuarios originales en caso de error
  const restoreUsuariosOriginales = () => {
    setUsuariosPuerta(usuariosPuertaOriginalesRef.current);
  };

  useEffect(() => {

    setNumeroPuertaInput(numeroPuerta.toString());
    setIdPuerta(id_Puerta.toString());
    setUsuariosPuerta(usuarios);
    
    
  }, [numeroPuerta, id_Puerta, usuarios]);

//   RECUPERAR EL EMAIL DEL ADMIN
  useEffect(() => {
      // Recuperar el correo electrónico almacenado al cargar la vista
      AsyncStorage.getItem('userEmail').then((value) => {
          if (value !== null) {
              setUserEmail(value);
              console.log("Valor de userEmail:", value); 
          }
      });
  }, []);


  const handleEdit = async () => {

      // Convertir usuariosPuerta a un arreglo de objetos antes de enviarlo al servidor
      const usuariosArray = usuariosPuerta.map(usuario => ({ email: usuario.email, emailAdmin: usuario.emailAdmin }));

    try {
      const response = await axios.put(
        `${IPADRESS}api/puertas`,
        {
            _id: _id,
            numeroPuerta: numeroPuertaInput,
            idPuerta: idPuerta,
            emailAdmin: userEmail,
            usuarios: usuariosArray.map(usuario => ({ email: usuario.email, emailAdmin: usuario.emailAdmin }))
  }
         
      );
            
      if (response.status === 200) {
        console.log(`
        DATOS ENVIADOS::::
        _id: ${_id}
        numero: ${numeroPuertaInput}
        id_puerta: ${idPuerta}
        usuarios: ${usuarios}
        `)

        console.log("RESPUESTA DEL SERVIDOR:", response.data); 

        setNumeroPuertaInput("");
        setIdPuerta("");
        setUsuariosPuerta([]);
        Alert.alert(
          `Puerta ${numeroPuertaInput} actualizada`
        );
        navigation.navigate('Principal');
      } else if (response.status === 400) {
        Alert.alert(
          "Error al actualizar Puerta",
          response.data.message 
        );
      }
      
    } catch (error) {
      console.error("Error al enviar datos al servidor:", error.message);
      if (error.response && error.response.data && error.response.data.message) {
        // Si hay un mensaje de error personalizado en la respuesta del servidor, muestra ese mensaje
        Alert.alert(
          "Error de Actualización",
          error.response.data.message
        );
      } else {
        // Si no hay un mensaje de error personalizado, muestra un mensaje genérico
        Alert.alert(
          "Error de Actualización",
          "Hubo un problema al actualizar la Puerta. Por favor, intenta nuevamente."
        );
      }
      console.log(usuarios)
       // Restaurar los usuarios originales en caso de error
       restoreUsuariosOriginales();
    }
    
  };

  const agregarUsuario = () => {
    // Verificar si el nuevo usuario ya existe en la lista de usuarios
    const usuarioExistente = usuariosPuerta.find(usuario => usuario.email === nuevoUsuario);
    
    if (usuarioExistente) {
      Alert.alert("Error", "El usuario ya existe en la lista.");
      return;
    }
  
    // Actualizar todos los usuarios existentes agregándoles el campo emailAdmin
    const usuariosActualizados = usuariosPuerta.map(usuario => ({
      ...usuario,
      emailAdmin: userEmail
    }));
  
    // Agregar el nuevo usuario a la lista de usuarios actualizada
    const nuevoUsuarioConAdmin = { email: nuevoUsuario, emailAdmin: userEmail };
    const nuevosUsuarios = [...usuariosActualizados, nuevoUsuarioConAdmin];
    setUsuariosPuerta(nuevosUsuarios);
    console.log("UsuariosPuerta después de la actualización:", nuevosUsuarios);
    setNuevoUsuario(""); // Limpiar el campo de entrada después de agregar el usuario
  };
  
  
  
  
  

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.contenido}>
      <Text style={styles.label}>Numero</Text>
        <TextInput
         style={styles.input}
         placeholder="Numero de Puerta"
         onChangeText={setNumeroPuertaInput}
         keyboardType="default"
         value={numeroPuertaInput}
        />
        <Text style={styles.label}>ID Puerta</Text>
        <TextInput
          style={styles.input}
          placeholder="ID de la Puerta"
          onChangeText={setIdPuerta}
          keyboardType="default"
          value={idPuerta}
        />

         {/* Nuevo campo de entrada para el rfid_id del usuario */}
         <Text style={styles.label}>Usuarios</Text>
        <TextInput
          style={styles.input}
          placeholder="Usuarios Permitidos"
          onChangeText={setNuevoUsuario}
          keyboardType="email-address"
          value={nuevoUsuario}
        />
        
        <TouchableOpacity onPress={agregarUsuario} style={styles.btnAgregarUsuario}>
          <Text style={styles.btnTextoAgregar}>Agregar Usuario</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleEdit} style={styles.btnRegistrar}>
          <Text style={styles.btnTexto}>Actualizar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    
  },
  contenido: {
    backgroundColor: "#c8cbd1",
    flex: 1,
    justifyContent: "flex-start", // Alinea el contenido al principio
    paddingHorizontal: 23,
    padding: 60,
    
  },
  label: {
    color: "#151517",
    marginBottom: 10,
    marginTop: 20,
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#f0e9d8",
    padding: 15,
    borderRadius: 10,
    color: "#343c48",
    marginBottom: 10,
    textAlign:"center"
  },
  btnRegistrar: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 40,
    marginLeft: 40,
    marginRight: 40,
    backgroundColor: "#0d1323",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btnAgregarUsuario:{
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 55,
    marginRight: 55,
    backgroundColor: "#0d1323",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  btnTexto: {
    color: "#ebd7be",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 28,
    textTransform:"uppercase"
  },
  btnTextoAgregar:{
    color: "#ebd7be",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    textTransform:"uppercase"
  },
  accesoInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  accesoInput: {
    flex: 1,
    backgroundColor: "#f0e9d8",
    padding: 15,
    borderRadius: 10,
    color: "#0d1323",
  },
  toggleButton: {
    padding: 10,
    backgroundColor: "#ece6ea",
    borderRadius: 10,
    marginLeft: 10,
  },
  toggleButtonText: {
    color: "#ebd7be",
    fontWeight: "bold",
  },
});

export default EditarPuerta;
