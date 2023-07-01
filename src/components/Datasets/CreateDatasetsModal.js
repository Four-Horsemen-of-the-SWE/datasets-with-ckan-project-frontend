import { InboxOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Button, theme, Modal, Form, Input, Upload, Space, Tooltip } from "antd";
import { useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import axios from "axios";

export default function CreateDatasetsModal({ isModalOpen, close }) {
  const authHeader = useAuthHeader();
  const [form] = Form.useForm();
  const [isPrivate, setIsPrivate] = useState(false);

  const JWTToken = authHeader().split(" ")[1];

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();

      const fileList = values.file?.fileList;

      // Create a new FormData object
      const formData = new FormData();
      fileList?.forEach((file) => {
        formData.append("files", file.originFileObj);
      });

      // Send the formData to the backend API
      const response = await fetch(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets`,
        {
          headers: {
            Authorization: JWTToken,
          },
        },
        {
          method: "POST",
          body: formData,
        }
      );

      // Handle the response from the backend
      if (response.ok) {
        // Handle success
        console.log("Files uploaded successfully");
      } else {
        // Handle error
        console.log("Error uploading files");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <Modal
      title="Create Datasets"
      open={isModalOpen}
      onOk={close}
      onCancel={close}
      footer={[
        <Tooltip title={`Toggle to change to ${isPrivate ? "Public" : "Private"}`} placement="left">
          <Button
            size="large"
            icon={isPrivate ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={() => setIsPrivate(!isPrivate)}
          >
            {isPrivate ? "Private" : "Public"}
          </Button>
        </Tooltip>,
        <Button type="primary" size="large" onClick={() => handleCreate()}>
          Create
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" className="mt-5">
        <Form.Item label="Datasets Name" name="name" required>
          <Input placeholder="the name of the new dataset" size="large" className="lowercase" />
        </Form.Item>
        <Form.Item label="Files" name="file">
          <Upload.Dragger multiple={true}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="font-bold text-xl">Drag and drop files to upload</p>
            <p className="text-slate-400">
              Consider zipping large directories for faster uploads
            </p>
          </Upload.Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
}
