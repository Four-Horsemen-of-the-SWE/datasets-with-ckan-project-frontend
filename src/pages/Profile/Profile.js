import { useParams } from "react-router-dom";
import { useCreateModalStore } from "../../store";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Divider, Empty, Row, Space, Spin, Typography, List, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useIsAuthenticated, useAuthHeader, useAuthUser } from "react-auth-kit";
import { useLocation } from "react-router-dom";
import axios from "axios";

const { TabPane } = Tabs;
const { Title, Paragraph } = Typography;

export default function Profile() {
  document.title = "Datasets";

  const location = useLocation();
  const currentTab = location.pathname.split("/")[3];

  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();
  const JWTToken = authHeader().split(" ")[1];

  const { username } = useParams();
  const [userDetails, setUserDetails] = useState({});

  // user's datasets and their bookmarks state here
  const [datasets, setDatasets] = useState([]);
  const [bookmarks, setBookmark] = useState([]);
  // user's datasets and their bookmarks state. AMBATUKAMMMMMM

  const [isLoading, setIsLoading] = useState(true);
  const { isCreateModalShow, setIsCreateModalShow } = useCreateModalStore();

  useEffect(() => {
    // fetchUserDetails();
    const fetchDataFromAPI = async () => {
      const userDetailsAPI = `${process.env.REACT_APP_CKAN_API_ENDPOINT}/users/${username}`;
      const userDatasetsAPI = `${process.env.REACT_APP_CKAN_API_ENDPOINT}/users/datasets`;
      const userBookmarkAPI = `${process.env.REACT_APP_CKAN_API_ENDPOINT}/users/bookmark`;

      try {
        const [
          userDetailsResponse,
          userDatasetsResponse,
          userBookmarkResponse,
        ] = await Promise.all([
          axios.get(userDetailsAPI),
          axios.get(
            userDatasetsAPI,
            {
              headers: {
                Authorization: JWTToken,
              },
            },
            {}
          ),
          axios.get(
            userBookmarkAPI,
            {
              headers: {
                Authorization: JWTToken,
              }
            }
          ),
        ]);

        if (userDetailsResponse.data.ok) {
          setUserDetails(userDetailsResponse.data.result);
          setIsLoading(false);
        }

        if (userDatasetsResponse.data.ok) {
          setDatasets(userDatasetsResponse.data.result);
        }

        console.log(userBookmarkResponse.data)
        if (userBookmarkResponse.data.ok) {
          setBookmark(userBookmarkResponse.data.result);
        }
        
      } catch(error) {
        console.log(error)
      }
    }

    fetchDataFromAPI()
  }, []);

  const handleTabChange = (key) => {
    const baseURL = `/profile/${auth().name}`;
    if (key === "datasets")
      window.history.pushState(null, "", `${baseURL}/datasets`);
    else if (key === "bookmarks") 
      window.history.pushState(null, "", `${baseURL}/bookmarks`);
  };

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

                  <Space className="w-full">
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
                  </Space>
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
                <TabPane ane tab="Datasets" key="datasets">
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
                              <a href={`/datasets/${item.id}`}>{item.name}</a>
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

                {/* articles */}
                <TabPane
                  tab="Articles"
                  key="articles"
                  disabled={true}
                ></TabPane>
              </Tabs>
            </Col>
          </Row>
        </section>
      </>
    );
  }
}
