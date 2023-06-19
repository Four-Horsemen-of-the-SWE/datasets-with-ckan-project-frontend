import { useCreateModalStore } from "../../store";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Row, Space, Typography } from "antd";
import { useIsAuthenticated } from "react-auth-kit";

const { Title } = Typography;

export default function Profile() {
  const { isCreateModalShow, setIsCreateModalShow } = useCreateModalStore();
  const isAuthenticated = useIsAuthenticated();

  return (
    <>
      <section className="container mx-auto">
        <Row gutter={[32, 15]} justify="space-between" className="my-10">
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

            {isAuthenticated() && (
              <>
                <Divider>Options</Divider>

                <Space direction="vertical" className="w-full">
                  <Button
                    icon={<PlusOutlined />}
                    size="large"
                    type="primary"
                    block
                    onClick={() => setIsCreateModalShow(!isCreateModalShow)}
                  >
                    Create Datasets
                  </Button>
                  <Button
                    icon={<EditOutlined />}
                    size="large"
                    type="dashed"
                    block
                  >
                    Edit Profile
                  </Button>
                </Space>
              </>
            )}
          </Col>
          <Col xs={24} xl={18}>
            {/* datasets */}
            <Card className="mb-3">
              <Title level={4} type="secondary" style={{ margin: 0 }}>
                Datasets
              </Title>

              <Card
                bordered={false}
                type="inner"
                className="my-3 bg-[#7f767617] border border-slate-400 block"
              >
                <div>Ambatukam datasets</div>
              </Card>
            </Card>

            {/* bookmarked */}
            <Card className="mb-3">
              <Title level={4} type="secondary" style={{ margin: 0 }}>
                Bookmark
              </Title>

              <Card
                bordered={false}
                type="inner"
                className="my-3 bg-[#7f767617] border border-slate-400 block"
              >
                <div>Ambatukam datasets</div>
              </Card>
            </Card>
          </Col>
        </Row>
      </section>
    </>
  );
}
