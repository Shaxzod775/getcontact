import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';



const FormField = ({
    title,
    value,
    placeholder,
    handleChangeText,
    otherStyles,
    ...props
}) => {
  const [password, setPassword] = useState(''); 
  const [showPassword, setShowPassword] = useState(false); 

  const toggleShowPassword = () => { 
    setShowPassword(!showPassword); 
  }; 

  return (
    <View className={otherStyles}>
      <Text className="text-base text-gray-100 font-pmedium mb-5">{title}</Text>

      <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary flex flex-row items-center">
        <TextInput 
            className="flex-1 text-white font-psemibold text-base" 
            value={value}
            onChangeText={handleChangeText}
            placeholder={placeholder} 
            placeholderTextColor="#7B7B8B"
            secureTextEntry={title === "Пароль" ? !showPassword : false}
            {...props}
        />
        {title === "Пароль" && 
        <TouchableOpacity onPress={toggleShowPassword}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="grey" />
        </TouchableOpacity>}
      </View>


    </View>
  )
}


export default FormField

