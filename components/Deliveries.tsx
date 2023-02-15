import React from 'react'
import {ScrollView, FlatList, View, StyleSheet} from 'react-native'
import { Text, } from 'react-native-paper'
import tasks from '../data/tasks'
import DeliveriesItem from './DeliveriesItem'

const Deliveries = () => {
  return (
    <>
    <View style={styles.container}>
        {/* @ts-ignore */}
        <FlatList data={tasks} renderItem={({item}) => <DeliveriesItem taskId={item.id} status={item.task_status} pickup_address={item.pickup_address} delivery_address={item.delivery_address} />} keyExtractor={task => task.id}/>
    </View>
    </>
  )
}

const styles = StyleSheet.create({
    container: {
      height: '100%',
      width: '100%',
      paddingTop: 10,
      paddingHorizontal: 20
    },
  });

export default Deliveries