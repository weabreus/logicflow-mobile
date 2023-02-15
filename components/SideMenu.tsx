import React, { useState } from "react";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Drawer } from "react-native-paper";
import {
  DrawerNavigationState,
  ParamListBase,
  useLinkBuilder,
  DrawerActions,
  CommonActions,
} from "@react-navigation/native";
import {
  DrawerDescriptorMap,
  DrawerNavigationHelpers,
} from "@react-navigation/drawer/lib/typescript/src/types";

const SideMenu: React.FC<{
  state: DrawerNavigationState<ParamListBase>;
  navigation: DrawerNavigationHelpers;
  descriptors: DrawerDescriptorMap;
}> = ({ state, navigation, descriptors }) => {
  

  return (
    <DrawerContentScrollView>
      <Drawer.Section>
        {state.routes.map((route, i) => {
          if (route.name !== "Entregas" && route.name !== "Ajustes") return;
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

      {/* <DrawerItemList {...props} /> */}
    </DrawerContentScrollView>
  );
};

export default SideMenu;
