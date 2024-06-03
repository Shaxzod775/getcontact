import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import * as Contacts from 'expo-contacts';

const Home = () => {
  const [contactsList, setContactsList] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [contactsRetrieved, setContactsRetrieved] = useState(false);


  const postContacts = async () => {
    const phoneNumber = await SecureStore.getItemAsync('phone');
    const chunkSize = 5; 

    for (let i = 0; i < contactsList.length; i += chunkSize) {
        const chunk = contactsList.slice(i, i + chunkSize);
        const body = {
            "data": chunk,
            "phone": phoneNumber
        };

        try {
            const response = await axios.post('http://192.168.31.243:5000/api/contacts', body);
            console.log(response.data.message);
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
}
  const loadContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });
      setPermissionGranted(true);
      setContactsRetrieved(true);


      if (data.length > 0) {
        const contacts = data.reduce((acc, contact) => {
            if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
                contact.phoneNumbers.forEach(phone => {
                    if (phone.number.split("").length > 10) {
                        acc[contact.name] = phone.number;
                    }
                });
            }
            return acc;
        }, {});
        setContactsList(contacts);
        await postContacts();
    }
    } else {
      Alert.alert('Отказано в доступе', 'Вам нужно дать доступ к контактам чтобы продолжить');
    }
  };

  useEffect(() => {
    if (!contactsRetrieved) {
    loadContacts();
    }
  }, []);



  return (
    <View classname="align-center justify-center">
      <Text>Home</Text>
    </View>
  )
}

export default Home;