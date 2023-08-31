import { Button, Form, Input, Modal, Divider, Typography, message } from "antd";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useAuthHeader, useSignOut } from "react-auth-kit";

export default function ChangeUsernameModal({ username, open, close }) {
  const [form] = Form.useForm();
  const authHeader = useAuthHeader();
  const signOut = useSignOut();
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [isChanging, setIsChanging] = useState(false);

  const config = {
    headers: {
      Authorization: authHeader()?.split(" ")[1],
    },
  };

  const handleChangeUsername = async() => {
    try {
      setIsChanging(true);
      const payload = form.getFieldsValue();
      const response = await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/users/username`,
        payload,
        config
      );

      if(response.data.ok) {
        message.success("Success. you will logout in a moment");
        setTimeout(() => {
          setIsChanging(false);
          signOut();
        }, 500);
      } else {
        setIsChanging(false);
      }
    } catch(errors) {
      setIsChanging(false);
      message.error("Change username failed")
      console.error(errors);
    }
  }

  const validatorInput = (_, value) => {
    if(value === username) {
      return Promise.reject("Username must be different");
    } else {
      return Promise.resolve();
    }
  }

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
        <Button
          size="large"
          onClick={handleClose}
          key="cancel"
          disabled={isChanging}
        >
          Cancel
        </Button>,
        <Button
          type="primary"
          size="large"
          key="save"
          disabled={saveButtonDisabled}
          loading={isChanging}
          onClick={handleChangeUsername}
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
          name="new_username"
          rules={[
            { required: true, message: "Please input your new username" },
            { min: 6, message: "Username must be minimum 6 characters" },
            {
              pattern: new RegExp(
                /^[a-zA-Z@~`!@#$%^&*()_=+\\\\';:\"\\/?>.<,-]+$/i
              ),
              message: "Username must be in English only.",
            },
            {
              validator: validatorInput
            }
          ]}
          getValueFromEvent={(event) =>
            event.target.value.replace(/\s+/g, "-").toLowerCase()
          }
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
