import { useAuthHeader } from "react-auth-kit";
import { EditOutlined } from "@ant-design/icons";
import { Modal, message, Space, Form, Input, Button } from "antd";
import axios from "axios";
import { useResourcesStore } from "../../store";

export default function EditResourceModal({ dataset_id, name, description, open, close }) {
  const authHeader = useAuthHeader();
  const JWTToken = authHeader().split(" ")[1];

  // state
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
        const new_data =resources.filter((item) => item.id !== response.data.result);
        setResources(new_data);

        // then close modal
        close();
      }
    } catch(error) {
      message.error(error.message);
    }
  }

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
          <Button key="delete" danger={true} onClick={handleDelete}>
            Delete
          </Button>,
          <Button onClick={close}>Cancel</Button>,
          <Button type="primary" key="update">
            Update
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="File name">
            <Input placeholder="file name." size="large" value={name} />
          </Form.Item>

          <Form.Item label="Description">
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