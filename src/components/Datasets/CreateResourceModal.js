import { InboxOutlined, FileOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Modal, Upload, message } from "antd";
import { useAuthHeader } from "react-auth-kit";
import axios from "axios";
import { useState } from "react";
import { useResourcesStore } from "../../store";

export default function CreateResourceModal({ dataset_id, open, close }) {
  const authHeader = useAuthHeader();
  const JWTToken = authHeader().split(" ")[1];
  const [selectedFile, setSelectedFile] = useState(null);

  const [form] = Form.useForm();

  // state 
  const [isCreating, setIsCreating] = useState(false);

  // store
  const { resources, setResources } = useResourcesStore();

  const props = {
    name: "file",
    multiple: false,
    maxCount: 1,
    showUploadList: false,
    onChange(e) {
      // set input as filename;
      form.setFieldsValue({
        name: e.file.name,
      });
      // set selected file
      setSelectedFile(e);
    },
  };

  const handleCreate = async () => {
    try {
      setIsCreating(true);

      const formData = new FormData();
      const fileValue = form.getFieldValue("file");

      // set filed to formData
      formData.append("resources", fileValue?.file.originFileObj);
      formData.append("name", form.getFieldValue("name"));
      if(form.getFieldValue("description")) {
        formData.append("description", form.getFieldValue("description"));
      }

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
        message.success("Create success.");

        // clear field
        form.resetFields();
        // clar selected file
        setSelectedFile(null);

        // add new file into list
        setResources([...resources, ...response.data.result]);

        setIsCreating(false);

        // close modal
        close();
      } else {
        setIsCreating(false);
        message.error("Cannot create file.");
      }
    } catch (error) {
      setIsCreating(false);
      message.error(error.message);
    }
  };

  const handleClear = () => {
    form.resetFields();
    setSelectedFile(null);
  };

  return (
    <>
      <Modal
        title="Create new resouce."
        open={open}
        onCancel={close}
        centered={true}
        footer={[
          <Button onClick={close}>
            Cancel
          </Button>,
          <Button type="primary" loading={isCreating} onClick={handleCreate}>
            Create
          </Button>
        ]}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Name" name="name">
            <Input placeholder="file name." size="large" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea
              rows={4}
              placeholder="More details about this file."
            />
          </Form.Item>
          <Form.Item label="File" name="file">
            {/* if file not uploaded */}
            {selectedFile !== null ? (
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 items-center">
                    <FileOutlined style={{ fontSize: "30px" }} />
                    <b>{form?.getFieldValue("name")}</b>
                  </div>
                  <Button type="ghost" onClick={handleClear}>
                    <DeleteOutlined style={{ color: "red" }} />
                  </Button>
                </div>
              </Card>
            ) : (
              <Upload.Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload.
                </p>
                <p className="ant-upload-hint">
                  SConsider zipping large directories for faster uploads.
                </p>
              </Upload.Dragger>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
