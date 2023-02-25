import React, { useState } from "react";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Drawer, Switch } from "react-native-paper";
import {
  DrawerNavigationState,
  ParamListBase,
  DrawerActions,
  CommonActions,
} from "@react-navigation/native";
import {
  DrawerDescriptorMap,
  DrawerNavigationHelpers,
} from "@react-navigation/drawer/lib/typescript/src/types";
import { View, Text, StyleSheet } from "react-native";
import Config from 'react-native-config'

const SideMenu: React.FC<{
  state: DrawerNavigationState<ParamListBase>;
  navigation: DrawerNavigationHelpers;
  descriptors: DrawerDescriptorMap;
  status: "active" | "inactive" | "busy";
  setDriverStatus: React.Dispatch<React.SetStateAction<"active" | "inactive" | "busy">>;
}> = ({ state, navigation, descriptors, status, setDriverStatus }) => {
  
  const [isActive, setIsActive] = useState(status === "active" || status === "busy" ? true : false)
  const onToggleIsActive = async () => {
    let currentStatus
    switch (status) {
      case "active":
        setIsActive(false)
        currentStatus = 'inactive'
        setDriverStatus('inactive')
        break;
      case "busy":
        setIsActive(false)
        currentStatus = 'inactive'
        setDriverStatus('inactive')
      case "inactive":
        setIsActive(true)
        currentStatus = 'active'
        setDriverStatus('active')
      default:
        break;
    }

    const response = await fetch(
      `${process.env.API_DOMAIN}/api/drivers/active/63f77a636ca022ad59149790`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({status: currentStatus}),
      }
    );

    if (response.ok) {
      console.log("Status updated.");
    } else {
      console.log("Couldn't update the status.");
    }
  };

  return (
    <DrawerContentScrollView>
      <Drawer.Section>
        <View style={styles.isActiveButton}>
          <Text>Estatus activo?</Text>
          <Switch value={isActive} onValueChange={onToggleIsActive} />
        </View>
      </Drawer.Section>
      <Drawer.Section style={styles.drawerSection}>
        {state.routes.map((route, i) => {
          if (
            route.name !== "Entregas Asignadas" &&
            route.name !== "Entregas Disponibles" &&
            route.name !== "Ajustes"
          )
            return;
          return (
            <Drawer.Item
              key={route.key}
              label={route.name}
              active={i === state.index}
              onPress={() => {
                const event = navigation.emit({
                  type: "drawerItemPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!event.defaultPrevented) {
                  navigation.dispatch({
                    ...(i === state.index
                      ? DrawerActions.closeDrawer()
                      : CommonActions.navigate({
                          name: route.name,
                          merge: true,
                        })),
                    target: state.key,
                  });
                }
              }}
            />
          );
        })}
      </Drawer.Section>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  isActiveButton: {
    padding: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  drawerSection: {
    paddingTop: 10,
    paddingBottom: 10,
  },
});

export default SideMenu;
