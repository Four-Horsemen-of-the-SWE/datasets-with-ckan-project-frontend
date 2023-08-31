import { Button, Form, Input, Modal, message } from 'antd'
import React, { useState } from 'react'
import { useAuthHeader } from "react-auth-kit";
import axios from "axios";

export default function ChangePasswordModal({ open, close }) {
  const [form] = Form.useForm();
  const authHeader = useAuthHeader();
  const [isChanging, setIsChanging] = useState(false);
  
  const config = {
    headers: {
      Authorization: authHeader()?.split(" ")[1],
    },
  };

  const handleChangePassword = async () => {
    try {
      const payload = form.getFieldsValue()
      if(payload.new_password !== payload.confirm_new_password) {
        message.info("Password and confirm password does not match");
        setIsChanging(false);
      }
      
      setIsChanging(true);
      const response = await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/users/password`,
        payload,
        config
      );

      if (response.data.ok) {
        message.success("update sucess");
        setTimeout(() => {
          setIsChanging(false);
          window.location.reload();
        }, 450);
      } else {
        message.error("update failed");
        setIsChanging(false);
      }
    } catch (error) {
      setIsChanging(false);
      console.error(error);
    }
  };

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
        <Button
          type="primary"
          size="large"
          onClick={handleChangePassword}
          disabled={
            !form.isFieldsTouched(true) ||
            !!form.getFieldsError().filter(({ errors }) => errors.length).length
          }
        >
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" className="mt-5">
        <Form.Item
          label="Old Password"
          name="old_password"
          rules={[
            { required: true, message: "Please input your old password" },
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
          ]}
        >
          <Input.Password size="large" placeholder="confirm password" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
