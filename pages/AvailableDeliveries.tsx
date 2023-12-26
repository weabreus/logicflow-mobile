import { View, Text, StyleSheet, FlatList } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import DeliveriesItem from "../components/DeliveriesItem";
import { Button } from "react-native-paper";
import Config from 'react-native-config';
import driverContext from "../context/context";
import { NavigationProp } from "@react-navigation/native";
import { API_DOMAIN } from "@env";

const getDeliveries = async () => {
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

  if (response?.ok) {
    const data = await response.json()
    // @ts-ignore
    return data.data.filter((delivery) => delivery.assigned_status === false)
  }

};

const AvailableDeliveries: React.FC<{navigation: NavigationProp<ReactNavigation.RootParamList>}> = ({navigation}) => {
    const { driver } = useContext(driverContext)
    const [deliveries, setDeliveries] = useState([])

    useEffect(() => {
    
      const focusHandler = navigation.addListener('focus', async () => {
  
        const deliveriesList = await getDeliveries()
        setDeliveries(deliveriesList)
      })
      return focusHandler
  
    }, [navigation])

    const assignDriver = async (taskId: string, driverId: string) => {
      let response;
      try {
        response = await fetch(
          `${API_DOMAIN}/api/deliveries/assign/`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              taskId: taskId,
              driverId: driverId
            })
          }
        );
      } catch (error) {
        console.log({
          status: 500,
          error: error,
        });
      }
    
      if (response?.ok) {
        const data = await response.json()
        console.log(data)
        // @ts-ignore
        console.log(data.message)
        const deliveries = await getDeliveries()
        setDeliveries(deliveries)
      }
    }

  return (
    <>
      <View style={styles.container}>
        {deliveries?.length < 1 && (<Text>No hay entregas disponibles</Text>)}
        {deliveries?.length > 0 &&
        /* @ts-ignore */
        (<FlatList data={deliveries} renderItem={({ item }) => ( <><DeliveriesItem
              taskId={item._id}
              status={item.task_status}
              pickup_address={item.pickup.address}
              delivery_address={item.delivery.address}
            />
            <Button icon={'check'} mode="contained" compact={true} style={{marginTop: 10}} onPress={() => {
              assignDriver(item._id, driver)
              }}>Aceptar entrega</Button>
            </>
          )}
          keyExtractor={(task: any) => task._id}
        />)}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    paddingTop: 10,
    paddingHorizontal: 20,
  },
});

export default AvailableDeliveries;
