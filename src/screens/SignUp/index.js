import React, {useContext, useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import { UserContext } from '../../contexts/UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert, Text } from 'react-native'
import {
    Container,
    InputArea,
    CustomButton,
    CustomButtonText,
    SignMessageButton,
    SignMessageButtonText, 
    SignMessageButtonTextBold
} from './styles'

import SignInput from '../../components/SignInput'
import Api from '../../Api'

import BarberLogo from '../../assets/barber.svg'
import EmailIcon from '../../assets/email.svg'
import PersonIcon from '../../assets/person.svg'
import  LockIcon from '../../assets/lock.svg'

export default () => {

    const {dispatch: UserDispatch} = useContext(UserContext) 

    const navigation = useNavigation()

    const [nameField, setNameField] = useState('')
    const [emailField, setEmailField] = useState('')
    const [passwordField, setPasswordField] = useState('')

    const handleSignClick = async () => {

        if(nameField != '' && emailField != '' && passwordField != ''){

            let res = await Api.SignUp(nameField, emailField, passwordField)
            
            if(res.token) {

                await AsyncStorage.setItem('token', res.token)

                UserDispatch({
                    type: 'setAvatar',
                    payload: {
                        avatar: res.data.avatar
                    }
                })

                navigation.reset({
                    routes: [{name: 'MainTab'}]
                })

            }else {
                Alert('Erro: '+res.error)
            }

        }else {
            Alert("Preencha os campos!")
        }

    }

    const handleMessageButtonClick = () => {

        navigation.reset({
            routes: [{name: 'SignIn'}]
        })

    }

    return(
        <Container>
            <BarberLogo width = "100%" height = "160"/>
        <InputArea>

        <SignInput
             IconSvg = {PersonIcon}
             placeholder = "Digite seu Nome"
             value={nameField}
             onChangeText={t=>setNameField(t)}
             />

            <SignInput
             IconSvg = {EmailIcon}
             placeholder = "Digite seu Email"
             value={emailField}
             onChangeText={t=>setEmailField(t)}
             />

            <SignInput
             IconSvg = {LockIcon}
             placeholder = "Digite sua Senha"
             value={passwordField}
             onChangeText={t=>setPasswordField(t)}
             password = {true}
            />

            <CustomButton onPress= {handleSignClick}>
                <CustomButtonText>CADASTRAR</CustomButtonText>
            </CustomButton>

        </InputArea>

        <SignMessageButton onPress = {handleMessageButtonClick}>
            <SignMessageButtonText>Já possui uma conta?</SignMessageButtonText>
            <SignMessageButtonTextBold>Faça Login!</SignMessageButtonTextBold>
        </SignMessageButton>

        </Container>
    )
}