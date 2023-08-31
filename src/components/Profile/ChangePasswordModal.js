import { Button, Form, Input, Modal, message } from 'antd'
import React, { useState } from 'react'
import { useAuthHeader } from "react-auth-kit";
import axios from "axios";

export default function ChangePasswordModal({ open, close }) {
  const [form] = Form.useForm();
  const authHeader = useAuthHeader();
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true);
  const [isChanging, setIsChanging] = useState(false);
  
  const config = {
    headers: {
      Authorization: authHeader()?.split(" ")[1],
    },
  };

  const handleChangePassword = async () => {
    try {
      setIsChanging(true);
      const payload = form.getFieldsValue()
      if(payload.new_password !== payload.confirm_new_password) {
        setIsChanging(false);
        return message.info("Password and confirm password does not match");
      }
      
      const response = await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/users/password`,
        payload,
        config
      );

      if (response.data.ok) {
        message.success("update sucess");
        setTimeout(() => {
          window.location.reload();
        }, 450);
      } else if(response.data.message === "old password is not valid") {
        message.warning("Old password is incorrect");
        form.resetFields();
      } else {
        message.error("update failed");
      }

      setIsChanging(false);
      setSaveButtonDisabled(true);
    } catch (error) {
      setIsChanging(false);
      setSaveButtonDisabled(true);
      console.error(error);
    }
  };

  const handleClose = () => {
    form.resetFields();
    close();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      close={handleClose}
      title="Change Password"
      centered={true}
      footer={[
        <Button size="large" onClick={handleClose}>
          Cancel
        </Button>,
        <Button
          type="primary"
          size="large"
          onClick={handleChangePassword}
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
            !form.isFieldsTouched(true) ||
            !!form.getFieldsError().some((field) => field.errors.length > 0)
          )
        }
      >
        <Form.Item
          label="Old Password"
          name="old_password"
          rules={[
            { required: true, message: "Please input your old password" },
            { min: 8, message: "Password must be minimum 8 characters" },
          ]}
        >
          <Input.Password size="large" placeholder="old password" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="new_password"
          rules={[
            { required: true, message: "Please input your password" },
            { min: 8, message: "Password must be minimum 8 characters" },
          ]}
        >
          <Input.Password size="large" placeholder="password" />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirm_new_password"
          rules={[
            { required: true, message: "Please input your confirm password" },
            { min: 8, message: "Password must be minimum 8 characters" },
          ]}
        >
          <Input.Password size="large" placeholder="confirm password" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
