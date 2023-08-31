import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { StarOutlined, WarningFilled, DatabaseOutlined, DeleteOutlined } from "@ant-design/icons";
import { Typography, Image, Row, Col, Divider, Tabs, Spin, Button, message, Breadcrumb, Space, Result, Alert, Tooltip } from "antd";
import { useIsAuthenticated, useAuthUser, useAuthHeader } from "react-auth-kit";
import axios from "axios";

// import components
import ResourceView from "../../components/Datasets/ResourceView";
import InformationView from "../../components/Datasets/InformationView";
import DiscussionView from "../../components/Discussion/DiscussionView";
import DatasetsSettings from "../../components/Datasets/DatasetsSettings";
import { useResourcesStore } from "../../store";
import ArticleView from "../../components/Article/ArticleView";
import AdminDeleteModal from "../../components/Datasets/AdminDeleteModal";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

export default function ViewDatasets() {
  const { datasets_id } = useParams();
  // states
  const [datasets, setDatasets] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmark, setIsBookmark] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [isNotAuthorized, setIsNotAuthorized] = useState(false);
  const [isNotActive, setIsNotActive] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { resources, setResources } = useResourcesStore();

  // admin state
  const [isAdminDeleteModalShow, setIsAdminDeleteModalShow] = useState(false);

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
        if (response.data?.active === false) {
          setIsLoading(false);
          return setIsNotActive(true);
        }

        if (response.data?.is_authorized === false) {
          setIsLoading(false);
          return setIsNotAuthorized(true);
        }
        setDatasets(response.data.result);
        setIsBookmark(response.data.result?.is_bookmark);

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
    else if (key === "settings") window.history.pushState(null, "", `${baseURL}/settings`);
    else if (key === "article") window.history.pushState(null, "", `${baseURL}/article`);
  };

  if (isLoading) {
    return (
      <div className="w-100 h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isNotActive) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Result
          status="warning"
          title="Dataset not found"
          extra={
            <Link to="/datasets">
              <Button type="primary">Back to all datasets page.</Button>
            </Link>
          }
        />
      </div>
    );
  }
  
  if (isNotAuthorized) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Result
          status="warning"
          title="You Don't have Authorization to View this Dataset"
          extra={
            <Link to="/datasets">
              <Button type="primary">Back to all datasets page.</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <>
      <AdminDeleteModal 
        dataset_id={datasets.id}
        dataset_name={datasets.name}
        open={isAdminDeleteModalShow}
        close={() => setIsAdminDeleteModalShow(false)}
      />

      {contextHolder}
      {datasets.private && (
        <Alert
          showIcon={false}
          message={
            <div className="container mx-auto text-center">
              <Space>
                <WarningFilled className="text-[#FAAD14]" />
                Other people will not be able to view this data set. Because
                this dataset is a private dataset.
              </Space>
            </div>
          }
          banner={true}
        />
      )}
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
        {isAuthenticated() && !auth()?.is_admin && (
          <Space>
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
          </Space>
        )}

        {/* delete dataset for admin */}
        {auth()?.is_admin && (
          <Tooltip title="Please consider before deleting.">
            <Button icon={<DeleteOutlined />} type="primary" danger={true} onClick={() => setIsAdminDeleteModalShow(true)}>Delete dataset</Button>
          </Tooltip>
        )}
      </div>

      <div className="container mx-auto">
        <Row
          justify="space-between"
          align="center"
          gutter={[10, 10]}
          className="my-5 w-full"
        >
          <Col sm={18} className="">
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
          <Col sm={6} className="w-full text-center md:text-right">
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
            <Row gutter={[10, 10]} justify="space-between" align="center">
              <Col sm={24} lg={18}>
                <ResourceView
                  creator_user_id={datasets.creator_user_id}
                  dataset_id={datasets.id}
                  resource={resources}
                />
              </Col>
              <Col sm={24} lg={4}>
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
          <TabPane tab="Article" key="article">
            <ArticleView
              dataset_id={datasets?.id}
              creator_user_id={datasets.creator_user_id}
            />
          </TabPane>
        </Tabs>
      </section>
    </>
  );
}
