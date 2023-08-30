import { Button, Form, Input, Modal, Divider, Typography } from "antd";
import React from "react";

export default function ChangeUsernameModal({ open, close }) {
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
        <Form.Item label="New Username">
          <Input size="large" placeholder="new username" />
        </Form.Item>
        <Divider />
        <Form.Item>
          <Typography.Paragraph>
            <Typography.Text strong={true}>Note:</Typography.Text>
            {" "}
            Changing your username requires a new login. The system will
            automatically log out after changing the username.
          </Typography.Paragraph>
        </Form.Item>
      </Form>
    </Modal>
  );
}
