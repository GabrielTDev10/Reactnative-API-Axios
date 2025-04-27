import { View, Text, StyleSheet, Platform, Alert } from 'react-native'
import React, { useState } from 'react'
import { Button, CheckBox, Icon, Input } from 'react-native-elements'
import { MaskedTextInput} from "react-native-mask-text";
import MaskInput from 'react-native-mask-input';
import styles from '../style/Mainstyle';
import { KeyboardAvoidingView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import usuarioService from '../Services.js/UsuarioService';




export default function Cadastro() {

    const [email,setEmail] = useState('')
    const [nome,setNome] = useState('')
    const [password,setPassword] = useState('')
    const [cpf,setCpf] = useState('')
    const [telefone,setTelefone] = useState('')
    const [IsSelected, setIsSelected] = useState(false)
    const [errorEmail,setErrorEmail] = useState('')
    const [errorNome,setErrorNome] = useState('')
    const [errorPassword,setErrorPassword] = useState('')
    const [errorCpf,setErrorCpf] = useState('')
    const [errorTelefone,setErrorTelefone] = useState('')
    const [isLoading, setLoading] = useState(false)

    const [visibleDialog, setVisibleDialog] = useState(false);
    const [titulo, setTitulo] = useState(null)
    const [mensagem, setMensagem] = useState(null)
    const [tipo, setTipo] = useState(null)


    let cpfField = null

    const showDialog = (titulo, mensagem, tipo) => {
      setVisibleDialog(true)
      setTitulo(titulo)
      setMensagem(mensagem)
      setTipo(tipo)
    }



    const validar = () =>{

        let error = false;
        setErrorEmail(null)
        setErrorCpf(null)
        setErrorNome(null)
        setErrorTelefone(null)
        setErrorPassword(null)
        const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

        const validarCPF = (cpf) => {
          cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
        
          if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false; // CPF inválido ou todos os dígitos são iguais
          }
        
          let soma = 0;
          let resto;
        
          for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.charAt(i - 1)) * (11 - i);
          }
          resto = (soma * 10) % 11;
          if (resto === 10 || resto === 11) resto = 0;
          if (resto !== parseInt(cpf.charAt(9))) return false;
        
          soma = 0;
          for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.charAt(i - 1)) * (12 - i);
          }
          resto = (soma * 10) % 11;
          if (resto === 10 || resto === 11) resto = 0;
          if (resto !== parseInt(cpf.charAt(10))) return false;
        
          return true;
        }

        
       

        if(!re.test(String(email).toLowerCase())){
            setErrorEmail('Preencha seu E-mail corretamente');

           error = true;
        }
        if (!validarCPF(cpf)){
            setErrorCpf('Preencha o seu CPF corretamente');
            error = true;
        }
       
          if(telefone.length != 15){
            setErrorTelefone('Preencha o seu telefone');
            error = true;
          }
        
       
        if(nome == ''){
          setErrorNome('Preencha o seu Nome');
          error = true;
        }
        if(password == ''){
          setErrorPassword('Preencha a sua senha');
          error = true;
        }
        if(IsSelected == false){
            error = true
        }
        return !error;
    }

    const salvar = () => {
      if (validar()){
        setLoading(true)
        
        let data = {
          email: email,
          cpf: cpf,
          nome: nome,
          telefone: telefone,
          password: password,
        }


        
        usuarioService.cadastrar(data)
        .then((response) => {
          setLoading(false)
          const titulo = (response.data.status) ? "Sucesso" : "Erro"
          showDialog(titulo, response.data.mensagem, "SUCESSO")
          Alert.alert(titulo, response.data.mensagem)     
          if (response.data.status) {
            // Limpar os campos do formulário
            setNome('');
            setEmail('');
            setPassword('');
            setCpf('');
            setTelefone('');
            // Também pode limpar mensagens de erro
            setErrorNome(null);
            setErrorEmail(null);
            setErrorPassword(null);
            setErrorCpf(null);
            setErrorTelefone(null);
          }       
        })       
        .catch((error) => {
          setLoading(false)
          showDialog("Erro","Houve um erro inesperado", "ERRO")
          //Alert.alert("Erro", "Houve um erro inesperado")
        })
      }
  }
   

  return (
  
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    style={styles1.container}>

     
        <Input
                placeholder="Nome"
                value={nome}
                leftIcon={{ type: 'font-awesome', name: 'user' }}    
                onChangeText={value => {setNome(value),setErrorNome(null)}}   
                returnKeyType='done'      
                errorMessage={errorNome}
          />
          <Input
                placeholder="E-mail"
                value={email}
                leftIcon={{ type: 'font-awesome', name: 'envelope' }}    
                onChangeText={value => {setEmail(value) ,setErrorEmail(null)}}
                keyboardType='email-address'
                returnKeyType='done'  
                errorMessage={errorEmail}

          />
        <Input
                placeholder="Password"
                value={password}
                leftIcon={{ type: 'font-awesome', name: 'lock' }}
                onChangeText={value => {setPassword(value),setErrorPassword(null)}}
                secureTextEntry={true}
                returnKeyType='done'  
                errorMessage={errorPassword}
          />
    
          <View style={styles.containerMasked}>
              <MaskInput
                value={cpf}
                mask={[
                  /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/
                ]}
                placeholder="Digite seu CPF"
                onChangeText={value => {setCpf(value),setErrorCpf(null)}}
                keyboardType='number-pad'
                returnKeyType='done'  
               
                style={styles.Maskedinput}
                ref={(ref)=> cpfField =ref}
              />       
         </View>
         <Text style={styles.errorMessage}>{errorCpf}</Text>
         
        
        
          <View style={styles1.container1}>
                    <Icon name="phone" size={24} color="#000"/>
                    <MaskInput
                      value={telefone}
                      onChangeText={(masked, unmasked) => {
                        setTelefone(masked);
                      }}
                      mask={[
                        '(', /\d/, /\d/, ')', /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/
                      ]}
                      placeholder="(99)9 9999-9999" 
                      keyboardType='numeric'
                    style={styles.Maskedinput2}
                    />
                  
                    
          </View>
          <Text style={styles.errorMessage}>{errorTelefone}</Text>
          
         

        <CheckBox
            title='Eu aceito os termos de uso'
            checkedIcon='check'
            uncheckedIcon='square-o'
            checkedColor='green'
            uncheckedColor='red'
            checked={IsSelected}
            onPress={() =>setIsSelected(!IsSelected)}
        />


        
     

          <Button
                    icon={
                        <Icon
                              name='save'
                              type='font-awesome'  // Defina o tipo de ícone aqui
                              size={15}
                              color='white'
                              style={{ paddingRight: 10 }}
                          />
                          }     
                        title='Salvar'
                        onPress={() => salvar()}
                />
         
    </KeyboardAvoidingView>
  )
}
const  styles1 = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      container1:{
        flexDirection: 'row',
        alignItems: 'center',    
        borderBottomColor: '#999',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
      },
      icon: {
        marginRight: 10,
        
      },
      input: {
        flex: 1,
        fontSize: 16,
        
      }
})