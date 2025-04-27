import React, { useEffect, useState } from 'react';
import { Button } from "@rneui/base";
import { Alert, Text, View, ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import usuarioService from '../Services.js/UsuarioService';

export default function PerfilScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  // Função para fazer logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("TOKEN");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Erro ao sair");
    }
  };

  // Função para buscar os dados do usuário
  const fetchDadosUsuario = async () => {
    try {
      const response = await usuarioService.usuariodados();
      if (response.data && response.data.length > 0) {
        setUserData(response.data[0]);  // Acessa o primeiro item do array
      } else {
        Alert.alert("Erro", "Nenhum dado de usuário encontrado");
      }
      setLoading(false);
    } catch (error) {
      console.log("Erro ao buscar dados do usuário:", error);
      setLoading(false);
      Alert.alert("Erro", "Houve um erro ao carregar os dados");
    }
  };
  

  // Chama a função para buscar dados quando a tela é carregada
  useEffect(() => {
    fetchDadosUsuario();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    {userData ? (
      <>
        <Text style={{ fontSize: 20 }}>Nome: {userData.nome}</Text>
        <Text style={{ fontSize: 20 }}>Email: {userData.email}</Text>
        <Text style={{ fontSize: 20 }}>CPF: {userData.cpf}</Text>
        <Text style={{ fontSize: 20 }}>Telefone: {userData.telefone}</Text>
      </>
    ) : (
      <Text>Não foi possível carregar os dados do usuário</Text>
    )}

    <Button
      title="Sair"
      loading={false}
      loadingProps={{ size: 'small', color: 'white' }}
      buttonStyle={{
        backgroundColor: '#1958ce',
        borderRadius: 5,
      }}
      titleStyle={{ fontWeight: 'bold', fontSize: 23 }}
      containerStyle={{
        marginHorizontal: 50,
        height: 50,
        width: 280,
        marginVertical: 10,
      }}
      onPress={logout}
    />
  </View>
  );
}
