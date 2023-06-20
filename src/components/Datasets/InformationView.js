import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { List, Space, Statistic, Typography } from "antd";
import moment from "moment";

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

export default function InformationView({ license_title, version, metadata_created, metadata_modified }) {
  const additional_data = [
    {
      label: "License",
      value: license_title,
    },
    {
      label: "Version",
      value: version,
    },
    {
      label: "Created",
      value: metadata_created,
      type: 'date',
    },
    {
      label: "Modified",
      value: metadata_modified,
      type: 'date',
    },
  ];

  return (
    <>
      <div className="container mx-auto">
        <Title level={3}>Data</Title>
        <Text type="secondary" className="block">
          Additional Information
        </Text>

        <Space direction="vertical" className="w-full" size={32}>
          <List
            bordered={false}
            dataSource={additional_data}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.label}
                  description={
                    item?.type === "date"
                      ? moment(item.value).format("MMMMM Do YYYY, h:mm:ss a")
                      : item.value
                      ? item.value
                      : "No Data"
                  }
                />
              </List.Item>
            )}
          />

          <Space direction="vertical">
            {/* downloaded statistic */}
            <Statistic title="Downloaded" value={25668} />

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
