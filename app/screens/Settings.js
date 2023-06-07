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
import { useState, useContext, useEffect } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyContext } from "../components/ContextProvider";
import { useIsFocused } from "@react-navigation/native";
import { errorAlert } from "../../AsyncStor";

export default function Settings() {
    const {
        setTracked,
        intValue,
        setIntValue,
        inc,
        onChangeInc,
        setMovement,
        firstMount,
        movement,
    } = useContext(MyContext);

    const [rangeInt, setRangeInt] = useState([
        { label: "2-4, 5-7 ... ", value: 2 },
        { label: "2-5, 6-9 ... ", value: 3 },
        { label: "2-6, 7-11 ...", value: 4 },
        { label: "2-7, 8-13 ...", value: 5 },
    ]);
    const [intOpen, setIntOpen] = useState(false);

    const [customMoves, setCustomMoves] = useState([]);
    const [customOpen, setCustomOpen] = useState(false);
    const [CMValue, setCMValue] = useState(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            const custMoves = movement.filter(
                (item) =>
                    item.label !== "Bench Press" &&
                    item.label !== "Squat" &&
                    item.label !== "Deadlift" &&
                    item.label !== "Shoulder Press"
            );
            setCustomMoves(custMoves);
        }
    }, [isFocused, movement]);

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
            errorAlert(e);
        }
    };
    const removeMovements = () => {
        if (CMValue != null) {
            const filteredMoves = movement.filter(
                (item) => item.label !== CMValue
            );
            firstMount.current = false;
            setMovement(filteredMoves);
            setCMValue(null);
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

    const dismissKeyboard = () => {
        Keyboard.dismiss();
        return false;
    };

    return (
        <SafeAreaView
            style={styles.background}
            onStartShouldSetResponder={dismissKeyboard}
        >
            <View style={styles.titleBar}>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "600",
                    }}
                >
                    Settings
                </Text>
            </View>

            <View style={[styles.inputs, { marginTop: 20, zIndex: 2 }]}>
                <Text style={styles.optText}>Set rep range interval</Text>
                <DropDownPicker
                    open={intOpen}
                    value={intValue}
                    items={rangeInt}
                    setOpen={setIntOpen}
                    setValue={setIntValue}
                    setItems={setRangeInt}
                    containerStyle={[styles.dropDown, { flex: 0.35 }]}
                    style={{ borderColor: "#ccc" }}
                    dropDownContainerStyle={{ borderColor: "#ccc" }}
                    textStyle={{
                        fontSize: 12,
                    }}
                />
            </View>
            <View style={styles.inputs}>
                <Text style={[styles.optText, { flex: 0.5 }]}>
                    Set weight increment (Progressive Overload Suggestions in
                    lbs)
                </Text>
                <TextInput
                    style={[styles.inputBox, { flex: 0.3 }]}
                    onChangeText={onChangeInc}
                    value={inc}
                    placeholder="0 lbs"
                    keyboardType="numeric"
                />
            </View>

            <View style={[styles.inputs, { zIndex: 1 }]}>
                <Text style={styles.optText}>Remove custom movement</Text>

                <DropDownPicker
                    open={customOpen}
                    value={CMValue}
                    items={customMoves}
                    setOpen={setCustomOpen}
                    setValue={setCMValue}
                    setItems={setCustomMoves}
                    containerStyle={styles.dropDown}
                    style={{ borderColor: "#ccc" }}
                    dropDownContainerStyle={{ borderColor: "#ccc" }}
                    textStyle={{
                        fontSize: 12,
                    }}
                />

                <TouchableHighlight
                    onPress={() => removeMovements()}
                    style={styles.buttonTouchableContainer}
                >
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>Remove</Text>
                    </View>
                </TouchableHighlight>
            </View>

            <View style={styles.inputs}>
                <Text style={styles.optText}> Reset all data </Text>
                <TouchableHighlight
                    onPress={() => handleReset()}
                    style={styles.resetTouchable}
                >
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>RESET</Text>
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
    titleBar: {
        width: "100%",
        height: "8%",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        borderRadius: 2,
    },
    inputs: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        marginVertical: 10,
        width: "95%",
    },

    optText: {
        flex: 0.4,
        margin: 10,
        marginRight: 5,
    },

    dropDown: {
        flex: 0.3,
        marginVertical: 5,
        marginRight: 5,
    },
    inputBox: {
        flex: 0.25,
        height: "70%",
        margin: 5,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        borderColor: "#ccc",
    },

    resetTouchable: {
        flex: 0.25,
        alignSelf: "center",
        margin: 5,
    },

    button: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
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
    buttonTouchableContainer: { alignSelf: "center", margin: 5, flex: 0.25 },
});
