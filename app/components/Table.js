import React from "react";
import { StyleSheet, FlatList } from "react-native";
import { DataTable } from "react-native-paper";

export default function Table({ data }) {
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
                        <DataTable.Cell>{item.weight}</DataTable.Cell>
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
});
