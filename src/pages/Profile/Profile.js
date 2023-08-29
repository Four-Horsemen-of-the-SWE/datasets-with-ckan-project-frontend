import { useParams } from "react-router-dom";
import { useCreateModalStore } from "../../store";
import {
  PlusOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  EyeInvisibleOutlined
} from "@ant-design/icons";
import { Avatar, Button, Col, Divider, Empty, Row, Space, Spin, Typography, List, Tabs, Tag, Badge } from "antd";
import { useEffect, useState } from "react";
import { useIsAuthenticated, useAuthHeader, useAuthUser } from "react-auth-kit";
import { useLocation } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const { TabPane } = Tabs;
const { Title, Text, Paragraph } = Typography;

export default function Profile() {
  document.title = "Datasets";

  const location = useLocation();
  const { username } = useParams();
  const currentTab = location.pathname.split("/")[3];

  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();
  const config =
    auth()?.name === username
      ? {
          headers: {
            Authorization: authHeader()?.slice(" ")[1],
          },
        }
      : {};
  
  // user details
  const [userDetails, setUserDetails] = useState({});
  // user's bookmarks state. AMBATUKAMMMMMM
  const [bookmarks, setBookmark] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const { isCreateModalShow, setIsCreateModalShow } = useCreateModalStore();

  const handleTabChange = (key) => {
    const baseURL = `/profile/${auth().name}`;
    if (key === "datasets")
      window.history.pushState(null, "", `${baseURL}/datasets`);
    else if (key === "bookmarks")
      window.history.pushState(null, "", `${baseURL}/bookmarks`);
    else if (key === "reports")
      window.history.pushState(null, "", `${baseURL}/reports`);
  };

  useEffect(() => {
    // fetchUserDetails();
    const fetchDataFromAPI = async () => {
      const userDetailsAPI = `${process.env.REACT_APP_CKAN_API_ENDPOINT}/users/${username}`;
      const userBookmarkAPI = `${process.env.REACT_APP_CKAN_API_ENDPOINT}/users/bookmark`;

      try {
        const [
          userDetailsResponse,
          userBookmarkResponse,
        ] = await Promise.all([
          axios.get(userDetailsAPI, config),
          axios.get(userBookmarkAPI, config),
        ]);

        if (userDetailsResponse.data.ok) {
          setUserDetails(userDetailsResponse.data.result);
          setIsLoading(false);
        }

        if (userBookmarkResponse.data.ok) {
          setBookmark(userBookmarkResponse.data.result);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDataFromAPI();
  }, []);

  if (isLoading) {
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
            {/* user details */}
            <Col xs={24} xl={6} className="text-center">
              <Avatar
                src={userDetails.image_display_url}
                size={256}
                className="ring-4"
              />
              <Title level={2}>{userDetails.fullname}</Title>
              <Title level={4} type="secondary">
                {userDetails.about ? userDetails.about : "No Bio"}
              </Title>

              {auth()?.id === userDetails.id && (
                <>
                  <Divider>Options</Divider>

                  <div className="flex gap-3 items-center justify-between">
                    <Button
                      icon={<PlusOutlined />}
                      size="large"
                      type="primary"
                      className="w-full"
                      onClick={() => setIsCreateModalShow(!isCreateModalShow)}
                    >
                      Create Datasets
                    </Button>
                    <Button
                      icon={<EditOutlined />}
                      size="large"
                      type="dashed"
                      className="w-full"
                    >
                      Edit Profile
                    </Button>
                  </div>
                </>
              )}
            </Col>

            {/* data */}
            <Col xs={24} xl={18}>
              <Tabs
                defaultActiveKey={currentTab}
                size="large"
                onChange={handleTabChange}
              >
                {/* datasets */}
                <TabPane tab="Datasets" key="datasets">
                  {/* render user's datasets here */}
                  <List
                    size="small"
                    bordered
                    dataSource={userDetails?.datasets}
                    className="mt-3"
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          title={
                            <Space>
                              <a href={`/datasets/${item.id}`}>{item.name}</a>
                              {item.private && (
                                <Tag color="#FD0000">Private</Tag>
                              )}
                            </Space>
                          }
                          description={
                            item.notes ? (
                              <Paragraph ellipsis={{ rows: 1 }}>
                                {item.notes}
                              </Paragraph>
                            ) : (
                              "No Description"
                            )
                          }
                        />
                      </List.Item>
                    )}
                  />
                </TabPane>

                {/* bookmarks */}
                <TabPane tab="Bookmarks" key="bookmarks">
                  {/* render user's bookmarks here */}
                  {bookmarks.length ? (
                    <List
                      size="small"
                      bordered
                      dataSource={bookmarks}
                      className="mt-3"
                      renderItem={(item, index) => (
                        <List.Item>
                          <List.Item.Meta
                            title={
                              <a href={`/datasets/${item.name}`}>{item.name}</a>
                            }
                            description={
                              item.notes ? (
                                <Paragraph ellipsis={{ rows: 1 }}>
                                  {item.notes}
                                </Paragraph>
                              ) : (
                                "No Description"
                              )
                            }
                          />
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty description="No Bookmarked Datasets" />
                  )}
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </section>
      </>
    );
  }
}
