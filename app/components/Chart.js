import { LineChart } from "react-native-chart-kit";
import { SafeAreaView, Dimensions, Text } from "react-native";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function Chart({ dataset, title }) {
    let r;
    if (dataset.length < 10) {
        r = "2";
    } else {
        r = "0";
    }

    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: r,
            strokeWidth: "2",
            stroke: "#ffa726",
        },
    };

    const data = {
        datasets: [
            {
                data: dataset,
            },
        ],
    };

    return (
        <SafeAreaView>
            <Text
                style={{ textAlign: "center", margin: 10, fontWeight: "600" }}
            >
                {title}
            </Text>
            <LineChart
                data={data}
                width={screenWidth}
                height={screenHeight * 0.5}
                chartConfig={chartConfig}
                //bezier
            />
        </SafeAreaView>
    );
}
