import React from "react";
import {
    StyleSheet,
    FlatList,
    Text,
    View,
    TouchableHighlight,
} from "react-native";
import { DataTable } from "react-native-paper";

const removeItemById = (id, data) => {
    let filtered = [];
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.id == id) {
            if (
                item.movement != "" &&
                i + 1 < data.length &&
                data[i + 1].movement == ""
            ) {
                data[i + 1].movement = item.movement;
            }
        } else {
            filtered.push({
                movement: item.movement,
                weight: item.weight,
                reps: item.reps,
                id: item.id,
            });
        }
    }
    for (let i = 0; i < filtered.length; i++) {
        const item = filtered[i];
        item.id = i;
    }
    return filtered;
};

export default function TodayTable({ data, setTracked, modifyMountStatus }) {
    return (
        <DataTable style={styles.container}>
            <DataTable.Header style={styles.tableHeader}>
                <DataTable.Title>Movement</DataTable.Title>
                <DataTable.Title>Reps</DataTable.Title>
                <DataTable.Title>Weight</DataTable.Title>
            </DataTable.Header>
            <FlatList
                keyExtractor={(item) => item.id}
                data={data}
                renderItem={({ item }) => (
                    <DataTable.Row>
                        <DataTable.Cell>{item.movement}</DataTable.Cell>
                        <DataTable.Cell>{item.reps}</DataTable.Cell>
                        <DataTable.Cell>
                            <View style={styles.weightContainer}>
                                <Text style={{ paddingHorizontal: 25 }}>
                                    {item.weight}
                                </Text>
                                <TouchableHighlight
                                    onPress={() => {
                                        setTracked(
                                            removeItemById(item.id, data)
                                        );
                                        modifyMountStatus();
                                    }}
                                >
                                    <View style={styles.button}>
                                        <Text style={styles.buttonText}>
                                            Remove
                                        </Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </DataTable.Cell>
                    </DataTable.Row>
                )}
            />
        </DataTable>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    tableHeader: {
        backgroundColor: "white",
    },
    weightContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        flexDirection: "row",
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        elevation: 3,
        backgroundColor: "maroon",
        height: 30,
        width: 50,
    },
    buttonText: {
        fontSize: 10,
        lineHeight: 21,
        fontWeight: "bold",
        color: "white",
    },
});
