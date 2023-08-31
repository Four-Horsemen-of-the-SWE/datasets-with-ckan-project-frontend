import { Button, Form, Input, Modal, Divider, Typography } from "antd";
import React from "react";
import { useState } from "react";

export default function ChangeUsernameModal({ open, close }) {
  const [form] = Form.useForm();
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);

  const handleClose = () => {
    form.resetFields()
    close();
  }

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      close={handleClose}
      title="Change Password"
      centered={true}
      footer={[
        <Button size="large" onClick={handleClose} key="cancel">
          Cancel
        </Button>,
        <Button
          type="primary"
          size="large"
          key="save"
          disabled={saveButtonDisabled}
        >
          Save
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-5"
        onFieldsChange={() =>
          setSaveButtonDisabled(
            form.getFieldsError().some((field) => field.errors.length > 0)
          )
        }
      >
        <Form.Item
          label="New Username"
          name="username"
          rules={[
            { required: true, message: "Please input your new username" },
            { min: 6, message: "Username must be minimum 6 characters" },
          ]}
          getValueFromEvent={(event) => event.target.value.replace(/\s+/g, "-")}
        >
          <Input size="large" placeholder="new username" />
        </Form.Item>
        <Divider />
        <Form.Item>
          <Typography.Paragraph>
            <Typography.Text strong={true}>Note:</Typography.Text> Changing your
            username requires a new login. The system will automatically log out
            after changing the username.
          </Typography.Paragraph>
        </Form.Item>
      </Form>
    </Modal>
  );
}
