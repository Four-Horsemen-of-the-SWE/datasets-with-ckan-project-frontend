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
  const currentTab = location.pathname.split("/")[3];

  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();
  const config = {
    headers: {
      Authorization: authHeader().split(" ")[1]
    }
  }

  const { username } = useParams();
  
  // user details
  const [userDetails, setUserDetails] = useState({});
  // user's datasets state here
  const [datasets, setDatasets] = useState([]);
  // user's bookmarks state. AMBATUKAMMMMMM
  const [bookmarks, setBookmark] = useState([]);
  // user's reports
  const [reports, setReports] = useState([]);

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

  const tagIconDisplay = (status) => {
    if(status === "open") {
      return <Tag icon={<ClockCircleOutlined />}>{status}</Tag>
    } else if(status === "processing") {
      return <Tag icon={<SyncOutlined />}>{status}</Tag>;
    } else if(status === "success") {
      return <Tag icon={<CheckCircleOutlined />}>{status}</Tag>;
    } else if(status === "reject") {
      return <Tag icon={<CloseCircleOutlined />}>{status}</Tag>;
    }
  }

  useEffect(() => {
    // fetchUserDetails();
    const fetchDataFromAPI = async () => {
      const userDetailsAPI = `${process.env.REACT_APP_CKAN_API_ENDPOINT}/users/${username}`;
      const userDatasetsAPI = `${process.env.REACT_APP_CKAN_API_ENDPOINT}/users/datasets`;
      const userBookmarkAPI = `${process.env.REACT_APP_CKAN_API_ENDPOINT}/users/bookmark`;
      const userReportAPI = `${process.env.REACT_APP_CKAN_API_ENDPOINT}/reports/me`;

      try {
        const [
          userDetailsResponse,
          userDatasetsResponse,
          userBookmarkResponse,
          userReportResponse,
        ] = await Promise.all([
          axios.get(userDetailsAPI),
          axios.get(userDatasetsAPI, config, {}),
          axios.get(userBookmarkAPI, config),
          axios.get(userReportAPI, config)
        ]);

        if (userDetailsResponse.data.ok) {
          setUserDetails(userDetailsResponse.data.result);
          setIsLoading(false);
        }

        if (userDatasetsResponse.data.ok) {
          setDatasets(userDatasetsResponse.data.result);
        }

        if (userBookmarkResponse.data.ok) {
          setBookmark(userBookmarkResponse.data.result);
        }

        if (userReportResponse.data.ok) {
          setReports(userReportResponse.data.result);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDataFromAPI();
  }, []);

  console.log(datasets)

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
                  {datasets.length ? (
                    <List
                      size="small"
                      bordered
                      dataSource={datasets}
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
                  ) : (
                    <Empty description="No Datasets" />
                  )}
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

                {/* my reports */}
                {userDetails.id === auth()?.id && (
                  <TabPane tab="My Reports" key="reports">
                    <List
                      size="small"
                      bordered
                      dataSource={reports}
                      className="mt-3"
                      pagination={true}
                      renderItem={(item, index) => (
                        <List.Item className="flex items-center justify-between">
                          <Space direction="vertical" style={{ gap: "0px" }}>
                            <Text strong>{item.topic}</Text>
                            <Text>
                              {item.description.length
                                ? item.description
                                : "No Description."}
                            </Text>
                          </Space>
                          <Space>
                            {tagIconDisplay(item.status)}
                            {moment(item.updated_at).format("MMM Do YY")}
                          </Space>
                        </List.Item>
                      )}
                    />
                  </TabPane>
                )}
              </Tabs>
            </Col>
          </Row>
        </section>
      </>
    );
  }
}
