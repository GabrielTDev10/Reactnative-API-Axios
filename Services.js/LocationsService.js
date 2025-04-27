import axios from "axios";
import config from "../util/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

class LocationsService {
  async cadastrar(data) {
    try {
      // Obtém o token do AsyncStorage
      let token = await AsyncStorage.getItem("TOKEN");
      
      if (!token) {
        throw new Error("Token não encontrado");
      }
    
    
   
      return axios({
        url: config.API_URL + "locations/cadastrar",
        method: "POST",
        timeout: config.TIMEOUT_REQUEST,
        data: data,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`, // Corrige o cabeçalho com o espaço adequado
        },
      })
        .then((response) => {
          return Promise.resolve(response);
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    } catch (error) {
      // Lida com erros na obtenção do token
      console.error("Erro ao obter o token", error);
      return Promise.reject(error);
    }
  }

  async buscarLocais() {
    try {
      let token = await AsyncStorage.getItem("TOKEN");
      if (!token) {
        throw new Error("Token não encontrado");
      }

      return axios({
        url: config.API_URL + "locations/listar", // Ajuste essa URL conforme necessário
        method: "GET",
        timeout: config.TIMEOUT_REQUEST,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          return Promise.resolve(response);
        })
        .catch((error) => {
          return Promise.reject(error);
        });
    } catch (error) {
      console.error("Erro ao obter o token", error);
      return Promise.reject(error);
    }
  }
}

const locationsService = new LocationsService();
export default locationsService;
