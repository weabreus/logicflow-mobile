import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Navbar from "./components/Navbar";
import SideMenu from "./components/SideMenu";
import MenuIcon from "./components/MenuIcon";
import Deliveries from "./pages/Deliveries";
import Settings from "./pages/Settings";
import DeliveryDetails from "./components/DeliveryDetails";
import PickupDetails from "./components/PickupDetails";
import * as Location from "expo-location";
import AvailableDeliveries from "./pages/AvailableDeliveries";
import driverContext from "./context/context";

export default function App() {
  
  // State for managing if the driver is active
  const [driverStatus, setDriverStatus] = useState<"active" | "busy" | "inactive">("inactive");
  const [driver, setDriver] = useState("63f77a636ca022ad59149790");
  const [activeTask, setActiveTask] = useState<{id: string, type: string} | undefined>(undefined)

  useEffect(() => {
    const updateCoords = async () => {
      // Only get coords if the driver is active
      if (driverStatus === "active" || driverStatus === "busy") {
        let { status } = await Location.getForegroundPermissionsAsync();
        
        if (status === "undetermined") {
          let response = await Location.requestForegroundPermissionsAsync();

          if (response.granted) {
            // @ts-ignore
            status = "granted";
          }
        }

        if (status === "granted") {
          let location = await Location.getCurrentPositionAsync({});
          sendLocation(location.coords.latitude, location.coords.longitude);
        }
      }
    };
    updateCoords();
    setInterval(updateCoords, 60000);
  }, []);

  const sendLocation = async (latitude: number, longitude: number) => {
    const response = await fetch(
      `${process.env.API_DOMAIN}/api/drivers/position/${driver}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          lat: latitude, 
          lng: longitude,
          driverStatus: driverStatus,
          currentTask: activeTask,
          timestamp: Date.now()
         }),
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
      <driverContext.Provider value={{ driver: driver, setDriver: setDriver, driverStatus: driverStatus, setDriverStatus: setDriverStatus, activeTask: activeTask, setActiveTask: setActiveTask }}>
        <NavigationContainer>
          <Navbar />
          <Drawer.Navigator
            screenOptions={{
              headerShown: false,
              headerLeft: () => <MenuIcon />,
            }}
            drawerContent={(props) => (
              <SideMenu
                {...props}
                status={driverStatus}
                setDriverStatus={setDriverStatus}
              />
            )}
          >
            <Drawer.Screen name="Entregas Asignadas" component={Deliveries} />
            {/* @ts-ignore */}
            <Drawer.Screen
              name="Entregas Disponibles"
              component={AvailableDeliveries}
            />
            <Drawer.Screen name="Ajustes" component={Settings} />
            {/* @ts-ignore */}
            <Drawer.Screen
              name="Detalles Entrega"
              component={DeliveryDetails}
            />
            <Drawer.Screen name="Detalles Recogido" component={PickupDetails} />
          </Drawer.Navigator>
        </NavigationContainer>
      </driverContext.Provider>
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
