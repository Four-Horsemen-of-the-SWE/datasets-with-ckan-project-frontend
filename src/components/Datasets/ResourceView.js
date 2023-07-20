import { CloudDownloadOutlined } from "@ant-design/icons";
import { Alert, Card, Typography, Tag, Space, Table, Button, Tooltip } from "antd"
import moment from "moment/moment";
import { filesize } from "filesize";
import axios from "axios";

const { Title, Text } = Typography

export default function ResourceView({ dataset_id, resource }) {

  const handleDownload = async(url) => {
    try {
      window.open(url, "_blank");
      await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/${dataset_id}/download`
      );
    } catch(error) {
      console.error(error);
    }
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Last Modified",
      dataIndex: "last_modified",
      key: "last_modified",
      render: (text) => moment(text).format("LL"),
    },
    {
      title: "File Size",
      dataIndex: "size",
      key: "size",
      sorter: (a, b) => a.size - b.size,
      sortDirections: ["descend"],
      render: (text) => filesize(text),
    },
    {
      title: "Download",
      dataIndex: "url",
      key: "url",
      width: "10px",
      align: "center",
      render: (url) => (
        <Tooltip title="Click to Download">
          <Button
            icon={<CloudDownloadOutlined />}
            onClick={() => handleDownload(url)}
            shape="circle"
            size="small"
            type="primary"
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <div className="container mx-auto">
        <Title level={3}>Resource</Title>
        <Text type="secondary">{resource.length} Resources</Text>

        {/* if data is empty */}
        {!resource.length && (
          <Alert
            showIcon
            type="info"
            message="No resource"
            description="The dataset might not be uploaded at this time. Please come back later."
            className="my-3"
          />
        )}

        {/* else */}
        <Table
          pagination={false}
          columns={columns}
          dataSource={resource}
          expandable={{
            expandedRowRender: (record) => (
              <Typography.Paragraph ellipsis={{ rows: "1" }}>
                {record.description}
              </Typography.Paragraph>
            ),
            rowExpandable: (record) => record.description !== "",
          }}
        />
      </div>
    </>
  );
}