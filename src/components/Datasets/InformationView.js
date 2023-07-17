import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { List, Space, Statistic, Tag, Typography } from "antd";
import moment from "moment";
import "moment-timezone";

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

export default function InformationView({ license_title, version, metadata_created, metadata_modified, tags }) {
  const format_date = (date) => {
    const result = moment.utc(date).toDate() &&
      moment(moment.utc(date).toDate()).format(
        "MMMM Do YYYY, h:mm:ss a"
      );
    return result;
  }
  const format_metadata_created = format_date(metadata_created);
  const format_metadata_modified = format_date(metadata_modified);

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
      value: format_metadata_created,
    },
    {
      label: "Modified",
      value: format_metadata_modified,
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
                    item.value ? item.value : 'No Data'
                  }
                />
              </List.Item>
            )}
          />

          {/* TAGS HERE */}
          <Space direction="vertical">
            <Title level={5}>Tags</Title>
            <div className="flex flex-wrap">
              {tags?.map((item, key) => (
                <Tag color="magenta" key={key}>
                  {item.display_name}
                </Tag>
              ))}
            </div>
          </Space>

          <Space direction="vertical" className="w-full">
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
