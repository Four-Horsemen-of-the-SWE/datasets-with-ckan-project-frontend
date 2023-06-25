import { useParams } from "react-router-dom";
import { useCreateModalStore } from "../../store";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Divider, Empty, Row, Space, Spin, Typography, List } from "antd";
import { useEffect, useState } from "react";
import { useIsAuthenticated, useAuthHeader } from "react-auth-kit";
import axios from "axios";

const { Title } = Typography;

export default function Profile() {
  document.title = "Datasets";

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
      const userBookmarkAPI = `${process.env.REACT_APP_CKAN_API_ENDPOINT}/users/${username}`;

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
          // axios.get(userBookmarkAPI),
        ]);

        if (userDetailsResponse.data.ok) {
          setUserDetails(userDetailsResponse.data.result);
          setIsLoading(false);
        }

        if (userDatasetsResponse.data.ok) {
          setDatasets(userDatasetsResponse.data.result);
        }

        /*
        if (userBookmarkResponse.status === 200) {
          setUserDetails(userBookmarkResponse.data.result);
        }
        */
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
              <Title level={4} type="secondary" style={{ margin: 0 }}>
                Datasets
              </Title>

              {/* render user's datasets here */}
              {datasets.length ? (
                <List 
                  size="large"
                  bordered
                  dataSource={datasets}
                  className="mt-3"
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta 
                        title={item.name}
                        description={item.notes ? item.notes : "No Description"}
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
                datasets.map((item, key) => <p>Ambatukammmm</p>)
              ) : (
                <Empty description="No Bookmarks" />
              )}
            </Col>
          </Row>
        </section>
      </>
    );
  }
}
