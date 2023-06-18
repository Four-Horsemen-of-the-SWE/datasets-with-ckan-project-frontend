import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { Alert, Space, Statistic, Typography } from "antd";

const { Title, Text } = Typography;

const downloaded_data = {
  labels: ["January", "February", "March", "April", "May"],
  datasets: [
    {
      label: "Donwloaded",
      backgroundColor: "#1677FF",
      borderColor: "#1677FF",
      borderWidth: 2,
      data: [65, 59, 80, 81, 56],
    },
  ],
};

export default function InformationView() {
  const data = [];
  return (
    <>
      <div className="container mx-auto">
        <Title level={3}>Data</Title>
        <Text type="secondary">Additional Information</Text>

        {/* if data is empty */}
        {!data.length && (
          <Alert
            showIcon
            type="info"
            message="No information"
            className="my-3"
          />
        )}

        <Space direction="vertical" className="w-full" size={18}>
          {/* downloaded statistic */}
          <Space direction="vertical" className="w-full">
            <Statistic title="Downloaded" value={25668} />

            <div className="w-full">
              <Line
                data={downloaded_data}
                options={{
                  title: {
                    display: true,
                    text: "Average Rainfall per month",
                    fontSize: 20,
                  },
                  legend: {
                    display: true,
                    position: "right",
                  },
                  maintainAspectRatio: false,
                  responsive: true,
                }}
              />
            </div>
          </Space>

          {/* favorite (bookmarked) statistic */}
          <Statistic title="Bookmarked" value={14538} />

          {/* favorite (bookmarked) statistic */}
          <Statistic title="Topics" value={5} />
        </Space>
      </div>
    </>
  );
}
