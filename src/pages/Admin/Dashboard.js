import React, { useState, useEffect } from "react";
import { CloudDownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { Alert, Input, Typography, Space, Table, Button, Tooltip, notification, Col, Divider, Row, Empty, message, Modal } from "antd";
import { useAuthUser, useAuthHeader } from "react-auth-kit";
import moment from "moment/moment";
import { redirect, Link } from "react-router-dom";
import { filesize } from "filesize";
import axios from "axios";
import {
  SearchOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import { useResourcesStore } from "../../store";



const { Title, Text } = Typography;

export default function Dashboard({
  creator_user_id,
  dataset_id,
  resource,
  datasets,
  id,
  name,
}) {
  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const [allDatasets, setAllDatasets] = useState([]);
  const [isHotestLoading, setIsHotestLoading] = useState(true);
  const [api, contextHolder] = notification.useNotification();
  const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
  const [thumbnail, setThumbnail] = useState(datasets?.thumbnail);
  const [datasetsNumber, setDatasetsNumber] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [messageApi] = message.useMessage();
  const JWTToken = authHeader().split(" ")[1];

  const { resources, setResources } = useResourcesStore();

  useEffect(() => {
    // if user is not admin.
    if (!auth()?.is_admin) {
      redirect('/');
    }
  }, []);

  const fetchHotestDatasets = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/dashboard`
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

  /* const fetchDatasetsNumber = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/number`
      );
      if (response.data.ok) {
        setDatasetsNumber(response.data.result);
      }
    } catch (error) {
      console.error(error.message);
    }
  } */

  useEffect(() => {
    fetchHotestDatasets();
    //fetchDatasetsNumber();
  }, []);

  const deleteDataset = async () => {
    setIsDeleting(true);
    if (datasets.name === confirmName) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/delete/${datasets.id}`,
          {
            headers: {
              Authorization: authHeader().split(" ")[1],
            },
          }
        );

        if (response.data.ok) {
          messageApi.open({
            type: "success",
            content: "Delete success.",
          });
          setTimeout(() => {
            window.location.href = "/datasets/dashboard";
          }, 700);
        }

        // setIsDeleting(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      messageApi.open({
        type: "warning",
        content: "Dataset name not match.",
      });
      setIsDeleting(false);
    }
  };


  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name - b.name,
      sortDirections: ["descend"],
      render: (text, record) => (
        <Link to={`/datasets/${record?.id}`} style={{ color: "black" }}>{text}</Link>
      ),
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
        <Modal
        title="Delete this datasets ?"
        open={isDeleteModalShow}
        onCancel={() => setIsDeleteModalShow(false)}
        footer={[
          <Button onClick={() => setIsDeleteModalShow(false)}>Cancel</Button>,
          <Button
            type="primary"
            onClick={() => deleteDataset()}
            loading={isDeleting}
            danger={true}
          >
            Delete
          </Button>,
        ]}
      >
        <Text>
          Confirm the name of datasets to continue. This will permanently delete
          the {name}
        </Text>
        <Space direction="vertical" className="w-full mb-2">
          <Title level={5}>Dataset name</Title>
          <Input
            size="large"
            placeholder={name}
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            block
          />
        </Space>
      </Modal>
      ),
    },
  ];


  return (
    <>
      {contextHolder}
      
      <div className="container mx-auto">
        <Title level={2}>Main Dashboard</Title>

        <div className="flex items-center justify-between">
          <Space direction="vertical">
            <Title level={3}>Datasets</Title>
          </Space>
        </div>

        <Table
          pagination={false}
          columns={columns}
          dataSource={allDatasets}
          expandable={{
            expandedRowRender: (record) => (
              <Typography.Paragraph ellipsis={{ row: "1" }}>
                {record.notes}
              </Typography.Paragraph>
            ),
            rowExpandable: (record) => record.notes !== "",
          }}
        />
      </div>
    </>
  );
}