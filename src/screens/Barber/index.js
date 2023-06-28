import React, {useState, useEffect} from "react";
import { Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Swiper from "react-native-swiper";

import Stars from "../../components/Stars";

import FavoriteFullIcon from '../../assets/favorite_full.svg'
import FavoriteIcon from '../../assets/favorite.svg'
import BackIcon from '../../assets/back.svg'
import NavPrevIcon from '../../assets/nav_prev.svg'
import NavNextIcon from '../../assets/nav_next.svg'

import {
    Container,
    Scroller,

    SwipeDot,
    SwipeDotActive,
    SwipeItem,
    SwipeImage,
    FakeSwiper,

    PageBody,
    UserInfoArea,
    ServiceArea,

    UserAvatar,
    UserInfo,
    UserInfoName,

    UserFavButton,

    BackButton,
    LoadingIcon,

    ServiceItem,
    ServicesTitle,
    ServiceInfo,
    ServiceName,
    ServicePrice,
    ServiceChooseButton,
    ServiceChooseBtnText,

    TestimonialArea,
    TestimonialInfo,
    TestimonialItem,
    TestimonialName,
    TestimonialBody

} from './styles'

import Api from "../../Api";


export default () => {
    const navigation = useNavigation()
    const route = useRoute()

            const [userInfo, setUserInfo] = useState({
                id: route.params.id,
                avatar: route.params.avatar,
                name: route.params.name,
                stars: route.params.name
            })

            const [loading, setLoading] = useState(false)
            const [favorited, setFavorited] = useState(false)
        
            useEffect(() => {
                const getBarberInfo = async () => {
                    setLoading(true)
                    let json = await Api.getBarber(userInfo.id)
                    if(json.error == '') {
                        setUserInfo(json.data)
                        setFavorited(json.data.favorited)
                    } else {
                        alert('Erro: '+json.error)
                    }
                   setLoading(false)
                }
                getBarberInfo()
            }, [])

            const handleBackButton = () => {
                navigation.goBack()
            }

            const handleFavClick = () => {
                setFavorited(!favorited)
                Api.setFavorite(userInfo.id)
            }

    return(
        <Container>
            <Scroller>
                {userInfo.photos && userInfo.photos.length > 0 ?
            <Swiper
                    style = {{height: 240}}
                    dot = {<SwipeDot />}
                    activeDot = {<SwipeDotActive />}
                    paginationStyle = {{top: 15, right: 15, bottom: null, left: null}}
                    autoplay  = {true}                    
            >
                {userInfo.photos.map((item, key) => (
                    <SwipeItem key = {key}>
                        <SwipeImage source = {{uri: item.url}} resizeMode = "cover"/>
                    </SwipeItem>
                ))} 
            </Swiper>    
            :
            <FakeSwiper>

            </FakeSwiper>

                }
                <PageBody>
                    <UserInfoArea>
                        <UserAvatar source = {{uri: userInfo.avatar}}/>
                        <UserInfo>
                            <UserInfoName>{userInfo.name}</UserInfoName>
                            <Stars stars = {userInfo.stars} showNumber = {true}/>
                        </UserInfo>
                        <UserFavButton onPress = {handleFavClick}>

                            {favorited ?

                                <FavoriteFullIcon width = "24" height = "24px" fill = "#FF0000" />
                            :                    
                            <FavoriteIcon width = "24" height = "24px" fill = "#FF0000" />

                            }
                        </UserFavButton>
                    </UserInfoArea>

                    {loading &&
                    <LoadingIcon size = "large" color = "#000"/>
                    }

                    {userInfo.services &&

                    <ServiceArea>
                        <ServicesTitle>Lista de serviços</ServicesTitle>

                        {userInfo.services.map((item, key) => (
                            <ServiceItem key = {key}>
                                <ServiceInfo>
                                    <ServiceName>
                                        {item.name}
                                    </ServiceName>
                                    <ServicePrice>R${item.price}</ServicePrice>
                                </ServiceInfo>
                                <ServiceChooseButton>
                                    <ServiceChooseBtnText>Agendar</ServiceChooseBtnText>
                                </ServiceChooseButton>
                            </ServiceItem>
                        ))}
                    </ServiceArea>
                    }

                    {userInfo.testimonials && userInfo.testimonials.length > 0 &&
                        <TestimonialArea>
                            <Swiper
                                style = {{height: 110}}
                                showsPagination = {false}
                                showsButtons = {true}
                                prevButton = {<NavPrevIcon width = "35" height = "35" fill = "#000"/>}
                                nextButton = {<NavNextIcon width = "35" height = "35" fill = "#000"/>} 
                            >
                                {userInfo.testimonials.map((item, key) => (
                                    <TestimonialItem key = {key}>
                                        <TestimonialInfo>
                                            <TestimonialName>
                                                {item.name}
                                            </TestimonialName>
                                        <Stars stars = {item.rate} showNumber={false} />
                                        </TestimonialInfo>
                                        <TestimonialBody>{item.body}</TestimonialBody>
                                    </TestimonialItem>
                                ))}

                            </Swiper>
                        </TestimonialArea>
                    }
                </PageBody>
            
            
            </Scroller>
            <BackButton onPress = {handleBackButton}>
                <BackIcon width = "24" height = "44" fill = "#FFF"/>
            </BackButton>
        </Container>
    )
}