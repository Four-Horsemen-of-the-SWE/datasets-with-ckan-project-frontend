import { Modal, Typography, message, Button } from "antd"
import { useAuthHeader } from "react-auth-kit";
import React from 'react'
import axios from "axios";

export default function ChangeRoleModal({ user_id, open, close, is_admin }) {
  const authHeader = useAuthHeader();
  const config = {
    headers: {
      Authorization: authHeader()?.split(" ")[1],
    },
  };

  const handleChangeRole = async() => {
    try {
      const payload = {
        user_id: user_id,
        role: "admin",
      };
      const response = await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/admins/role`,
        payload,
        config
      );

      if (response.data.ok) {
        message.success("Member has been promoted.");
        window.location.reload();
      } else {
        message.error("Failed to promoted.");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Modal
      title="Change role"
      open={open}
      onCancel={close}
      width={"30%"}
      footer={[<Button onClick={close}>Cancel</Button>]}
    >
      <div className="flex flex-col w-full">
        <Typography.Title level={4}>
          {is_admin ? "Members" : "Administrators"}
        </Typography.Title>
        <div className="flex flex-row items-center justify-between w-full">
          <Typography.Text>
            {is_admin
              ? "Member can only create, update, delete own dataset. They can also see other people's dataset."
              : "Administrators can delete other datase. They can also manage user role and ban other user"}
          </Typography.Text>
          <Button type="primary" onClick={handleChangeRole}>
            {is_admin ? "Change to Member" : "Change to Administrators"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
