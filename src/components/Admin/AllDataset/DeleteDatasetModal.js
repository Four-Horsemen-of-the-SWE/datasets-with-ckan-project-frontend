import axios from "axios";
import React, { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { useAuthHeader } from "react-auth-kit";
import { Input, Modal, Typography, message, Form, Button } from "antd";

export default function DeleteDatasetModal({ dataset_id, dataset_name }) {
  const [form] = Form.useForm();
  const authHeader = useAuthHeader();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalShow, setIsModalShow] = useState(false);

  const handleDeleteDataset = async () => {
    setIsDeleting(true);
    if ((dataset_name === form.getFieldValue("confirmName"))) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/${dataset_id}`,
          {
            headers: {
              Authorization: authHeader().split(" ")[1],
            },
          }
        );

        if (response.data.ok) {
          message.success("Delete success.");
          setTimeout(() => {
            form.resetFields();
            setIsDeleting(false);
            window.location.href = "/dashboard";
          }, 700);
        } else {
          setIsDeleting(false);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      message.warning("Dataset name not match.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Modal
        open={isModalShow}
        onCancel={() => setIsModalShow(false)}
        title="Delete dataset"
        footer={[
          <Button size="large" onClick={() => setIsModalShow(false)}>
            Cancel
          </Button>,
          <Button
            type="primary"
            size="large"
            danger={true}
            onClick={handleDeleteDataset}
            loading={isDeleting}
          >
            Delete
          </Button>,
        ]}
      >
        <Typography.Text>
          This will delete this dataset from website. Are you sure ?.
          Please type the {dataset_name} to confirm deletion.
        </Typography.Text>
        <Form form={form} layout="vertical" className="mt-3">
          <Form.Item name="confirmName">
            <Input size="large" placeholder={dataset_name} />
          </Form.Item>
        </Form>
      </Modal>

      <Button
        icon={<DeleteOutlined />}
        type="ghost"
        danger={true}
        style={{ color: "red" }}
        onClick={() => setIsModalShow(true)}
      />
    </>
  );
}
