import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import { Col, List, Row, Space, Spin, Statistic, Tag, Typography } from "antd";
import moment from "moment";
import "moment-timezone";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

export default function InformationView({ dataset_id, author, license_title, version, metadata_created, metadata_modified, tags }) {
  const [downloadStatistic, setDownloadStatistic] = useState({});
  const [downloadStatisticSuccess, setDownloadStatisticSuccess] = useState(false);

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
      label: "Created by",
      value: (
        <Link to={`/profile/${author}`}>{author}</Link>
      )
    },
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

  const fetchDownloadStatistic = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/${dataset_id}/download`
      );
      if (response.data.ok) {
        setDownloadStatistic({
          labels: response.data.result.map((item) =>
            moment(item.download_date).format('LL')
          ),
          datasets: [
            {
              label: "Download",
              backgroundColor: "#1677FF",
              borderColor: "#1677FF",
              borderWidth: 2,
              data: response.data.result.map((item) => item.download_count),
            },
          ],
          total_download: response.data.total_download,
        });
        setDownloadStatisticSuccess(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDownloadStatistic();
  }, []);

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
                  description={item.value ? item.value : "No Data"}
                />
              </List.Item>
            )}
          />
          {/* TAGS HERE */}
          <Space direction="vertical">
            <Title level={5}>Tags</Title>
            <div className="flex flex-wrap gap-1">
              {tags?.length ? (
                tags?.map((item, key) => (
                  <Tag color="magenta" key={key}>
                    {item.display_name}
                  </Tag>
                ))
              ) : (
                <p className="text-slate-500">No tag</p>
              )}
            </div>
          </Space>
          {/* downloaded statistic */}
          {downloadStatisticSuccess ? (
            <Space direction="vertical" className="w-full">
              <Statistic
                title="Downloaded"
                value={downloadStatistic.total_download}
              />
              <Line
                data={downloadStatistic}
                options={{
                  title: {
                    display: true,
                    text: "Download",
                    fontSize: 20,
                  },
                  legend: {
                    display: true,
                    position: "right",
                  },
                  maintainAspectRatio: false,
                  responsive: true,
                  scales: {
                    y: {
                      ticks: {
                        beginAtZero: false,
                        stepSize: 1,
                        callback: function (value) {
                          if (value % 1 === 0) {
                            return value;
                          }
                        },
                      },
                    },
                  },
                }}
              />
            </Space>
          ) : (
            <Spin size="large" />
          )}
          {/* favorite (bookmarked) statistic */}
          {/* <Statistic title="Bookmarked" value={14538} /> */}

          {/* favorite (bookmarked) statistic */}
          {/* <Statistic title="Topics" value={5} /> */}
        </Space>
      </div>
    </>
  );
}
