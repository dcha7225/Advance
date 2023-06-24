import { SafeAreaView, Dimensions, Text } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function Chart({ dataset, title }) {
    const originalConsoleLog = console.log;

    const scrollEventRegex =
        /You specified `onScroll` on a <ScrollView> but not `scrollEventThrottle`\. You will only receive one event\./;

    console.log = (message) => {
        if (scrollEventRegex.test(message)) {
            // Ignore the scroll event console log
            return;
        }

        // Log other messages
        originalConsoleLog(message);
    };

    return (
        <SafeAreaView>
            <Text
                style={{ textAlign: "center", margin: 10, fontWeight: "600" }}
            >
                {title}
            </Text>
            <LineChart
                data={dataset}
                color={"#cacacaf2"}
                textColor={"black"}
                thickness={3}
                textShiftY={14}
                textShiftX={10}
                width={screenWidth * 0.8}
                height={screenHeight * 0.3}
                showScrollIndicator
                scrollToEnd
                scrollAnimation={false}
                pressEnabled
            />
        </SafeAreaView>
    );
}
