import { useState } from "react";
import { useAuthUser } from "react-auth-kit";
import {
  CloudDownloadOutlined,
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Typography,
  Space,
  Table,
  Button,
  Tooltip,
} from "antd";
import { filesize } from "filesize";
import moment from "moment/moment";
import axios from "axios";

// store
import { useResourcesStore } from "../../store";

// import components
import EditResourceModal from "./EditResourcecModal";
import CreateResourceModal from "./CreateResourceModal";
import DeleteResouceButton from "./DeleteResouceButton";
import VisualizationModal from "./VisualizationModal";

const { Title, Text } = Typography;

export default function ResourceView({ creator_user_id, dataset_id }) {
  const auth = useAuthUser();

  // store
  const { resources, setResources } = useResourcesStore();

  // states
  const [isEditModalShow, setIsEditModalShow] = useState(false);
  const [isCreateModalShow, setIsCreateModalShow] = useState(false);
  const [isVisualizationModalShow, setIsVisualizationModalShow] = useState(false);
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
  };

  const handleResouceVisualizationSelected = (resource) => {
    setSelectedResource(resource);
    setIsVisualizationModalShow(true);
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name?.length - b.name?.length,
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
        <Button
          type="primary"
          icon={<CloudDownloadOutlined />}
          onClick={() => handleDownload(url)}
          size="middle"
        >
          Download
        </Button>
      ),
    },
    {
      title: "Preview",
      align: "center",
      render: (item, record) => (
        <Button
          type="ghost"
          icon={<EyeOutlined />}
          className="bg-[#E5E7EB]"
          onClick={() =>
            handleResouceVisualizationSelected({
              id: record.id,
              name: record.name,
              mimetype: record.mimetype,
              format: record.format,
            })
          }
        >
          Visualization
        </Button>
      ),
    },
    ...(creator_user_id === auth()?.id
      ? [
          {
            title: "Action",
            align: "center",
            render: (record) => (
              <>
                <Button
                  type="ghost"
                  onClick={() =>
                    handleResourceSelected({
                      id: record.id,
                      name: record.name,
                      description: record.description,
                    })
                  }
                >
                  <EditOutlined />
                </Button>
                <DeleteResouceButton resource_id={record.id} />,
              </>
            ),
          },
        ]
      : []),
  ];

  return (
    <>
      {/* resource Visualization modal */}
      <VisualizationModal
        resource_id={selectedResource.id}
        mimetype={selectedResource.mimetype}
        open={isVisualizationModalShow}
        close={() => setIsVisualizationModalShow(false)}
      />

      {/* for edit resouce file */}
      <EditResourceModal
        dataset_id={selectedResource.id}
        name={selectedResource.name}
        description={selectedResource.description}
        open={isEditModalShow}
        close={() => setIsEditModalShow(false)}
      />

      {/* for create new resouce file. ambatukammmm */}
      <CreateResourceModal
        dataset_id={dataset_id}
        open={isCreateModalShow}
        close={() => setIsCreateModalShow(false)}
      />

      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Space direction="vertical">
            <Title level={3}>Resource</Title>
            <Text type="secondary">{resources?.length} Resources</Text>
          </Space>
          {auth()?.id === creator_user_id && (
            <Button
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalShow(true)}
            >
              New File
            </Button>
          )}
        </div>

        {/* if data is empty */}
        {!resources?.length && (
          <Alert
            showIcon
            type="info"
            message="No resource"
            description="The dataset might not be uploaded at this time. Please come back later."
            className="my-3"
            closable={true}
          />
        )}

        {/* else */}
        <Table
          pagination={false}
          columns={columns}
          dataSource={resources}
          size="large"
        />
      </div>
    </>
  );
}
