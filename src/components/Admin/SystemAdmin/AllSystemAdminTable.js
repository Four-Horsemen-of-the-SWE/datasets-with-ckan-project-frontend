import { DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { Table, Avatar, Button, Space, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AllSystemAdminTable() {
  const authHeader = useAuthHeader();
  const [users, setUsers] = useState([]);

  const config = {
    headers: {
      Authorization: authHeader()?.split(" ")[1],
    },
  };

  const fetchAdmin = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/admins`,
        config
      );
      if (response.data.ok) {
        setUsers(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (user_id) => {
    Modal.confirm({
      title: "Do you want to demote this admin to member",
      icon: <ExclamationCircleFilled />,
      content: "This will cancel the admin role back to being a member.",
      okText: "Yes",
      onOk() {
        handleDemote(user_id);
      },
    });
  }

  const handleDemote = async (user_id) => {
    try {
      const payload = {
        user_id: user_id,
        role: "member",
      };
      const response = await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/admins/role`,
        payload
      );
      if(response.data.ok) {
        message.success("Admin has been demoted.")
        window.location.reload();
      } else {
        message.error("Domoted failed.")
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <Avatar
            src={
              record.image_url
                ? record.image_url
                : process.env.PUBLIC_URL + "/images/no_avatar.png"
            }
            shape="square"
          />
          <Link to={`/profile/${text}`} target="_blank">
            {text}
          </Link>
        </Space>
      ),
    },
    {
      align: "center",
      render: (value, record, index) => (
        <Button
          icon={<DeleteOutlined />}
          onClick={() => handleClick(record.id)}
          danger={true}
          disabled={!index}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchAdmin();
  }, []);

  return <Table columns={columns} dataSource={users} />;
}
