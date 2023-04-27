import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, ImageBackground, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Keyboard , Alert  } from "react-native";
import { images, fontSizes, colors } from "../constants"
import { CLButton } from '../components';
import Icon from 'react-native-vector-icons/FontAwesome5'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {isValidEmail,isValidPassword} from '../utilies'
import i18n from '../../i18n';

import * as Keychain from 'react-native-keychain';

import {
    auth,
    onAuthStateChanged,
} from "../../firebase/firebase"
import AsyncStorage from '@react-native-async-storage/async-storage'


const { logo } = images;
const { primary, placeholder, facebook, google, inactive } = colors;

async function getToken() {
    try {
      const result = await Keychain.getInternetCredentials('token');
      if (result) {
        return result.password;
      } else {
        console.log('No token found in Keychain');
      }
    } catch (error) {
      console.log('Could not get token:', error);
    }
  }

const Login = (props) => {

    const {navigation,route} = props
    const {navigate,goBack} = navigation

    const MIN_PASSWORD_LENGTH = 5;
    const EMAIL_ERROR_MESSAGE = 'Email not in correct format!';
    const PASSWORD_ERROR_MESSAGE = `Password must be at least ${MIN_PASSWORD_LENGTH} characters!`;

    const [errorEmail,setErrorEmail] = useState('')
    const [errorPassword,setErrorPassword] = useState('')
    const [formData, setFormData] = useState({
        email : '',
        password : '',
    })

    const {email,password} = formData

    const isValidationOK = () => true

    const [keyboardIsShow, setKeyboardIsShow] = useState(false)
    useEffect(() => {

        onAuthStateChanged(auth, (responseUser) => {
            debugger
            if(responseUser) {                                             
                AsyncStorage.setItem("token", JSON.stringify(responseUser.accessToken))  
                navigate('UItab')  
            } 
        })

        //componentDidMount
        const ShowKeyboard = ()=> setKeyboardIsShow(true);
        const HideKeyboard = ()=> setKeyboardIsShow(false);

        Keyboard.addListener('keyboardDidShow', ShowKeyboard)
        Keyboard.addListener('keyboardDidHide', HideKeyboard)
        return () =>{
            Keyboard.removeAllListeners('keyboardDidShow')
            Keyboard.removeAllListeners('keyboardDidHide')
        }
    },[])

    const handleEmailChange = useCallback((text)=>{
        setErrorEmail(isValidEmail(text)? '' : EMAIL_ERROR_MESSAGE)
        setFormData({
            ...formData,
            email: text
        })
    },[])
    const handlePasswordChange = useCallback((text)=>{
        setErrorPassword(isValidPassword(text)? '' : PASSWORD_ERROR_MESSAGE)
        setFormData({
            ...formData,
            password: text
        })
    },[])

    return <KeyboardAvoidingView 
        style={{
            paddingTop:60,
            backgroundColor: 'white',
            flex: 1,
        }}>
        <View style={{
            flex: 30,
            //backgroundColor:'red',
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <View style={{
                //backgroundColor:'blue',
                flex: 1,
                alignItems: 'center'
            }}>
                <Text style={{
                    color: 'black',
                    fontSize: fontSizes.m4,
                    fontWeight: 'bold',
                }}>{i18n.t('l_tile')}</Text>
            </View>
            <View style={{
                //backgroundColor:'green',
                flex: 1,
                alignItems: 'center',
            }}>
                <Image source={logo}
                    style={{
                        width: 210,
                        height: 210,
                        resizeMode: 'contain',
                        backgroundColor: primary,
                        borderTopLeftRadius: 60,
                        borderTopRightRadius: 130,
                        borderBottomLeftRadius: 112,
                        borderBottomRightRadius: 70,
                        marginEnd:15
                    }} />
            </View>
        </View>
        <View style={{
            flex: 15,
            backgroundColor: 'white',
            marginHorizontal: 15
        }}>
            <Text style={{
                fontSize: fontSizes.h3,
                color: primary,
            }}>{i18n.t('r_email')}</Text>
            <TextInput
                onChangeText={handleEmailChange}
                autoCorrect={false}
                placeholder={i18n.t('r_placehold_email')}
                placeholderTextColor={placeholder}
                style={{
                    color: 'black'
                }}
            />
            <View style={{ height: 1, backgroundColor: primary }} />
            <Text style={{
                color:'red',
                fontSize: fontSizes.h5
            }}>{errorEmail}</Text>
        </View>
        <View style={{
            flex: 15,
            backgroundColor: 'white',
            marginHorizontal: 15
        }}>
            <Text style={{
                fontSize: fontSizes.h3,
                color: primary,
            }}>{i18n.t('r_password')}</Text>
            <TextInput
                onChangeText={handlePasswordChange}
                autoCorrect={false}
                placeholder={i18n.t('r_placehold_password')}
                placeholderTextColor={placeholder}
                secureTextEntry={true}
                style={{
                    color: 'black'
                }}
            />
            <View style={{ height: 1, backgroundColor: primary }} />
            <Text style={{
                color:'red'
            }}>{errorPassword}</Text>
        </View>
        {keyboardIsShow == false && <View style={{
            flex: 20,
            //backgroundColor: 'green',
        }}>
            <View style={{
                flex: 1
            }} />
            <CLButton title={i18n.t('login').toUpperCase()}
                disabled= {!isValidationOK()}
                onPress={() => {
                    //navigate('UItab')
                    Alert.alert("Token", `abc` , [{text: 'Ok'}])
                }}
                colorBG={isValidationOK()? primary : inactive}
                colorBD={'white'}
                colorT={'white'}
                sizeF={fontSizes.h4}
                sizeB={1}
                sizeBT={"60%"}
                radius={17}
            />
            <TouchableOpacity
                onPress={()=>{
                    navigate('Register')
                }}
                style={{
                    padding: 5
                }}>
                <Text style={{
                    color: primary,
                    alignSelf: 'center',
                    fontSize: fontSizes.h4,
                }}>{i18n.t('l_desUnder')}</Text>
            </TouchableOpacity>
            <View style={{
                flex: 1
            }} />
        </View>}
        {keyboardIsShow == false && <View style={{
            flex: 20,
            //backgroundColor: 'purple',
        }}>
            <View style={{
                flexDirection: 'row',
                height: 30,
                alignItems: 'center',
                marginHorizontal: 20,
                //backgroundColor:'green'
            }}>
                <View style={{ height: 1, backgroundColor: 'black', flex: 1 }} />
                <Text style={{
                    color: 'black',
                    alignSelf: 'center',
                    fontSize: fontSizes.h4,
                    marginHorizontal: 10
                }}>{i18n.t('r_method')}</Text>
                <View style={{ height: 1, backgroundColor: 'black', flex: 1 }} />
            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
            }}>
                <Icon name='facebook' size={45} color={facebook} />
                <View style={{ width: 15 }} />
                <Icon name='google' size={45} color={google} />
            </View>
        </View>}
        {keyboardIsShow == true && <View style={{ flex: 1 }} />}
    </KeyboardAvoidingView>
}
export default Login