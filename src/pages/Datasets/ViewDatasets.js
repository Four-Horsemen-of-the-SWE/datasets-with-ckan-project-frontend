import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { StarOutlined, ToolOutlined } from "@ant-design/icons";
import { Typography, Image, Row, Col, Divider, Tabs, Spin, Button, Dropdown, message } from "antd";
import { useIsAuthenticated, useAuthUser, useAuthHeader } from "react-auth-kit";
import axios from "axios";

// import components
import ResourceView from "../../components/Datasets/ResourceView";
import InformationView from "../../components/Datasets/InformationView";
import DiscussionView from "../../components/Discussion/DiscussionView";
import DatasetsSettings from "../../components/Datasets/DatasetsSettings";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const items = [
  {
    key: "1",
    label: <Text>Delete</Text>,
    icon: <StarOutlined />,
    danger: true,
  },
];

export default function ViewDatasets() {
  const { datasets_id } = useParams();
  const [datasets, setDatasets] = useState({});
  const [isLoading ,setIsLoading] = useState(true);
  const [isBookmark, setIsBookmark] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const location = useLocation();
  // const currentTab = location.pathname.split('/')[3] === "discussions" ? "discussions" : "data";
  const currentTab = location.pathname.split("/")[3];

  const auth = useAuthUser();
  const authHeader = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();
  const JWTToken = authHeader().split(" ")[1];
  
  const fetchDatasets = async() => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/${datasets_id}`, {
          headers: {
            Authorization: JWTToken
          }
        }
      );

      if (response.status === 200) {
        setDatasets(response.data.result);
        setIsBookmark(response.data.result.is_bookmark);
        if(!!response.data.result) {
          document.title = response.data.result.title;
          setIsLoading(false);
        }
      }
    } catch(error) {
      console.log(error)
    }
  }

  const handleBookmark = async() => {
    try {
      setIsBookmarking(true);
      if(isBookmark) {
        unBookmarkDataset();
      } else {
        bookmarkDataset();
      }
      setIsBookmarking(false);
    } catch(error) {
      messageApi.error({
        type: "error",
        content: error.message
      })
    }
  }

  const bookmarkDataset = async() => {
    const response = await axios.post(
      `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/${datasets_id}/bookmark/`,
      {},
      {
        headers: {
          Authorization: JWTToken,
        },
      }
    );

    if(response.data.ok)
      setIsBookmark(true);

    console.log(response);
  }

  const unBookmarkDataset = async() => {
    const response = await axios.delete(
      `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/${datasets_id}/bookmark`,
      {
        headers: {
          Authorization: JWTToken,
        },
      }
    );

    if(response.data.ok)
      setIsBookmark(false);

    console.log(response);
  }

  // call axios here
  useEffect(() => {
    fetchDatasets()
  }, [])

  const handleTabChange = (key) => {
    const baseURL = `/datasets/${datasets_id}`
    if(key === 'discussions')
      window.history.pushState(null, "", `${baseURL}/discussions`)
    else if(key === 'data')
      window.history.pushState(null, "", `${baseURL}`);
    else if(key === 'settings')
      window.history.pushState(null, "", `${baseURL}/settings`);
  }

  if(isLoading) {
    return (
      <div className="w-100 h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  } else {
    return (
      <>
        {contextHolder}
        {isAuthenticated() && (
          <div className="container mx-auto mt-4 w-100 flex justify-end gap-2 pe-9">
            <Button
              type="primary"
              ghost={!isBookmark}
              size="large"
              icon={<StarOutlined />}
              loading={isBookmarking}
              onClick={() => handleBookmark()}
            >
              Bookmark
            </Button>
            {auth()?.is_admin && (
              <Dropdown
                menu={{
                  items,
                }}
                trigger={["click"]}
                placement="bottomLeft"
              >
                <Button size="large" danger>
                  <ToolOutlined />
                </Button>
              </Dropdown>
            )}
          </div>
        )}

        <div className="container mx-auto">
          <Row
            justify="space-between"
            align="center"
            gutter={[18, 18]}
            className="my-5 w-full"
          >
            <Col md={18}>
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
            <Col md={6} className="w-full text-center md:text-right">
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

        <section className="container mx-auto">
          <Tabs
            defaultActiveKey={currentTab}
            onChange={handleTabChange}
            size="large"
          >
            <TabPane tab="Data" key="data">
              <Row gutter={18}>
                <Col sm={24} md={20}>
                  <ResourceView resource={datasets?.resources} />
                </Col>
                <Col sm={24} md={4}>
                  <InformationView
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
              <DiscussionView dataset_id={datasets?.id} />
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
