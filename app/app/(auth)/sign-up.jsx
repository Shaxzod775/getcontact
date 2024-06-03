import { View, Text, ScrollView, Alert, Image } from 'react-native'
import { Link, router } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from 'react';
import { images } from '../../constants'
import storeCredentials from '../../components/Credentials';
import axios from 'axios';
import CustomButton from '../../components/CustomButton';
import FormField from '../../components/FormField';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    phoneNumber: "",
    password: ""
  });
  const [message, setMessage] = useState('')

  const handleSubmit = async() => {
    if (formData.phoneNumber === "" || formData.password === "") {
      Alert.alert("Ошибка", "Пожалуйста заполните все поля");
    }
    
    const body = {
        "fullname": formData.fullname,
        "phone": formData.phoneNumber,
        "password": formData.password
    }
    
    try {
      const response = await axios.post('http://192.168.31.243:5000/api/registration', body);
      
      await storeCredentials(formData.phoneNumber, formData.password, response.data.userData.accessToken, response.data.userData.refreshToken)

      router.replace('/home')
      setMessage(response.data.message);
     } catch (error) {
      if (error.response.data.message) {
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
          <Text className="font-pextrabold text-white text-xl">Регистрация</Text>

          <FormField 
            title="ФИО"
            value={formData.fullname}
            handleChangeText={(e) => setFormData({ ...formData, fullname: e})}
            otherStyles="mt-7 mb-5"
          />

          <FormField 
            title="Номер телефона"
            value={formData.phoneNumber}
            handleChangeText={(e) => setFormData({ ...formData, phoneNumber: e})}
            otherStyles="mt-7 mb-5"
          />

          <FormField 
            title="Пароль"
            value={formData.password}
            handleChangeText={(e) => setFormData({ ...formData, password: e})}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Зарегистрироваться"
            handlePress={handleSubmit}
            containerStyles="mt-10"
          />
          <View className="items-center justify-center mt-7">
          {message && <Text className='text-white font-regular text-center'>{message}</Text>}
          </View>

          <View className="items-center justify-center mt-7">
            <Text className="text-white font-pregular items-center justify-center">Уже зарегистрированы?{" "}<Link 
                  href="/sign-in"
                  className="text-bold text-secondary-100">Войти</Link></Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp;