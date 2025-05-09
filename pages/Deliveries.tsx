import React, { useCallback, useContext, useEffect, useState } from 'react'
import {ScrollView, FlatList, View, StyleSheet} from 'react-native'
import { Text, } from 'react-native-paper'
import DeliveriesItem from '../components/DeliveriesItem'
import driverContext from '../context/context';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { API_DOMAIN } from '@env';

const getDeliveries = async (driverId: string) => {
  let response;

  try {
   
    response = await fetch(
      `${API_DOMAIN}/api/deliveries/deliveries/`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    
  } catch (error) {
    console.log({
      status: 500,
      error: error,
    });
  }

  // @ts-ignore
  if (response?.ok) {
    const data = await response.json()
    console.log(data)
    // @ts-ignore
    return data.data.filter((delivery) => delivery.driverId === driverId)
  }

};

const Deliveries = () => {
  
  const { driver } = useContext(driverContext)
  const [deliveries, setDeliveries] = useState([])

  useFocusEffect(
    useCallback(() => {
    console.log('Requested deliveries')
    
    const fetchDeliveries = async () => {
      const deliveriesList = await getDeliveries(driver)
      setDeliveries(deliveriesList)
    }

    fetchDeliveries()

  }, [driver]))

  return (
    <>
    <View style={styles.container}>
        {/* @ts-ignore */}
        <FlatList data={deliveries} renderItem={({item}) => <DeliveriesItem taskId={item._id} status={item.status} pickup_address={item.pickup.address} delivery_address={item.delivery.address} />} keyExtractor={task => task._id}/>
    </View>
    </>
  )
}

const styles = StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
      paddingTop: 10,
      paddingHorizontal: 20
    },
  });

export default Deliveries