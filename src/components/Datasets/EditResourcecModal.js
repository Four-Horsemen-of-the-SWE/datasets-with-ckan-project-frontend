import { useAuthHeader } from "react-auth-kit";
import { EditOutlined } from "@ant-design/icons";
import { Modal, message, Space, Form, Input, Button, Popconfirm } from "antd";
import { useResourcesStore } from "../../store";
import axios from "axios";
import { useEffect } from "react";

export default function EditResourceModal({ dataset_id, name, description, open, close }) {
  const authHeader = useAuthHeader();
  const JWTToken = authHeader().split(" ")[1];
  const [form] = Form.useForm();

  // store
  const { resources, setResources } = useResourcesStore();

  const handleDelete = async() => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/resources/${dataset_id}`,
        {
          headers: {
            Authorization: JWTToken,
          },
        }
      );

      if(response.data.ok) {
        message.success('Delete success.');
        // set with new resouces
        const new_data = resources.filter((item) => item.id !== response.data.result);
        setResources(new_data);

        // then close modal
        close();
      }
    } catch(error) {
      message.error(error.message);
    }
  }

  const handleUpdate = async () => {
    try {
      if(form.getFieldValue("name") === "") {
        return message.info("Please input file name.")
      }

      const formData = new FormData();
      formData.append("name", form.getFieldValue("name"));
      formData.append("description", form.getFieldValue("description"));
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

        // then close modal
        close();
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    // set input with default value
    form.setFieldsValue({
      name: name,
      description: description,
    });
  }, [dataset_id]);

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
        afterClose={form.resetFields()}
        footer={[
          <Popconfirm
            title="Delete the file."
            description="Are you sure to delete this file?"
            onConfirm={handleDelete}
            placement="bottom"
          >
            <Button key="delete" danger={true}>
              Delete
            </Button>
          </Popconfirm>,
          <Button onClick={close}>Cancel</Button>,
          <Button type="primary" key="update" onClick={handleUpdate}>
            Update
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item label="File name" name="name">
            <Input placeholder="file name." size="large" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea
              rows={4}
              placeholder="More details about this file."
              value={description}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}