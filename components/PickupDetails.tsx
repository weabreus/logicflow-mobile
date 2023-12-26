import React, { useContext, useEffect, useMemo, useState } from "react";
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
import driverContext from "../context/context";
import * as Location from 'expo-location';
import { useNavigation } from "@react-navigation/native";
import { API_DOMAIN } from "@env";



const PickupDetails = (...props: any) => {
  const navigation = useNavigation();

  const [task, setTask] = useState<any>();
  const [taskStatus, setTaskStatus] = useState<
    "pending" | "in process" | "completed"
  >("pending");

  const backKey = useMemo(() => props[0].route.params.backKey, [])
  const taskId = useMemo(() => props[0].route.params.task, [])

  const { driver, setActiveTask, setDriverStatus } = useContext(driverContext);

  const getDelivery = async (taskId: string) => {
    let response;
    try {
      response = await fetch(
        `${API_DOMAIN}/api/deliveries/${taskId}`,
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
      const data = await response.json();

      // @ts-ignore
      return data.data;
    }
  };
  
  useEffect(() => {

    const focusHandler = navigation.addListener('focus', async () => {

      const delivery = await getDelivery(taskId);

      if (delivery) {
        setTask(delivery[0]);
        setTaskStatus(delivery[0].pickup.status);
      }
    })
    

    return focusHandler
  }, [navigation]);

  const startTask = async (taskId: string) => {
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

      let response: any;

      try {
        response = await fetch(
          `${API_DOMAIN}/api/deliveries/pickup/start`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              taskId: taskId,
              location: {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
              },
              timestamp: Date.now(),
            }),
          }
        );
      } catch (error) {
        console.log({
          status: 500,
          error: error,
        });
      }

      if (response.ok) {
        const data = await response.json();

        // @ts-ignore
        console.log(data.message);
        setTaskStatus("in process");
        setDriverStatus!("busy");
        setActiveTask!({
          // @ts-ignore
          id: task._id,
          type: "pickup",
        });

        response = await fetch(
          `${API_DOMAIN}/api/drivers/active/${driver}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "busy" }),
          }
        );

        if (response.ok) {
          console.log("Status updated.");
        } else {
          console.log("Couldn't update the status.");
        }
      }
    }
  };

  const endTask = async () => {
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

      let response: any;

      try {
        response = await fetch(
          `${API_DOMAIN}/api/deliveries/pickup/end`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              taskId: taskId,
              location: {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
              },
              timestamp: Date.now(),
            }),
          }
        );
      } catch (error) {
        console.log({
          status: 500,
          error: error,
        });
      }

      if (response.ok) {
        const data = await response.json();

        // @ts-ignore
        console.log(data.message);
        setTaskStatus("completed");
        setDriverStatus!("active");
        setActiveTask!(undefined);

        response = await fetch(
          `${API_DOMAIN}/api/drivers/active/${driver}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "active" }),
          }
        );

        if (response.ok) {
          console.log("Status updated.");
        } else {
          console.log("Couldn't update the status.");
        }
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {task && (
          <Card style={styles.card}>
            <Card.Title
              title={`Entrega ID-${task?._id.slice(-10)}`}
              subtitle={"Recogido"}
              titleStyle={{ alignItems: "center", fontWeight: "bold" }}
              left={(props) => (
                // @ts-ignore
                <Button onPress={() => navigation.goBack(backKey)}>
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
                  icon="package-up"
                  onPress={() => {}}
                  size={40}
                  iconColor={"#512da8"}
                />
              )}
              leftStyle={{ marginLeft: -10, alignItems: "center" }}
            />

            <Divider style={styles.divider} />
            {/* Time line */}
            <View style={styles.pickupDetailLine}>
              <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
              >
                <Avatar.Icon icon="clock-time-eight-outline" size={40} />
                <Text style={styles.pickupDetailLineText}>
                  {task?.pickup?.datetime}
                </Text>
              </View>
              <View>
              <Badge
                  style={{
                    backgroundColor:
                      taskStatus === "pending"
                        ? "#ab003c"
                        : taskStatus === "in process"
                        ? "#ffee58"
                        : "#4caf50",
                  }}
                >
                  {taskStatus === "pending"
                    ? "Pendiente"
                    : taskStatus === "in process"
                    ? "En Proceso"
                    : "Completado"}
                </Badge>
              </View>
            </View>

            <Divider style={styles.divider} />

            {/* Customer Contact */}
            <View
              style={{
                ...styles.pickupDetailLine,
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <View style={{ ...styles.pickupDetailLine }}>
                <Avatar.Icon icon="account" size={40} />
                <Text style={styles.pickupDetailLineText}>
                  {task?.pickup?.name}
                </Text>
              </View>
              <View
                style={{
                  ...styles.pickupDetailLine,
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
                ...styles.pickupDetailLine,
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <View style={{ ...styles.pickupDetailLine }}>
                <Avatar.Icon icon="map-marker" size={40} />
                <Text style={styles.pickupDetailLineText}>
                  {task?.pickup?.address}
                </Text>
              </View>
              <View
                style={{
                  ...styles.pickupDetailLine,
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
                ...styles.pickupDetailLine,
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <View style={{ ...styles.pickupDetailLine }}>
                <Avatar.Icon icon="information-outline" size={40} />
                <Text
                  style={{ ...styles.pickupDetailLineText, flexShrink: 1 }}
                >
                  {task?.pickup?.address}
                </Text>
              </View>
            </View>

            <Divider style={styles.divider} />
            <Card.Actions style={styles.actions}>
              {taskStatus === "pending" && (
                <Button onPress={() => startTask(task._id)}>
                  Iniciar recogido
                </Button>
              )}
              {taskStatus === "in process" && (
                <Button onPress={() => endTask()}>Confirmar recogido</Button>
              )}
            </Card.Actions>
          </Card>
        )}
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
    padding: 10,
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
  pickupDetailLine: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  pickupDetailLineText: { fontSize: 16, fontWeight: "normal", marginLeft: 6 },
  divider: {
    marginVertical: 20,
  },
  actions: {
    position: "relative",
    bottom: 0,
    right: 0,
  },
});
export default PickupDetails;
