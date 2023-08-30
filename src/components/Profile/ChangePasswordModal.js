import { Button, Form, Input, Modal } from 'antd'
import React from 'react'

export default function ChangePasswordModal({ open, close }) {
  return (
    <Modal
      open={open}
      onCancel={close}
      close={close}
      title="Change Password"
      centered={true}
      footer={[
        <Button size="large" onClick={close}>
          Cancel
        </Button>,
        <Button type="primary" size="large">
          Save
        </Button>,
      ]}
    >
      <Form layout="vertical" className="mt-5">
        <Form.Item label="Old Password">
          <Input size="large" placeholder="old password" />
        </Form.Item>
        <Form.Item label="Password">
          <Input size="large" placeholder="password" />
        </Form.Item>
        <Form.Item label="Confirm Password">
          <Input size="large" placeholder="confirm password" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
