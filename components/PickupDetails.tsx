import React, { useEffect, useMemo, useState } from "react";
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



const PickupDetails = (...props: any) => {
  const getDelivery = async (taskId: string) => {
    let response;
    try {
      response = await fetch(
        `${process.env.API_DOMAIN}/api/deliveries/${taskId}`,
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
  const [task, setTask] = useState<any>();
  const backKey = useMemo(() => props[0].route.params.backKey, [])
  const taskId = useMemo(() => props[0].route.params.task, [])
  useEffect(() => {
    (async () => {

      const delivery = await getDelivery(taskId);
      
      if (delivery) setTask(delivery[0]);
      
    })();
  }, []);

  const navigation = props[0].navigation;
  
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {task && (
          <Card style={styles.card}>
            <Card.Title
              title={`Entrega #${task?._id} - Recogido`}
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
                    backgroundColor: task.pickup.status === 'pending' ? "#ab003c" : task.pickup.status === 'in process' ? '#ffee58' : "#4caf50",
                  }}
                >
                  
                  {task.pickup.status === 'pending' ? "Pendiente" : task.pickup.status === 'in process' ? 'En Proceso' : 'Completado'}
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
                <Text style={styles.pickupDetailLineText}>
                  {task?.pickup?.address}
                </Text>
              </View>
            </View>

            <Divider style={styles.divider} />
            <Card.Actions style={styles.actions}>
              {}
              <Button>Confirmar Recogido</Button>
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
