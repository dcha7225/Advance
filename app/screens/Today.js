import { StyleSheet, SafeAreaView, Text } from "react-native";
import { useState } from "react";
import MenuBar from "../components/MenuBar";
import DropDownPicker from "react-native-dropdown-picker";

export default function ChartScreen() {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: "Apple", value: "apple" },
        { label: "Banana", value: "banana" },
    ]);

    return (
        <SafeAreaView style={styles.background}>
            <Text> POTracker </Text>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
            />
            <MenuBar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
});
