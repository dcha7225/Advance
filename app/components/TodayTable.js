import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    FlatList,
    Text,
    View,
    TouchableHighlight,
} from "react-native";
import { DataTable } from "react-native-paper";

export default function TodayTable({ data, setTracked, modifyMountStatus }) {
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        if (selected != null) {
            setSelected(null);
        }
    }, [data]);

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
                    <DataTable.Row
                        style={
                            selected === item.id ? styles.highlightedRow : null
                        }
                        onPress={() => {
                            if (selected === item.id) {
                                setSelected(null);
                            } else {
                                setSelected(item.id);
                            }
                        }}
                    >
                        <DataTable.Cell>{item.movement}</DataTable.Cell>
                        <DataTable.Cell>{item.reps}</DataTable.Cell>
                        <DataTable.Cell>
                            <View style={styles.weightContainer}>
                                <Text style={{ marginRight: 30 }}>
                                    {item.weight}
                                </Text>
                                {selected === item.id && (
                                    <TouchableHighlight
                                        onPress={() => {
                                            setTracked(
                                                removeItemById(item.id, data)
                                            );
                                            modifyMountStatus();
                                        }}
                                        style={styles.buttonContainer}
                                    >
                                        <View style={styles.button}>
                                            <Text style={styles.buttonText}>
                                                x
                                            </Text>
                                        </View>
                                    </TouchableHighlight>
                                )}
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
        backgroundColor: "#fff",
    },
    weightContainer: {
        width: 100,
        alignItems: "center",
        flexDirection: "row",
    },
    highlightedRow: {
        backgroundColor: "#efefef",
    },
    buttonContainer: {
        position: "absolute",
        right: 0,
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        elevation: 3,
        backgroundColor: "maroon",
        height: 30,
        width: 30,
    },
    buttonText: {
        fontSize: 15,
        lineHeight: 21,
        fontWeight: "bold",
        color: "white",
    },
});
