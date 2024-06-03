import React, { useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';



const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
  return (
    <TouchableOpacity className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
                      onPress={handlePress}
                      activeOpacity={0.7}
                      disabled={isLoading}>
      <Text className={`bg-secondary font-psemibold text-lg mt-10 ${textStyles} p-2 rounded-xl text-center py-3`}>{title}</Text> 
    </TouchableOpacity>
  )
}

export default CustomButton;