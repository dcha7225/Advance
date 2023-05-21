import { StyleSheet, Text, View, Image } from "react-native";

export default function MenuBar() {
    return (
        <View style={styles.menubar}>
            <View style={styles.menuBarOptions}>
                <Image
                    source={require("../assets/graphIcon.png")}
                    style={{
                        height: "60%",
                        width: "43%",
                    }}
                />
                <Text>Charts</Text>
            </View>
            <View style={styles.menuBarOptions}>
                <Image
                    source={require("../assets/todayIcon.png")}
                    style={{
                        height: "60%",
                        width: "50%",
                    }}
                />
                <Text>Today</Text>
            </View>
            <View style={styles.menuBarOptions}>
                <Image
                    source={require("../assets/journalIcon.png")}
                    style={{
                        height: "60%",
                        width: "60%",
                    }}
                />
                <Text> Journal </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    menubar: {
        width: "100%",
        height: "100%",
        flexDirection: "row",
        borderWidth: 2,
        borderColor: "grey",
        borderRadius: 15,
        overflow: "hidden",
    },
    menuBarOptions: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
