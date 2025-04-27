import React, { useState, useEffect } from "react";
import {
  View,
  Platform,
  PermissionsAndroid,
  Dimensions,
  StyleSheet,
  Alert,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import { Button, Icon } from "react-native-elements";
import locationsService from "../Services.js/LocationsService";

const { width, height } = Dimensions.get("screen");

export default function MapsScreen() {
  const [Region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const[latitude,setLatitude] = useState("");
  const[longitude,setLongitude] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const[isLoading,setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [isAnimated, setIsAnimated] = useState(false);

  const handleMapPress = (event) => {
    if (isAddingPoint) {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      setSelectedLocation({ latitude, longitude });
      setFormVisible(true);
      setIsAddingPoint(false);
    }
  };

  const handleButtonPress = () => {
    setIsAddingPoint(true);
    Alert.alert("Modo Adicionar", "Agora clique no mapa para selecionar um ponto.");
  };

  const handleSave = () => {
    if (name && description && selectedLocation) {
      // Atualiza latitude e longitude
      setLatitude(selectedLocation.latitude.toString());
      setLongitude(selectedLocation.longitude.toString());
  
      console.log("Local:", selectedLocation);
      console.log("Nome:", name);
      console.log("Descrição:", description);
  
      setFormVisible(false);
  
      // Limpa o estado
      setSelectedLocation(null);
      return true;
    } else {
      Alert.alert("Erro", "Preencha o nome, descrição e selecione um local no mapa.");
      return false;
    }
  };
  
  const handleSaveAndSubmit = () => {
    const isValid = handleSave();
    if (isValid) {
      salvar(); // Chama a função salvar apenas se handleSave retornar true
    }
  };

  const handleCancel = () => {
    setFormVisible(false);
    setSelectedLocation(null);
    setName("");
    setDescription("");
  };

  useEffect(() => {
    getMyLocation();
    carregarLocais(); // Chamar a função que carrega os pontos
  }, []);

  const carregarLocais = () => {
    locationsService
      .buscarLocais()
      .then((response) => {
        setLocations(response.data); // Ajuste conforme a estrutura da sua resposta
      })
      .catch((error) => {
        console.error("Erro ao carregar locais", error);
      });
  };

  const centerMapOnUser = () => {
    if (userLocation) {
      setRegion({
        ...Region,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      });
    }
  };


  const salvar = () => {
    setLoading(true);
  
    let data = {
      nome: name,
      descricao: description,
      latitude: selectedLocation.latitude.toString(),
      longitude: selectedLocation.longitude.toString(),
    };
  
    locationsService
      .cadastrar(data)
      .then((response) => {
        setLoading(false);
        Alert.alert("Sucesso");
        if (response.data.status) {
          // Limpa os campos após o sucesso
          setName("");
          setDescription("");
          setLatitude("");
          setLongitude("");
  
          // Adiciona o novo ponto na lista de locais
          setLocations((prevLocations) => [
            ...prevLocations,
            {
              nome: name,
              descricao: description,
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            },
          ]);
  
          // Limpa o local selecionado
          setSelectedLocation(null);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  function getMyLocation() {
    Geolocation.getCurrentPosition(
      (info) => {
        setRegion({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      (error) => {
        console.error("Error getting location", error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  return (
    <View style={styles.container}>
      {!formVisible && (
        <MapView
          style={{ width: "100%", height: "80%" }}
          onMapReady={() => {
            if (Platform.OS === "android") {
              PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(
                () => {
                  console.log("Usuário aceitou");
                }
              );
            }
          }}
          region={Region}
          zoomEnabled={true}
          minZoomLevel={10}
          loadingEnabled={true}
          showsUserLocation={true}
          onPress={handleMapPress}
        >
          {selectedLocation && <Marker coordinate={selectedLocation} />}

          {locations.map((location, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: parseFloat(location.latitude),
                longitude: parseFloat(location.longitude),
              }}
              title={location.nome}
              description={location.descricao}
              onPress={() => setIsAnimated(!isAnimated)}
              style={isAnimated ? { transform: [{ scale: 1.5 }] } : {}}
            />
          ))}
        </MapView>
      )}

      {formVisible && (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardContainer}
        >
          <ScrollView style={styles.scrollView}>
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Nome"
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={styles.input}
                placeholder="Descrição"
                value={description}
                onChangeText={setDescription}
              />
              <Button title="Salvar" onPress={handleSaveAndSubmit} />

              <Button
                title="Cancelar"
                onPress={handleCancel}
                buttonStyle={styles.cancelButton}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {!formVisible && (
        <Button
          icon={<Icon name="add" size={15} color="white" />}
          buttonStyle={styles.button}
          onPress={handleButtonPress}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    backgroundColor: "black",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "red",
    marginTop: 10,
  },
  form: {
    padding: 10,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 5,
    width: 300,
    flexGrow: 1,
    height: 40,
    fontSize: 18,
    borderBottomColor: '#999',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    alignSelf: 'flex-start'
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
});
