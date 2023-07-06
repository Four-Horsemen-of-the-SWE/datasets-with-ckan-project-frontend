import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Typography,
  Upload,
  Image,
  message
} from "antd";
import ImgCrop from "antd-img-crop";
import { useAuthHeader } from "react-auth-kit";
import { useState } from "react";
import axios from "axios";

const { Title } = Typography;

const visibility_data = [
  {
    value: true,
    label: "Private",
  },
  {
    value: false,
    label: "Public",
  },
];

export default function DatasetsSettings({ datasets }) {
  const [thumbnail, setThumbnail] = useState(datasets?.thumbnail);
  const authHeader = useAuthHeader();

  const all_tags = datasets?.tags.map(item => ({ label: item.display_name, value: item.name }));

  const [defailed_form] = Form.useForm();

  const props = {
    headers: {
      Authorization: authHeader().split(" ")[1],
    },
    action: `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/${datasets.id}/thumbnail`,
    name: "thumbnail_image",
    onChange(info) {
      if (info.file.status !== "uploading") {
        message.info(`${info.file.name} uploading`);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <div className="container mx-auto">
      <Title level={3}>Settings</Title>

      <Title level={4}>General</Title>

      <Form
        layout="vertical"
        form={defailed_form}
        initialValues={{
          title: datasets.title,
          url: datasets?.url,
          notes: datasets.notes,
          private: datasets.private,
          tags: datasets?.tags.map((item) => ({
            label: item.display_name,
            value: item.name,
          })),
          version: datasets?.version,
        }}
      >
        <Form.Item label="Name" name="title">
          <Input
            showCount
            maxLength={100}
            placeholder="The name of the new dataset"
            size="large"
          />
        </Form.Item>

        <Form.Item label="URL" name="url">
          <Input size="large" placeholder="A URL for the dataset’s source" />
        </Form.Item>

        <Form.Item label="Description" name="notes">
          <Input.TextArea rows={4} placeholder="Description" />
        </Form.Item>

        <Form.Item label="Others">
          <Row gutter={8}>
            <Col span={8}>
              <Form.Item label="Visibility" name="private">
                <Select
                  defaultValue={false}
                  size="large"
                  options={visibility_data}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Tags" name="tags">
                <Select
                  mode="tags"
                  placeholder="Tags"
                  size="large"
                  options={all_tags}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Version" name="version">
                <Input size="large" placeholder="1.0.0" />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item>
          <Button type="primary" size="large" block>
            Save
          </Button>
        </Form.Item>
      </Form>

      <Divider />

      <Form layout="vertical">
        <Title level={4}>Thumbnail</Title>
        <Form.Item name="thumbnail">
          <Row gutter={20} align="middle">
            <Col>
              <Image height={70} src={thumbnail} className="rounded-lg" />
            </Col>
            <Col>
              <Typography.Title level={5} style={{ marginTop: 0 }}>
                Change Thumbnail Image
              </Typography.Title>
              <ImgCrop>
                <Upload
                  {...props}
                  accept="image/png, image/jpeg"
                  directory={false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Upload New Image</Button>
                </Upload>
              </ImgCrop>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </div>
  );
}

/*
<ImgCrop>
                <Upload
                  customRequest={handleUpload}
                  accept="image/png, image/jpeg"
                  directory={false}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Upload New Image</Button>
                </Upload>
              </ImgCrop>
*/