import { InboxOutlined, EditOutlined } from "@ant-design/icons";
import { Modal, message, Space, Form, Input, Button } from "antd";

export default function EditResourceModal({ name, description, open, close }) {
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
          <Button key="delete" danger={true}>
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