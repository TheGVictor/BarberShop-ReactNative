import React, {useEffect, useContext} from 'react'
import {Container, LoadingIcon } from './styles'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UserContext } from '../../contexts/UserContext'
import { useNavigation } from '@react-navigation/native'

import Api from '../../Api'

import BarberLogo from '../../assets/barber.svg'

export default () => {

    const {dispatch: UserDispatch} = useContext(UserContext)
    const navigation = useNavigation()

    //TRECHO QUE IRÁ VALIDAR O TOKEN DE ACESSO
    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('token')
            if(token){
                
                let res = await Api.checkToken(token)

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
                    navigation.navigate('SignIn')
                }

            }

            //Verifica que não há cadastro e já direciona automaticamente à tela de login 
            if(token == null) {
                navigation.navigate('SignIn')
            }
        }
        checkToken()
    },[])

    return(
        <Container>
            <BarberLogo width = "100%" height = "160"/>
            <LoadingIcon size = "large" color = "#FFF"/>
        </Container>
    )
}