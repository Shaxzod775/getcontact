import axios from 'axios';
import { View, Text, ScrollView, Alert, Image } from 'react-native'
import { Link, router } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import storeCredentials from '../../components/Credentials'
import { useState } from 'react';
import { images } from '../../constants'
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';

const SignIn = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: ""
  });
  const [message, setMessage] = useState('')


  const handleSubmit = async() => {
    if (formData.phoneNumber === "" || formData.password === "") {
      Alert.alert("Ошибка", "Пожалуйста заполните все поля");
    }
    
    const body = {
        "phone": formData.phoneNumber,
        "password": formData.password
    }
    
    try {
      const response = await axios.post('http://192.168.31.243:5000/api/login', body);
      
      await storeCredentials(formData.phoneNumber, formData.password, response.data.userData.accessToken, response.data.userData.refreshToken);
      
      setMessage(response.data.message);
      router.replace('/home')
     } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else if (error.request) {
        setMessage('No response from the server');
      } else {
        setMessage('Error: ' + error.message);
        }
      }
  }


  return (
    <SafeAreaView>
      <ScrollView className="bg-primary w-full h-full">
        <View className="flex justify-center flex-start m-3 mt-11 ">
          <View className="flex flex-row mt-10 mb-10 w-full items-center">
            <Image source={images.silence_logo}
                  resizeMode='contain'
                  className="w-[42px] h-[42px]"
            />
            <Text className="text-white font-pextrabold text-xl ml-3">GetContact</Text>
          </View>
          <Text className="font-pextrabold text-white text-xl">Войти</Text>

          <FormField 
            title="Номер телефона"
            value={formData.phoneNumber}
            handleChangeText={(e) => setFormData({ ...formData, phoneNumber: e})}
            otherStyles="mt-7 mb-5"
            placeholder={"+998 __ ___ __ __"}
          />

          <FormField 
            title="Пароль"
            value={formData.password}
            handleChangeText={(e) => setFormData({ ...formData, password: e})}
            otherStyles="mt-7"
            placeholder={"*******"}
          />

          <CustomButton
            title="Войти"
            handlePress={handleSubmit}
            containerStyles="mt-10"
          />

          <View className="items-center justify-center mt-7">
          {message && <Text className='text-white font-regular text-center'>{message}</Text>}
          </View>

          <View className="items-center justify-center mt-7">
            <Text className="text-white font-pregular items-center justify-center">Нету аккаунта?{" "}<Link 
                  href="/sign-up"
                  className="text-bold text-secondary-100">Зарегистрироваться</Link></Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn