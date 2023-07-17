import React, { useState } from "react";
import { Avatar, Button, Form, Input, Modal, Radio } from "antd";

export default function createTopicModal({ isOpen, close }) {
  return (
    <>
      <Modal
        title="Create new topic"
        open={isOpen}
        onCancel={close}
        maskClosable={false}
        footer={[
          <Button size="large" onClick={() => close()}>
            Cancel
          </Button>,
          <Button size="large" type="primary">Create Topic</Button>,
        ]}
        centered
      >
        <Form layout="vertical">
          <Form.Item label="Title" name="title">
            <Input
              placeholder="Topic Title"
              size="large"
              maxLength={50}
              showCount={true}
            />
          </Form.Item>
          <Form.Item label="Message" name="body">
            <Input.TextArea
              rows={6}
              maxLength={255}
              showCount={true}
              size="large"
              placeholder="Give feedback and ask questions about the dataset or share your insights with the community."
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
