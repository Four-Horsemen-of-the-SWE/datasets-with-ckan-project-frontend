import ImgCrop from "antd-img-crop";
import { Avatar, Col, Row, Image, Button, Space, Upload, Typography, Form, Input, Card, message } from "antd";
import React, { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";
import ChangeUsernameModal from "./ChangeUsernameModal";
import { useAuthHeader } from "react-auth-kit";
import axios from "axios";

export default function EditProfileDetails({ userDetails, cancel }) {
  const authHeader = useAuthHeader();
  const [form] = Form.useForm();
  const [isChangePasswordModalShow, setIsChangePasswordModalShow] = useState(false);
  const [isChangeUsernameModalShow, setIsChangeUsernameModalShow] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const config = {
    headers: {
      Authorization: authHeader()?.split(" ")[1]
    }
  }

  const handleUpdateProfile = async(values) => {
    try {
      setIsUpdating(true);
      const response = await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/users/update`,
        values,
        config
      );

      if(response.data.ok) {
        message.success('update sucess')
        setTimeout(() => {
          setIsUpdating(false);
          window.location.reload();
        }, 450);
      } else {
        message.error('update failed');
        setIsUpdating(false);
      }
    } catch(error) {
      setIsUpdating(false);
      console.error(error);
    }
  }

  return (
    <>
      <ChangePasswordModal
        open={isChangePasswordModalShow}
        close={() => setIsChangePasswordModalShow(false)}
      />

      <ChangeUsernameModal
        open={isChangeUsernameModalShow}
        close={() => setIsChangeUsernameModalShow(false)}
      />

      <div className="container mx-auto mt-5">
        {/* general information */}
        <Card className="mb-5 shadow-sm">
          <Row>
            {/* profile image */}
            <Col sm={6} style={{ width: "100%" }}>
              <Space direction="vertical" align="center">
                <Typography.Title level={2}>Profile Photo</Typography.Title>
                <Image src={userDetails.image_display_url} className="rounded-md mb-2" width={300} />
                <ImgCrop rotationSlider>
                  <Upload onChange={null}>
                    <Button>Change Image</Button>
                  </Upload>
                </ImgCrop>
              </Space>
            </Col>

            {/* form */}
            <Col sm={18}>
              <Form
                layout="vertical"
                form={form}
                onFinish={handleUpdateProfile}
                initialValues={{
                  fullname: userDetails.fullname,
                  email: userDetails.email,
                  about: userDetails.about,
                }}
              >
                <Form.Item label="Full name" name="fullname">
                  <Input size="large" placeholder="your full name" />
                </Form.Item>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: "Please input your email" }]}
                >
                  <Input
                    size="large"
                    type="email"
                    placeholder="youremail@gmail.com"
                  />
                </Form.Item>
                <Form.Item label="About" name="about">
                  <Input.TextArea
                    rows={6}
                    placeholder="a little information about your self"
                  />
                </Form.Item>
                <Form.Item>
                  <Space className="float-right">
                    <Button disabled={isUpdating} onClick={cancel}>
                      Cancel
                    </Button>
                    <Button
                      loading={isUpdating}
                      type="primary"
                      htmlType="submit"
                    >
                      Save
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Card>

        <Card title="Change Username" className="mb-5 shadow-sm">
          <div className="flex items-center justify-between">
            Change your password here
            <Button
              type="primary"
              danger={true}
              onClick={() => setIsChangePasswordModalShow(true)}
            >
              Change my password
            </Button>
          </div>
        </Card>

        <Card title="Change Password" className="mb-5 shadow-sm">
          <div className="flex items-center justify-between">
            Change your username here
            <Button
              type="primary"
              danger={true}
              onClick={() => setIsChangeUsernameModalShow(true)}
            >
              Change my username
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
