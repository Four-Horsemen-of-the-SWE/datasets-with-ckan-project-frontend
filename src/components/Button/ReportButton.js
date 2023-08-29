import { FlagOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Radio, Space, message } from "antd";
import { useAuthHeader, useAuthUser } from "react-auth-kit";
import { useState } from "react";
import axios from "axios";

const ReportFormModal = ({entity_id, entity_type, entity_owner, show, close}) => {
  const [form] = Form.useForm();
  const authHeader = useAuthHeader();

  const handleReport = async() => {
    try {
      if(form.getFieldValue("topic") === undefined) {
        return message.warning("Please choose the topic of report.");
      }
      const payload = {
        entity_id: entity_id,
        entity_type: entity_type,
        entity_url: window.location.pathname,
        topic: form.getFieldValue("topic"),
        description: form.getFieldValue("description"),
        entity_owner: entity_owner,
      };
      
      const response = await axios.post(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/reports/`,
        payload,
        {
          headers: {
            Authorization: authHeader().split(" ")[1]
          }
        }
      );

      if(response.data.ok) {
        message.success('Report Success.')
        form.resetFields()
        close()
      }

    } catch(error) {
      console.log(error);
    }
  }

  return (
    <Modal
      title="What's happening ?"
      open={show}
      onOk={handleReport}
      onCancel={close}
      okText="Report"
      centered={true}
    >
      <Form form={form} className="mt-5" layout="vertical">
        <Form.Item name="topic" rules={[{ required: true, message: "Please choose the topic of report." }]}>
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="spam">Spam</Radio>
              <Radio value="sharing-personal-information">Sharing personal information</Radio>
              <Radio value="hate">Hate</Radio>
              <Radio value="copyright">Copyright violation</Radio>
              <Radio value="threatening-violence">Threatening violence</Radio>
              <Radio value="harassment">Harassment</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="It's something else" name="description">
          <Input.TextArea placeholder="Let us know what's hoing on" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

/*
  entity_id     = id of the item to be reported, id of topic, comment, article, dataset, user
  entity_type   = type. topic, comment, article, dataset, user
*/

export default function ReportButton({ entity_id, entity_type, entity_owner, show_label = true, label_color = "red", button_size = "small", button_type="ghost" }) {
  const auth = useAuthUser();
  const [showReportModal, setShowReportModal] = useState(false);

  if(!auth()?.is_admin) {
    return (
        <>
          <ReportFormModal entity_id={entity_id} entity_type={entity_type} entity_owner={entity_owner} show={showReportModal} close={() => setShowReportModal(false)} />
          <Button
            size={button_size}
            type={button_type}
            icon={<FlagOutlined />}
            style={{ color: label_color }}
            onClick={() => setShowReportModal(true)}
            danger={true}
          >
            {show_label && "Report"}
          </Button>
        </>
      );
  }
  
}