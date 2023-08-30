import ImgCrop from "antd-img-crop";
import { Avatar, Col, Row, Image, Button, Space, Upload, Typography, Form, Input, Card } from "antd";
import React, { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";
import ChangeUsernameModal from "./ChangeUsernameModal";

export default function EditProfileDetails({ userDetails }) {
  const [isChangePasswordModalShow, setIsChangePasswordModalShow] = useState(false);
  const [isChangeUsernameModalShow, setIsChangeUsernameModalShow] = useState(false);

  return (
    <>
      <ChangePasswordModal open={isChangePasswordModalShow} close={() => setIsChangePasswordModalShow(false)} />

      <ChangeUsernameModal open={isChangeUsernameModalShow} close={() => setIsChangeUsernameModalShow(false)} />

      <div className="container mx-auto mt-5">
        {/* general information */}
        <Card className="mb-5">
          <Row>
            {/* profile image */}
            <Col sm={6} style={{ width: "100%" }}>
              <Space direction="vertical" align="center">
                <Typography.Title level={2}>Profile Photo</Typography.Title>
                <Image src={userDetails.image_display_url} />
                <ImgCrop rotationSlider>
                  <Upload onChange={null}>
                    <Button>Change Image</Button>
                  </Upload>
                </ImgCrop>
              </Space>
            </Col>

            {/* form */}
            <Col sm={18}>
              <Form layout="vertical">
                <Form.Item label="fullname">
                  <Input size="large" placeholder="your full name" />
                </Form.Item>
                <Form.Item label="Email">
                  <Input
                    size="large"
                    type="email"
                    placeholder="youremail@gmail.com"
                  />
                </Form.Item>
                <Form.Item label="About">
                  <Input.TextArea
                    rows={6}
                    placeholder="a little information about your self"
                  />
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Card>

        <Card title="Change Username" className="mb-5">
          <div className="flex items-center justify-between">
            Change your password here
            <Button type="primary" danger={true} onClick={() => setIsChangePasswordModalShow(true)}>
              Change my password
            </Button>
          </div>
        </Card>

        <Card title="Change Password">
          <div className="flex items-center justify-between">
            Change your username here
            <Button type="primary" danger={true} onClick={() => setIsChangeUsernameModalShow(true)}>
              Change my username
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
