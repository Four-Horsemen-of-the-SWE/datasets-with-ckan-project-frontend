import React from 'react'
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, Typography, Divider, Button, Form, Input, Space } from 'antd';
import { useCreateModalStore } from '../../store';
import { useIsAuthenticated, useAuthHeader, useAuthUser } from "react-auth-kit";

const { Title } = Typography;

export default function EditDetails({ userDetails }) {
  return (
    <>
      <Form layout="vertical">
        <Form.Item>
          <Avatar
            src={userDetails.image_display_url}
            size={256}
            className="ring-4"
          />
        </Form.Item>
        <Form.Item label="Full name">
          <Input size="large" placeholder="full name" />
        </Form.Item>
        <Form.Item label="Email">
          <Input
            size="large"
            type="email"
            placeholder="your_email@example.com"
          />
        </Form.Item>
        <Form.Item label="About">
          <Input.TextArea
            rows={6}
            placeholder="a little information about your self"
          />
        </Form.Item>
        <Form.Item>
          <Space className="w-full">
            <Button size="large" type="primary">
              Save
            </Button>
            <Button size="large">Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
}
