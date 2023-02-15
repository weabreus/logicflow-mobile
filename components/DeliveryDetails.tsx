import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  IconButton,
  Text,
} from "react-native-paper";
import tasks from "../data/tasks";
import { getStateFromPath } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import CardTitle from "react-native-paper/lib/typescript/components/Card/CardTitle";

const DeliveryDetails = (...props: any) => {
  const task = tasks.filter((task) => task.id === props[0].route.params.task);
  const navigation = props[0].navigation;

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title
            title={`Entrega #${task[0].id} - Entrega`}
            titleStyle={{ alignItems: "center", fontWeight: "bold" }}
            left={(props) => (
              <Button onPress={() => navigation.goBack()}>
                <Avatar.Icon
                  color={"#000000"}
                  size={40}
                  icon="chevron-left"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
                />
              </Button>
            )}
            right={(props) => (
              <IconButton
                icon="package-down"
                onPress={() => {}}
                size={40}
                iconColor={"#512da8"}
              />
            )}
            leftStyle={{ marginLeft: -10, alignItems: "center" }}
          />

          <Divider style={styles.divider} />
          {/* Time line */}
          <View style={styles.deliveryDetailLine}>
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <Avatar.Icon icon="clock-time-eight-outline" size={40} />
              <Text style={styles.deliveryDetailLineText}>
                {task[0]?.delivery_date} - {task[0].delivery_time}
              </Text>
            </View>
            <View>
              <Badge
                style={{
                  backgroundColor: props.delivery_status
                    ? "#4caf50"
                    : "#ab003c",
                }}
              >
                {props.delivery_status ? "Completado" : "Pendiente"}
              </Badge>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Customer Contact */}
          <View
            style={{
              ...styles.deliveryDetailLine,
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View style={{ ...styles.deliveryDetailLine }}>
              <Avatar.Icon icon="account" size={40} />
              <Text style={styles.deliveryDetailLineText}>
                {task[0]?.delivery_name}
              </Text>
            </View>
            <View
              style={{
                ...styles.deliveryDetailLine,
                justifyContent: "flex-end",
              }}
            >
              <Avatar.Icon
                icon={"message-outline"}
                size={40}
                style={{ margin: 2 }}
              />
              <Avatar.Icon icon={"phone"} size={40} style={{ margin: 2 }} />
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Directions */}
          <View
            style={{
              ...styles.deliveryDetailLine,
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View style={{ ...styles.deliveryDetailLine }}>
              <Avatar.Icon icon="map-marker" size={40} />
              <Text style={styles.deliveryDetailLineText}>
                {task[0]?.delivery_address}
              </Text>
            </View>
            <View
              style={{
                ...styles.deliveryDetailLine,
                justifyContent: "flex-end",
              }}
            >
              <Avatar.Icon
                icon={"arrow-right-top-bold"}
                size={40}
                style={{ margin: 2 }}
              />
            </View>
          </View>

          <Divider style={styles.divider} />
          {/* Description */}
          <View
            style={{
              ...styles.deliveryDetailLine,
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View style={{ ...styles.deliveryDetailLine }}>
              <Avatar.Icon icon="information-outline" size={40} />
              <Text style={styles.deliveryDetailLineText}>
                {task[0]?.delivery_address}
              </Text>
            </View>
          </View>

          <Divider style={styles.divider} />
          <Card.Actions style={styles.actions}>
            <Button>Confirmar Entrega</Button>
          </Card.Actions>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 5,
    paddingTop: 5,
    paddingBottom: 25,
  },
  card: {
    width: "100%",
    height: "100%",
    padding: 15,
    flex: 1,
  },
  cardTitle: {
    padding: 5,
  },
  cardAvatar: {
    marginRight: 20,
  },
  cardChevron: {
    marginLeft: -20,
  },
  deliveryDetailLine: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryDetailLineText: {
    fontSize: 16,
    fontWeight: "normal",
    marginLeft: 6,
    flex: 1,
  },
  divider: {
    marginVertical: 20,
  },
  actions: {
    position: "relative",
    bottom: 0,
    right: 0,
  },
});
export default DeliveryDetails;
