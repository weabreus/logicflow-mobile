import React from "react";
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

export default function App() {
  const Drawer = createDrawerNavigator();
  return (
    <PaperProvider>
      
      <NavigationContainer>
      <Navbar />
        <Drawer.Navigator 
          screenOptions={{headerShown: false, headerLeft: () => <MenuIcon />}}
          drawerContent={(props) => <SideMenu {...props}/>}>
            <Drawer.Screen name="Entregas" component={Deliveries}/>
            <Drawer.Screen name="Ajustes" component={Settings}/>
            <Drawer.Screen name="Detalles Entrega" component={DeliveryDetails}/>
            <Drawer.Screen name="Detalles Recogido" component={PickupDetails}/>
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
