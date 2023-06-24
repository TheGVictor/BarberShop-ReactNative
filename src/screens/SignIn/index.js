import React, {useState, useContext} from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserContext } from '../../contexts/UserContext'
import { Text } from 'react-native'
import {
    Container,
    InputArea,
    CustomButton,
    CustomButtonText,
    SignMessageButton,
    SignMessageButtonText, 
    SignMessageButtonTextBold
} from './styles'

import Api from '../../Api'

import SignInput from '../../components/SignInput'

import BarberLogo from '../../assets/barber.svg'
import EmailIcon from '../../assets/email.svg'
import  LockIcon from '../../assets/lock.svg'

export default () => {

    const {dispatch: UserDispatch} = useContext(UserContext)

    const navigation = useNavigation()

    const [emailField, setEmailField] = useState('')
    const [passwordField, setPasswordField] = useState('')

    const handleSignClick = async () => {

        if(emailField != '' && passwordField != '') {

            let json = await Api.SignIn(emailField, passwordField)
            

            if(json.token) {

                await AsyncStorage.setItem('token', json.token)

                UserDispatch({
                    type: 'setAvatar',
                    payload: {
                        avatar: json.data.avatar
                    }
                })

                navigation.reset({
                    routes: [{name: 'MainTab'}]
                })


            }else {
                alert('Email/Senha Inválidos!')
            }

        }else {
            alert('Preencha os campos!')
        }

    }

    const handleMessageButtonClick = () => {

        navigation.reset({
            routes: [{name: 'SignUp'}]
        })

    }

    return(
        <Container>
            <BarberLogo width = "100%" height = "160"/>
        <InputArea>

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
                <CustomButtonText>LOGIN</CustomButtonText>
            </CustomButton>

        </InputArea>

        <SignMessageButton onPress = {handleMessageButtonClick}>
            <SignMessageButtonText>Ainda não possui uma conta?</SignMessageButtonText>
            <SignMessageButtonTextBold>Cadastre-se!</SignMessageButtonTextBold>
        </SignMessageButton>

        </Container>
    )
}