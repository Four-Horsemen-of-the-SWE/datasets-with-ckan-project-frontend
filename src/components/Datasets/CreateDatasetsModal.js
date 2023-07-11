import { InboxOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { Button, message, Modal, Form, Input, Upload, Space, Tooltip, List } from "antd";
import { useState } from "react";
import { useAuthHeader } from "react-auth-kit";
import axios from "axios";

export default function CreateDatasetsModal({ isModalOpen, close }) {
  const authHeader = useAuthHeader();
  const [form] = Form.useForm();
  const [isPrivate, setIsPrivate] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const JWTToken = authHeader().split(" ")[1];

  const handleUpload = async (dataset_id, fileList) => {
    try {
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("resources", file.originFileObj);
      });

      const response = await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/${dataset_id}/resources`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: JWTToken,
          },
        }
      );
      if (response.data.ok) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      messageApi.open({
        type: "warning",
        content: error.message
      })
    }
  };


  const handleCreate = async () => {
    // create dataset then upload file
    try {
      setIsCreating(true);
      const values = await form.validateFields();
      const fileList = values.file?.fileList;

      const response = await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/`,
        {
          name: values.name.replace(/[.!]/g, "-").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").trim().toLowerCase(),
          title: values.name,
        },
        {
          headers: {
            Authorization: JWTToken,
          },
        },
      );

      if(response.data.ok) {
        // if have file, then upload
        if(!!fileList) {
          const upload_response = await handleUpload(response.data.result.id, fileList);
          if(upload_response) {
            setIsCreating(false);
            message.success({
              type: "success",
              content: "Create with resoucess success."
            })
            setTimeout(() => {
              window.location.href = `/datasets/${response.data.result.id}`;
            }, 1200)
          }
        } else {
          setIsCreating(false);
          message.success({
            type: "success",
            content: "Create success.",
          });
          setTimeout(() => {
            window.location.href = `/datasets/${response.data.result.id}`;
          }, 1200);
        }
      }
    } catch (error) {
      messageApi.open({
        type: "warning",
        content: error.message,
      });
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
            disabled
          >
            {isPrivate ? "Private" : "Public"}
          </Button>
        </Tooltip>,
        <Button type="primary" size="large" loading={isCreating} onClick={() => handleCreate()}>
          Create
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" className="mt-5">
        <Form.Item label="Datasets Name" name="name" required>
          <Input placeholder="the name of the new dataset" size="large" className="lowercase" allowClear />
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
