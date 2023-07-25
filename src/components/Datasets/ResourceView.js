import { useAuthUser } from "react-auth-kit";
import {
  CloudDownloadOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Alert, Typography, Space, Table, Button, Tooltip, Popover } from "antd";
import moment from "moment/moment";
import { filesize } from "filesize";
import axios from "axios";
import EditResourceModal from "./EditResourcecModal";
import { useState } from "react";
import CreateResourceModal from "./CreateResourceModal";

const { Title, Text } = Typography;

export default function ResourceView({
  creator_user_id,
  dataset_id,
  resource,
}) {
  const auth = useAuthUser();

  // states
  const [isEditModalShow, setIsEditModalShow] = useState(false);
  const [isCreateModalShow, setIsCreateModalShow] = useState(false);
  const [selectedResource, setSelectedResource] = useState({});

  const handleDownload = async (url) => {
    try {
      window.open(url, "_blank");
      await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/${dataset_id}/download`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleResourceSelected = (resource) => {
    setSelectedResource(resource);
    setIsEditModalShow(true);
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
      render: (text, record) => (
        <p className="flex flex-col">
          <b>{text}</b>
          {record.description && (
            <Typography.Paragraph
              ellipsis={{ rows: 1, symbol: "more", expandable: true }}
              type="secondary"
            >
              {record.description}
            </Typography.Paragraph>
          )}
        </p>
      ),
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
    creator_user_id === auth()?.id && {
      title: "Edit",
      align: "center",
      render: (record) => <Button type="ghost" onClick={() => handleResourceSelected({name: record.name, description: record.description})}>
        <EditOutlined />
      </Button>,
    },
  ];

  return (
    <> 
      {/* for edit resouce file */}
      <EditResourceModal
        name={selectedResource.name}
        description={selectedResource.description}
        open={isEditModalShow}
        close={() => setIsEditModalShow(false)}
      />

      {/* for create new resouce file. ambatukammmm */}
      <CreateResourceModal
        open={isCreateModalShow}
        close={() => setIsCreateModalShow(false)}
      />

      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Space direction="vertical">
            <Title level={3}>Resource</Title>
            <Text type="secondary">{resource?.length} Resources</Text>
          </Space>
          {auth()?.id === creator_user_id && (
            <Button icon={<PlusOutlined />} onClick={() => setIsCreateModalShow(true)}>New File</Button>
          )}
        </div>

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
          size="large"
        />
      </div>
    </>
  );
}
