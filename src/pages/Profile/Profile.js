import { useParams } from "react-router-dom";
import { useCreateModalStore } from "../../store";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Divider, Row, Space, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { useIsAuthenticated } from "react-auth-kit";
import axios from "axios";

const { Title } = Typography;

export default function Profile() {
  document.title = "Datasets";
  const { username } = useParams();
  const isAuthenticated = useIsAuthenticated();
  const [userDetails, setUserDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { isCreateModalShow, setIsCreateModalShow } = useCreateModalStore();

  const fetchUserDetails = async() => {
    const response = await axios.get(
      `${process.env.REACT_APP_CKAN_API_ENDPOINT}/users/${username}`
    );
    if(response.data.ok) {
      setUserDetails(response.data.result)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserDetails();
  }, [])

  if(isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  } else {
    return (
      <>
        <section className="container mx-auto">
          <Row gutter={[32, 15]} justify="space-between" className="my-10">
            <Col xs={24} xl={6} className="text-center">
              <Avatar src={userDetails.image_display_url} size={256} className="ring-4" />
              <Title level={2}>{userDetails.fullname}</Title>
              <Title level={4} type="secondary">
                {userDetails.about ? userDetails.about : "No Bio"}
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
}
