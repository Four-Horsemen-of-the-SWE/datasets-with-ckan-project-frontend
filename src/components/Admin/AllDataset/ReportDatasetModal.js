import { FlagOutlined } from "@ant-design/icons";
import { Button, Modal, Typography, Form, Input, Radio, Space } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useState } from "react";

export default function ReportDatasetModal({ dataset_name }) {
  const [form] = useForm();
  const [isModalShow, setIsModalShow] = useState(false);

  return (
    <>
      <Modal
        title="What's happening ?"
        open={isModalShow}
        onOk={null}
        onCancel={() => setIsModalShow(false)}
        okText="Report"
      >
        <Form form={form} className="mt-5" layout="vertical">
          <Form.Item
            name="topic"
            rules={[
              { required: true, message: "Please choose the topic of report." },
            ]}
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="spam">Spam</Radio>
                <Radio value="sharing-personal-information">
                  Sharing personal information
                </Radio>
                <Radio value="hate">Hate</Radio>
                <Radio value="copyright">Copyright violation</Radio>
                <Radio value="threatening-violence">Threatening violence</Radio>
                <Radio value="harassment">Harassment</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="It's something else" name="description">
            <Input.TextArea
              placeholder="Let us know what's hoing on"
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Button
        icon={<FlagOutlined />}
        type="ghost"
        danger={true}
        style={{ color: "red" }}
        onClick={() => setIsModalShow(true)}
      />
    </>
  );
}
