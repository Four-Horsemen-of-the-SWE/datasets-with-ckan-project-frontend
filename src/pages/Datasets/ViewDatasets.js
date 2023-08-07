import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { StarOutlined, ToolOutlined, DatabaseOutlined } from "@ant-design/icons";
import { Typography, Image, Row, Col, Divider, Tabs, Spin, Button, Dropdown, message, Breadcrumb, Space } from "antd";
import { useIsAuthenticated, useAuthUser, useAuthHeader } from "react-auth-kit";
import axios from "axios";

// import components
import ResourceView from "../../components/Datasets/ResourceView";
import InformationView from "../../components/Datasets/InformationView";
import DiscussionView from "../../components/Discussion/DiscussionView";
import DatasetsSettings from "../../components/Datasets/DatasetsSettings";
import { useResourcesStore } from "../../store";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

export default function ViewDatasets() {
  const { datasets_id } = useParams();
  // states
  const [datasets, setDatasets] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmark, setIsBookmark] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { resources, setResources } = useResourcesStore();

  const location = useLocation();
  const currentTab = location.pathname.split("/")[3];

  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();
  const JWTToken = authHeader().split(" ")[1];

  const fetchDatasets = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/${datasets_id}`,
        {
          headers: {
            Authorization: JWTToken,
          },
        }
      );

      if (response.status === 200) {
        setDatasets(response.data.result);
        setIsBookmark(response.data.result.is_bookmark);

        if (!!response.data.result) {
          document.title = response.data.result.title;
          setResources(response.data.result?.resources);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookmark = async () => {
    try {
      setIsBookmarking(true);
      if (isBookmark) {
        unBookmarkDataset();
      } else {
        bookmarkDataset();
      }
      setIsBookmarking(false);
    } catch (error) {
      messageApi.error({
        type: "error",
        content: error.message,
      });
    }
  };

  const bookmarkDataset = async () => {
    const response = await axios.post(
      `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/${datasets_id}/bookmark/`,
      {},
      {
        headers: {
          Authorization: JWTToken,
        },
      }
    );

    if (response.data.ok) setIsBookmark(true);

    console.log(response);
  };

  const unBookmarkDataset = async () => {
    const response = await axios.delete(
      `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/${datasets_id}/bookmark`,
      {
        headers: {
          Authorization: JWTToken,
        },
      }
    );

    if (response.data.ok) setIsBookmark(false);

    console.log(response);
  };

  // call axios here
  useEffect(() => {
    fetchDatasets();
  }, []);

  // remove store
  useEffect(() => {
    return () => setResources([]);
  }, []);

  const handleTabChange = (key) => {
    const baseURL = `/datasets/${datasets_id}`;
    if (key === "discussions")
      window.history.pushState(null, "", `${baseURL}/discussions`);
    else if (key === "data") window.history.pushState(null, "", `${baseURL}`);
    else if (key === "settings")
      window.history.pushState(null, "", `${baseURL}/settings`);
  };

  if (isLoading) {
    return (
      <div className="w-100 h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  } else {
    return (
      <>
        {contextHolder}
        <div className="container mx-auto mt-4 w-100 flex justify-between items-center gap-2 pe-9">
          {/* breadcrumb */}
          <Breadcrumb
            items={[
              {
                title: (
                  <>
                    <DatabaseOutlined />
                    <Link to="/datasets">Datasets</Link>
                  </>
                ),
              },
              {
                title: datasets.name,
              },
            ]}
          />

          {/* bookmark button */}
          {isAuthenticated() && (
            <Button
              type="primary"
              ghost={!isBookmark}
              size="large"
              icon={<StarOutlined />}
              loading={isBookmarking}
              onClick={() => handleBookmark()}
            >
              {isBookmark ? "Bookmarked" : "Bookmark"}
            </Button>
          )}
        </div>

        <div className="container mx-auto">
          <Row
            justify="space-between"
            align="center"
            gutter={[18, 18]}
            className="my-5 w-full"
          >
            <Col md={18} className="ml-8 mr-8">
              <Title level={2}>{datasets.title}</Title>
              <Paragraph
                ellipsis={{
                  rows: 6,
                  expandable: true,
                  symbol: "more",
                }}
              >
                {datasets.notes ? datasets.notes : "No Description"}
              </Paragraph>
            </Col>
            <Col md={4} className="w-full text-center md:text-right ml-6 mr-6">
              <Image
                src={datasets.thumbnail}
                alt="datasets thumbnail"
                className="rounded-md mx-auto block"
                height={200}
              />
            </Col>
          </Row>
        </div>

        <Divider />

        <section className="container mx-auto pl-4 pr-4 ">
          <Tabs
            defaultActiveKey={currentTab}
            onChange={handleTabChange}
            size="large"
          >
            <TabPane tab="Data" key="data">
              <Row gutter={18}>
                <Col sm={24} md={18} className="ml-8 mr-8">
                  <ResourceView
                    creator_user_id={datasets.creator_user_id}
                    dataset_id={datasets.id}
                    resource={resources}
                  />
                </Col>
                <Col sm={24} md={4} className="ml-5 mr-5">
                  <InformationView
                    dataset_id={datasets.id}
                    author={datasets.author}
                    license_title={datasets.license_title}
                    version={datasets.version}
                    metadata_created={datasets.metadata_created}
                    metadata_modified={datasets.metadata_modified}
                    tags={datasets.tags}
                  />
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Discussion" key="discussions">
              <DiscussionView
                dataset_id={datasets?.id}
                dataset_creator_user_id={datasets?.creator_user_id}
              />
            </TabPane>
            {auth()?.id === datasets?.creator_user_id && (
              <TabPane tab="Settings" key="settings">
                <DatasetsSettings datasets={datasets} />
              </TabPane>
            )}
          </Tabs>
        </section>
      </>
    );
  }
}
