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
  Image
} from "antd";
import ImgCrop from "antd-img-crop";

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

export default function DatasetsSettings() {
  return (
    <div className="container mx-auto">
      <Title level={3}>Settings</Title>

      <Title level={4}>General</Title>

      <Form layout="vertical">
        <Form.Item label="Name" name="title">
          <Input
            showCount
            maxLength={100}
            placeholder="The name of the new dataset"
            size="large"
          />
        </Form.Item>

        <Form.Item label="URL" name="url">
          <Input.TextArea
            rows={4}
            placeholder="A URL for the dataset’s source"
          />
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
                  options={null}
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
        <Form.Item name="thumbnail">
          <Row gutter={20}>
            <Col>
              <Image
                height={226}
                src="http://localhost:81/uploads/datasets-thumbnail/a41ed3b6-7085-4a18-9d2c-7b89b2cf2bb8_datasets-thumbnail_2023-07-06-10-13-54.jpg"
                className="rounded-lg"
              />
            </Col>
            <Col>
              <Typography.Title level={5}>
                Change Thumbnail Image
              </Typography.Title>
              <ImgCrop>
                <Upload accept="image/png, image/jpeg" directory={false}>
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
