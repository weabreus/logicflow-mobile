import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Badge, Button, Card, IconButton, Text } from "react-native-paper";
import SideMenu from "./SideMenu";
import { CommonActions, useNavigation } from "@react-navigation/native";

const DeliveriesItem = (props: any) => {
  const navigation = useNavigation();

  const openDeliveryDetailsDelivery = useCallback(() => {
    navigation.dispatch(
      CommonActions.navigate({
        name: "Detalles Entrega",
        merge: true,
        params: {
          task: props.taskId,
        },
      })
    );
  }, []);
  const openDeliveryDetailsPickup = useCallback(() => {
    navigation.dispatch(
      CommonActions.navigate({
        name: "Detalles Recogido",
        merge: true,
        params: {
          task: props.taskId,
        },
      })
    );
  }, []);

  return (
    <View>
      <Card style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{`Entrega #${props.taskId}`}</Text>
          <Badge
            style={{ backgroundColor: props.status ? "#4caf50" : "#ab003c" }}
          >
            {props.status ? "Completado" : "Pendiente"}
          </Badge>
        </View>

        <Card style={styles.task}>
          <Card.Title
            title="Recogido"
            subtitle={props.pickup_address}
            left={(props) => <Avatar.Icon {...props} icon="package-up" />}
            right={(props) => (
              <IconButton
                {...props}
                icon="chevron-right"
                onPress={openDeliveryDetailsPickup}
              />
            )}
          />
        </Card>
        <Card style={styles.task}>
          <Card.Title
            title="Entrega"
            subtitle={props.delivery_address}
            left={(props) => <Avatar.Icon {...props} icon="package-down" />}
            right={(props) => (
              <IconButton
                {...props}
                icon="chevron-right"
                onPress={openDeliveryDetailsDelivery}
              />
            )}
          />
        </Card>

        
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 5,
    padding: 20,
  },
  task: {
    paddingHorizontal: 5,
    paddingBottom: 5,
    marginTop: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  badge: {
    backgroundColor: "#4caf50",
  },
});
export default DeliveriesItem;
