import * as SecureStore from 'expo-secure-store';

const storeCredentials = async (phone, password, accessToken, refreshToken) => {
  try {
    await SecureStore.setItemAsync('phone', phone);
    await SecureStore.setItemAsync('password', password);
    await SecureStore.setItemAsync('acessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
  } catch (error) {
    console.error('Error storing credentials', error);
  }
};

export default storeCredentials;