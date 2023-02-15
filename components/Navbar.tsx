import { DrawerActions, useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {Appbar} from 'react-native-paper';

const Navbar = () => {
    const [sideMenuOpen, setSideMenuOpen] = useState(false)
    const navigation = useNavigation()

    const openSideMenu = useCallback(() => {

        if (!sideMenuOpen) {
            navigation.dispatch(DrawerActions.openDrawer())
            setSideMenuOpen(true)
        } else {
            navigation.dispatch(DrawerActions.closeDrawer())
            setSideMenuOpen(false)
        }
        
    }, [sideMenuOpen])

  const _handleSearch = () => console.log("Searching");

  const _handleMore = () => console.log("Shown more");
  return (
    <Appbar.Header>
      <Appbar.Action icon="menu" onPress={openSideMenu} />
      <Appbar.Content title="LogicFlow" />
      <Appbar.Action icon="calendar" onPress={_handleSearch} />
      <Appbar.Action icon="dots-vertical" onPress={_handleMore} />
    </Appbar.Header>
  );
};

export default Navbar;
