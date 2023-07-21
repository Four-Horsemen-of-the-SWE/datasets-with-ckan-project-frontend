import { useParams } from "react-router-dom";
import { useCreateModalStore } from "../../store";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Divider, Empty, Row, Space, Spin, Typography, List } from "antd";
import { useEffect, useState } from "react";
import { useIsAuthenticated, useAuthHeader, useAuthUser } from "react-auth-kit";
import axios from "axios";

const { Title, Paragraph } = Typography;

export default function Profile() {
  document.title = "Datasets";

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
              <Title level={4} type="secondary" style={{ margin: 0 }}>
                Datasets
              </Title>

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

              <Divider />

              {/* bookmarks */}
              <Title level={4} type="secondary" style={{ margin: 0 }}>
                Bookmark
              </Title>

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
            </Col>
          </Row>
        </section>
      </>
    );
  }
}
