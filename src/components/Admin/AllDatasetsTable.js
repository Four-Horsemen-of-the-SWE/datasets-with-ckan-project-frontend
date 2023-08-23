import React, { useState, useEffect } from "react";
import { CloudDownloadOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Alert,
  Input,
  Typography,
  Space,
  Table,
  Button,
  Tooltip,
  notification,
  Col,
  Divider,
  Row,
  Empty,
  message,
  Modal,
  Tag,
} from "antd";
import { useAuthUser, useAuthHeader } from "react-auth-kit";
import moment from "moment/moment";
import { redirect, Link } from "react-router-dom";
import { filesize } from "filesize";
import axios from "axios";
import {
  SearchOutlined,
  PushpinOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useResourcesStore } from "../../store";

const { Title, Text } = Typography;

export default function AllDatasetsTable({
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
        message: "Error",
        description: error.message,
        placement: "bottomRight",
      });
    }
  };

  useEffect(() => {
    fetchHotestDatasets();
  }, []);

  console.log(allDatasets)

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
        } else {
          setIsDeleting(false);
        }
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
        <Space align="center" size="large">
          <img
            src={record?.thumbnail}
            alt="Thumbnail"
            style={{ maxWidth: "45px", borderRadius: "7px" }}
          />
          <Link to={`/datasets/${record?.id}`} style={{ color: "black" }}>
            {text}
          </Link>
        </Space>
      ),
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      render: (user_name) => (
        <Link to={`/profile/${user_name}`} target="_blank">
          {user_name}
        </Link>
      ),
    },
    {
      title: "Tag",
      dataIndex: "tags",
      key: "tags",
      render: (tags) =>
        tags.slice(0, 3).map((tag) => <Tag>{tag.display_name}</Tag>),
    },
    {
      title: "Last Modified",
      dataIndex: "last_modified",
      key: "last_modified",
      render: (text) => moment(text).format("LL"),
    },
    {
      title: "Delete",
      dataIndex: "url",
      key: "url",
      width: "10px",
      align: "center",
      render: (url) => (
        <Button
          icon={<DeleteOutlined />}
          type="ghost"
          danger={true}
          style={{ color: "red" }}
        />
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      <Table
        pagination={true}
        columns={columns}
        dataSource={allDatasets}
        style={{ width: "100% !i" }}
      />
    </>
  );
}
