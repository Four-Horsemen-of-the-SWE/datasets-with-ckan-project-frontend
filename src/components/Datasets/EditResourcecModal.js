import { useAuthHeader } from "react-auth-kit";
import { EditOutlined } from "@ant-design/icons";
import { Modal, message, Space, Form, Input, Button, Spin } from "antd";
import { useResourcesStore } from "../../store";
import axios from "axios";
import { useEffect, useState } from "react";

export default function EditResourceModal({ dataset_id, name, description, open, close }) {
  const authHeader = useAuthHeader();
  const JWTToken = authHeader().split(" ")[1];
  const [form] = Form.useForm();

  const [isCreating, setIsCreating] = useState(false);

  // store
  const { resources, setResources } = useResourcesStore();

  const handleUpdate = async () => {
    try {
      setIsCreating(true);
      const new_name = form.getFieldValue("name");
      const new_description = form.getFieldValue("description");

      if (new_name === "") {
        setIsCreating(false);
        return message.info("Please input file name.");
      }

      const formData = new FormData();
      formData.append("name", new_name);
      formData.append("description", new_description);

      const response = await axios.put(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/resources/${dataset_id}`,
        formData,
        {
          headers: {
            Authorization: JWTToken,
          },
        }
      );

      if (response.data.ok) {
        message.success("Update success.");

        // set with new resouces
        const new_data = resources.map((item) => item.id === response.data.result.id ? response.data.result : item);
        setResources(new_data);

        setIsCreating(false);

        // then close modal
        close();
      }
    } catch (error) {
      setIsCreating(false);
      message.error(error.message);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      name: name,
      description: description,
    });
  })

  return (
    <>
      <Modal
        title={
          <Space>
            <EditOutlined />
            Edit resource.
          </Space>
        }
        open={open}
        onCancel={close}
        centered={true}
        footer={[
          <Button onClick={close}>Cancel</Button>,
          <Button
            type="primary"
            key="update"
            onClick={handleUpdate}
            loading={isCreating}
          >
            Update
          </Button>,
        ]}
      >
        {isCreating ? (
          <div className="w-full h-72 flex justify-center items-center">
            <Spin size="large" />
          </div>
        ) : (
          <Form form={form} layout="vertical">
            <Form.Item label="File name" name="name">
              <Input
                placeholder="file name."
                size="large"
                defaultValue={name}
                allowClear={true}
                loading={isCreating}
              />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <Input.TextArea
                rows={4}
                placeholder="More details about this file."
                value={description}
                allowClear={true}
                loading={isCreating}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
}