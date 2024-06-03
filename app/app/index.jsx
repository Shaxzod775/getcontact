import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from '../constants'
import "../global.css"
import CustomButton from '../components/CustomButton';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';


const Welcome = () => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: ""
  });
  const [credentialsLoaded, setCredentialsLoaded] = useState(false);

  const LoginAttempt = async() => {
    const body = {
        "phone": formData.phoneNumber,
        "password": formData.password
    }
    
    try {
      const response = await axios.post('http://192.168.31.243:5000/api/login', body);

      router.replace('/home')
     } catch (error) {
      if (error.response) {
        console.log(error.response.data.message);
      } else if (error.request) {
        console.log('No response from the server');
      } else {
        console.log('Error: ' + error.message);
        }
      }
  }

  const getCredentials = async() => {
    try {
      const phoneNumber = await SecureStore.getItemAsync('phone');
      const password = await SecureStore.getItemAsync('password');

      if (phoneNumber && password) {
        setFormData({ phoneNumber, password });
      }
      setCredentialsLoaded(true);
    } catch (error) {
      console.error('Error getting credentials', error);  
    }
  }


  useEffect(() => {
    getCredentials();
  }, []);
  

  useEffect(() => {
    if (credentialsLoaded && formData.phoneNumber && formData.password) {
      LoginAttempt();
    } else if (credentialsLoaded) {
      console.log('Credentials not found or incomplete');
    }
  }, [credentialsLoaded, formData]);


  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }} className="bg-primary h-full">
        <View className="w-full h-96 justify-center items-center pt-10">
          <Image source={images.silence} 
                 className="w-[150px] h-[150px]"
                 resizeMode="contain"
          />
        </View>
        <View className="w-full justify-center items-center h-32">
          
          <Text className="text-white font-bold text-3xl text-center">
            Узнай о них всё{"\n"}
            вместе с {""}
          <Text className="text-yellow-500 font-bold text-3xl">GetContact</Text>
          </Text>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
              Все данные людей у кончиков ваших пальцев
          </Text>

          <CustomButton
            title="Войти"
            handlePress={() => router.push("/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor='#161622' style='light'/>
    </SafeAreaView>
  );
}

export default Welcome;

