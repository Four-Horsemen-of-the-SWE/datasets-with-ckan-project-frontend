import { Button, Modal, Space } from 'antd'
import React from 'react'

export default function PromoteUserModal({ user_id, open, close }) {
  return (
    <Modal
      open={open}
      onCancel={close}
      title="Are you sure you want to promote the admin role?"
      footer={[
        <Space>
          <Button style={{ width: "50%" }}>async</Button>
          <Button style={{ width: "50%" }}>asd</Button>
        </Space>,
      ]}
    ></Modal>
  );
}
