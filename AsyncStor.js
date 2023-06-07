import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export function errorAlert(e) {
    Alert.alert("Error", e.toString(), [
        {
            text: "OK",
            style: "cancel",
        },
    ]);
}

export async function storeData(key, value) {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        errorAlert(e);
    }
}

export async function getData(key) {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        errorAlert(e);
    }
}

export async function getAllKeys() {
    let keys = [];
    try {
        keys = await AsyncStorage.getAllKeys();
    } catch (e) {
        errorAlert(e);
    }
    return keys;
}
