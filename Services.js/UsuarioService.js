import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "../util/config";

class UsuarioService {
  
  async cadastrar(data) {
    return axios({
      url: config.API_URL + "usuario/cadastrar",
      method: "POST",
      timeout: config.TIMEOUT_REQUEST,
      data: data,
      headers: config.HEADER_REQUEST,
    }).then((response) => {
      return Promise.resolve(response);
    }).catch((error) => {
      return Promise.reject(error);
    });
  }

  async login(data) {
    return axios({
      url: config.API_URL + "usuario/login",
      method: "POST",
      timeout: config.TIMEOUT_REQUEST,
      data: data,
      headers: config.HEADER_REQUEST,
    }).then((response) => {
      AsyncStorage.setItem("TOKEN", response.data.access_token);
      return Promise.resolve(response);
    }).catch((error) => {
      return Promise.reject(error);
    });
  }

  async loginComToken(data) {
    return axios({
      url: config.API_URL + "usuario/login-token",
      method: "POST",
      timeout: config.TIMEOUT_REQUEST,
      data: data,
      headers: config.HEADER_REQUEST,
    }).then((response) => {
      if (response.data.access_token) {
        AsyncStorage.setItem("TOKEN", response.data.access_token);
        return Promise.resolve(response);
      } else {
        return Promise.reject(response);
      }
    }).catch((error) => {
      return Promise.reject(error);
    });
  }

  async usuariodados() {
    try {
      const token = await AsyncStorage.getItem("TOKEN"); // Recupera o token do AsyncStorage
      if (!token) {
        return Promise.reject(new Error("Token não encontrado"));
      }
  
      return axios({
        url: config.API_URL + "usuario/listar",
        method: "GET",
        timeout: config.TIMEOUT_REQUEST,
        headers: {
          ...config.HEADER_REQUEST,
          Authorization: `Bearer ${token}`, // Insere o token no cabeçalho Authorization
        },
      })
        .then((response) => {
          return Promise.resolve(response);
        })
        .catch((error) => {
          console.log("Erro ao buscar dados do usuário:", error); // Log de erro
          return Promise.reject(error);
        });
    } catch (error) {
      console.log("Erro no processo de obtenção do token:", error); // Log de erro
      return Promise.reject(error);
    }
  }
}

const usuarioService = new UsuarioService();
export default usuarioService;
