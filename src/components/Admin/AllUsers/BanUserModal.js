import { Modal, Form, Input, Radio, Space } from 'antd';
import { useAuthUser } from "react-auth-kit";
import React, { useState } from 'react';

export default function BanUserModal({ user_id, open, close }) {
  const auth = useAuthUser();
  const [form] = Form.useForm();

  if(auth()?.id !== user_id) {
    return (
      <>
        <Modal
          title="Ban this user"
          open={open}
          okText="Ban this user"
          okButtonProps={{
            danger: true,
          }}
          onCancel={close}
        >
          <Form form={form} className="mt-5" layout="vertical">
            <Form.Item
              name="topic"
              rules={[
                {
                  required: true,
                  message: "Please choose the topic of report.",
                },
              ]}
            >
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="spam">Spam</Radio>
                  <Radio value="hate">Hate</Radio>
                  <Radio value="copyright">Copyright violation</Radio>
                  <Radio value="threatening-violence">
                    Threatening violence
                  </Radio>
                  <Radio value="harassment">Harassment</Radio>
                  <Radio value="illegal-activitie">Illegal Activities</Radio>
                  <Radio value="malicious-intent">Malicious Intent</Radio>
                  <Radio value="spam-and-unwanted-conten">
                    Spam and Unwanted Content
                  </Radio>
                  <Radio value="misinformation-and-fake-news">
                    Misinformation and Fake News
                  </Radio>
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

        
      </>
    );
  }
}
