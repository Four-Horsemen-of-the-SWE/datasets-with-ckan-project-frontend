import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Divider, Row, Space, Typography } from "antd";

const { Title, Text } = Typography;

export default function Profile() {
  return (
    <>
      <section className="container mx-auto">
        <Row gutter={32} justify="space-between" className="my-10">
          <Col xs={24} xl={6} className="text-center">
            <img
              src="https://www.cameo.com/cdn-cgi/image/fit=cover,format=auto,width=300,height=300/https://cdn.cameo.com/resizer/Y7IzCEs_m-F80605DB-EDCE-4B71-9170-E6821D7D2633.jpg"
              alt="avatar"
              className="mx-auto rounded-full ring-4 p-1"
            />
            <Title level={2}>Mike O Hearn</Title>
            <Title level={4} type="secondary">
              - Baby don't hurt me -
            </Title>

            <Divider>
              Options
            </Divider>

            <Space direction="vertical" className="w-full">
              <Button icon={<PlusOutlined />} size="large" type="primary" block>
                Create Datasets
              </Button>
              <Button icon={<EditOutlined />} size="large" type="dashed" block>
                Edit Profile
              </Button>
            </Space>
          </Col>
          <Col xs={24} xl={18}>
            {/* datasets */}
            <Card className="mb-3">
              <Title level={4} type="secondary" style={{ margin: 0 }}>
                Datasets
              </Title>
            </Card>

            {/* bookmarked */}
            <Card className="mb-3">
              <Title level={4} type="secondary" style={{ margin: 0 }}>
                Bookmark
              </Title>
            </Card>
          </Col>
        </Row>
      </section>
    </>
  );
}
