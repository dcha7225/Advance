import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableHighlight,
    Alert,
    Keyboard,
} from "react-native";
import { useState, useContext } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyContext } from "../components/ContextProvider";

export default function Settings() {
    const {
        setTracked,
        intValue,
        setIntValue,
        inc,
        onChangeInc,
        setMovement,
        firstMount,
    } = useContext(MyContext);

    const [rangeInt, setRangeInt] = useState([
        { label: "2-4, 5-7 ... ", value: 2 },
        { label: "2-5, 6-9 ... ", value: 3 },
        { label: "2-6, 7-11 ...", value: 4 },
        { label: "2-7, 8-13 ...", value: 5 },
    ]);

    const [intOpen, setIntOpen] = useState(false);

    const clearData = async () => {
        try {
            await AsyncStorage.clear();
            setTracked([]);
            setMovement([
                { label: "Bench Press", value: "Bench Press" },
                { label: "Squat", value: "Squat" },
                { label: "Deadlift", value: "Deadlift" },
                { label: "Shoulder Press", value: "Shoulder Press" },
            ]);
        } catch (e) {
            console.log(e);
        }
    };
    const removeMovements = async () => {
        try {
            await AsyncStorage.removeItem("movements");
            setMovement([
                { label: "Bench Press", value: "Bench Press" },
                { label: "Squat", value: "Squat" },
                { label: "Deadlift", value: "Deadlift" },
                { label: "Shoulder Press", value: "Shoulder Press" },
            ]);
        } catch (e) {
            console.log(e);
        }
    };

    const handleReset = () =>
        Alert.alert(
            "Warning",
            "Are you sure you want to permanently erase all data?",
            [
                {
                    text: "No",
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: () => {
                        clearData();
                        firstMount.current = true;
                    },
                },
            ]
        );

    const handleMoveReset = () =>
        Alert.alert(
            "Warning",
            "Are you sure you want to permanently erase all of your custom movements?",
            [
                {
                    text: "No",
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: () => removeMovements(),
                },
            ]
        );
    const dismissKeyboard = () => {
        Keyboard.dismiss();
        return false;
    };

    return (
        <SafeAreaView
            style={styles.background}
            onStartShouldSetResponder={dismissKeyboard}
        >
            <Text>Settings</Text>

            <View style={[styles.inputs, { marginTop: 20, zIndex: 1 }]}>
                <Text style={styles.optText}>Set rep range interval</Text>
                <DropDownPicker
                    open={intOpen}
                    value={intValue}
                    items={rangeInt}
                    setOpen={setIntOpen}
                    setValue={setIntValue}
                    setItems={setRangeInt}
                    containerStyle={styles.dropDown}
                    textStyle={{
                        fontSize: 12,
                    }}
                />
            </View>
            <View style={styles.inputs}>
                <Text style={styles.optText}>
                    Set weight increment (Progressive Overload Suggestions in
                    lbs)
                </Text>
                <TextInput
                    style={styles.inputBox}
                    onChangeText={onChangeInc}
                    value={inc}
                    placeholder="0 lbs"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputs}>
                <Text style={styles.optText}> Reset all data </Text>
                <TouchableHighlight
                    onPress={() => handleReset()}
                    style={styles.buttonTouchableContainer}
                >
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>RESET</Text>
                    </View>
                </TouchableHighlight>
            </View>
            <View style={styles.inputs}>
                <Text style={styles.optText}>Remove all custom movements</Text>
                <TouchableHighlight
                    onPress={() => handleMoveReset()}
                    style={styles.buttonTouchableContainer}
                >
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Remove</Text>
                    </View>
                </TouchableHighlight>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    inputs: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 4,
        marginVertical: 10,
        width: "95%",
    },

    optText: {
        width: "50%",
        margin: 10,
    },

    dropDown: {
        width: "40%",
        marginVertical: 5,
        marginRight: 5,
    },
    inputBox: {
        height: "70%",
        width: "40%",
        margin: 5,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },

    buttonTouchableContainer: {
        alignSelf: "center",
        margin: 5,
        width: "40%",
    },

    button: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: "maroon",
    },
    buttonText: {
        fontSize: 12,
        lineHeight: 21,
        fontWeight: "bold",
        letterSpacing: 0.25,
        color: "white",
    },
});
