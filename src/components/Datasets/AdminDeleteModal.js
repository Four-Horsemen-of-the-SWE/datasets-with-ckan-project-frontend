import React from 'react'
import { Modal, Button, Space, Typography, Input, message } from "antd"
import { useState } from 'react';
import { useAuthHeader } from "react-auth-kit";
import axios, { all } from "axios";

const { Title, Text } = Typography;

export default function AdminDeleteModal({ dataset_id, dataset_name, open, close }) {
  const [confirmName, setConfirmName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const authHeader = useAuthHeader();

  const config = {
    headers: {
      Authorization: authHeader()?.split(" ")[1]
    }
  }

  const deleteDataset = async () => {
    setIsDeleting(true);
    if (dataset_name === confirmName) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/${dataset_id}`,
          config
        );

        if (response.data.ok) {
          message.success("Delete success.");
          setTimeout(() => {
            setIsDeleting(false);
            window.location.href = "/datasets";
          }, 700);
        } else {
          setIsDeleting(false);
        }

        // setIsDeleting(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      message.warning("Dataset name not match.");
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      title="Delete this datasets ?"
      open={open}
      onCancel={close}
      footer={[
        <Button onClick={close}>Cancel</Button>,
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
        the {dataset_name}
      </Text>
      {" "}
      <Text type="danger" strong={true}>with admin role</Text>
      <Space direction="vertical" className="w-full mb-2">
        <Title level={5}>Dataset name</Title>
        <Input
          size="large"
          placeholder={dataset_name}
          value={confirmName}
          onChange={(e) => setConfirmName(e.target.value)}
          block={true}
        />
      </Space>
    </Modal>
  );
}
