import { useState, useEffect } from "react";
import { CloudDownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { Alert, Typography, Space, Table, Button, Tooltip, notification, Col, Divider, Row, Empty } from "antd";
import { useAuthUser } from "react-auth-kit";
import moment from "moment/moment";
import { redirect } from "react-router-dom";
import { filesize } from "filesize";
import axios from "axios";
import {
  SearchOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import DatasetsCard from "../../components/Card/DatasetsCard";


const { Title, Text } = Typography;

export default function Dashboard({  
  creator_user_id,
  dataset_id,
  resource,
}) {
  const auth = useAuthUser();
  const [allDatasets, setAllDatasets] = useState([]);
  const [isHotestLoading, setIsHotestLoading] = useState(true);
  const [api, contextHolder] = notification.useNotification();
  const [datasetsNumber, setDatasetsNumber] = useState(0);
  const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);


  useEffect(() => {
    // if user is not admin.
    if(!auth()?.is_admin) {
      redirect('/');
    }
  }, []);

  const fetchHotestDatasets = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets`
      );
      if (response.status === 200) {
        setAllDatasets(response.data.result);
        setIsHotestLoading(false);
      }
    } catch (error) {
      console.log(error);
      api.error({
        message: 'Error',
        description: error.message,
        placement: 'bottomRight'
      });
    }
  };

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

  const fetchDatasetsNumber = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/number`
      );
      if(response.data.ok) {
        setDatasetsNumber(response.data.result);
      }
    } catch(error) {
      console.error(error.message);
    }
  }
  
  useEffect(() => {
    fetchHotestDatasets();
    fetchDatasetsNumber();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name - b.name,
      sortDirections: ["descend"],
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Image",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail) => (
        <img src={thumbnail} alt="Thumbnail" style={{ maxWidth: "100px" }} />
      ),
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Last Modified",
      dataIndex: "last_modified",
      key: "last_modified",
      render: (text) => moment(text).format("LL"),
    },
    /* {
      title: "File Size",
      dataIndex: "size",
      key: "size",
      sorter: (a, b) => a.size - b.size,
      sortDirections: ["descend"],
      render: (text) => filesize(text),
    }, */
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
    {
      title: "Delete",
      dataIndex: "url",
      key: "url",
      width: "10px",
      align: "center",
      render: (url) => (
        <Tooltip title="Click to Delete">
          <Button
              type="primary"
              size="large"
              onClick={() => setIsDeleteModalShow(true)}
              danger
            >
              Delete
            </Button>
        </Tooltip>
      ),
    },
  ];

  return(
    console.log(allDatasets),
    <>
      <div className="container mx-auto">
        <Title  level={2}>Main Dashboard</Title>

        <div className="flex items-center justify-between">
          <Space direction="vertical">
            <Title level={3}>Datasets</Title>
          </Space>
        </div>

        {/* if data is empty */}
        {/* {!resource && (
          <Alert
            showIcon
            type="info"
            message="No resource"
            description="The dataset might not be uploaded at this time. Please come back later."
            className="my-3"
          />

        )} */}

        {/* else */}
        <Table
          pagination={false}
          columns={columns}
          dataSource={allDatasets}
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
