import { AutoComplete, Modal, message } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons';
import React, { useState } from 'react'
import {useAuthHeader} from 'react-auth-kit'
import axios from 'axios';
import PromoteUserModal from './PromoteUserModal';

export default function PromoteUser() {
  const authHeader = useAuthHeader()
  const [users, setUsers] = useState([]);
  const [isModalShow, setModalShow] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const config = {
    headers: {
      Authorization: authHeader()?.split(" ")[1]
    }
  }

  const handleSearch = async (text) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/users/auto_complete?q=${text}&include_admin=${false}`
      );
      console.log(response.data)
      if (response.data.ok) {
        setUsers(
          response.data.result?.map((item) => ({
            value: item.id,
            label: item.fullname,
          }))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePromote = async(user_id) => {
    try {
      const payload = {
        user_id: user_id,
        role: "admin"
      }
      const response = await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/admins/role`,
        payload,
        config
      )

      if(response.data.ok) {
        message.success("Member has been promoted.");
        window.location.reload();
      } else {
        message.error("Failed to promoted.");
      }
    } catch(error) {
      console.log(error);
    }
  }

  const handleClick = (user_id) => {
    setSelectedUser(user_id);
    Modal.confirm({
      title: "Do you want to promote this member to admin",
      icon: <ExclamationCircleFilled />,
      content:
        "This will give this user permission to control various administrative functions.",
      okText: "Yes",
      onOk() {
        handlePromote(user_id);
      },
    });
  }

  return (
    <>
      <AutoComplete
        className="w-full"
        size="large"
        options={users}
        placeholder="username"
        allowClear={true}
        onSearch={handleSearch}
        onClear={() => setUsers([])}
        onSelect={handleClick}
      />
    </>
  );
}

/*
<PromoteUserModal
        user={selectedUser}
        open={isModalShow}
        close={() => setSelectedUser(false)}
      />
*/