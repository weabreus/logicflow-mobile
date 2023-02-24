import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Navbar from "./components/Navbar";
import SideMenu from "./components/SideMenu";
import MenuIcon from "./components/MenuIcon";
import Deliveries from "./components/Deliveries";
import Settings from "./components/Settings";
import DeliveryDetails from "./components/DeliveryDetails";
import PickupDetails from "./components/PickupDetails";
import * as Location from "expo-location";

export default function App() {
  useEffect(() => {
    const updateCoords = async () => {
      let { status } = await Location.getForegroundPermissionsAsync();
      console.log(status)
      if ( status === 'undetermined' ) {
        let response = await Location.requestForegroundPermissionsAsync();

        if (response.granted) {
          // @ts-ignore
          status = 'granted'
        }
      }

      if (status === 'granted') {
        let location = await Location.getCurrentPositionAsync({ });
        sendLocation(location.coords.latitude, location.coords.longitude)
        
      }
    };
    updateCoords()
    setInterval(updateCoords, 60000)
  }, []);

  const sendLocation = async (latitude: number, longitude: number) => {
    const response = await fetch(
      "http://192.168.5.102:3000/api/drivers/position/63f77a636ca022ad59149790",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: latitude, lng: longitude }),
      }
    );

    if (response.ok) {
      console.log("Coords updated.");
    } else {
      console.log("Couldn't update the coordinates.");
    }
  };

  const Drawer = createDrawerNavigator();
  return (
    <PaperProvider>
      <NavigationContainer>
        <Navbar />
        <Drawer.Navigator
          screenOptions={{ headerShown: false, headerLeft: () => <MenuIcon /> }}
          drawerContent={(props) => <SideMenu {...props} />}
        >
          <Drawer.Screen name="Entregas" component={Deliveries} />
          <Drawer.Screen name="Ajustes" component={Settings} />
          <Drawer.Screen name="Detalles Entrega" component={DeliveryDetails} />
          <Drawer.Screen name="Detalles Recogido" component={PickupDetails} />
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
