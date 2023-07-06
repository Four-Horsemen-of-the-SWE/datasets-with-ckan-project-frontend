import { useParams } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { MoreOutlined, EditOutlined, StarOutlined } from "@ant-design/icons";
import { Typography, Image, Row, Col, Divider, Tabs, Spin, Button, Dropdown } from "antd";
import { useIsAuthenticated, useAuthUser } from "react-auth-kit";

// import components
import ResourceView from "../../components/Datasets/ResourceView";
import InformationView from "../../components/Datasets/InformationView";
import DiscussionView from "../../components/Discussion/DiscussionView";
import { useEffect, useState } from "react";
import axios from "axios";
import DatasetsSettings from "../../components/Datasets/DatasetsSettings";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const items = [
  {
    key: "1",
    label: <Text>Bookmark</Text>,
    icon: <StarOutlined />,
  },
  {
    key: "2",
    label: <Text>Edit Dataset</Text>,
    icon: <EditOutlined />,
  },
  {
    type: 'divider'
  },
  {
    key: "3",
    label: <Text>Delete Dataset</Text>,
    danger: true,
  }
];

export default function ViewDatasets() {
  document.title = "Datasets";
  const { datasets_id } = useParams();
  const [datasets, setDatasets] = useState({});
  const [isLoading ,setIsLoading] = useState(true);
  const location = useLocation();
  // const currentTab = location.pathname.split('/')[3] === "discussions" ? "discussions" : "data";
  const currentTab = location.pathname.split("/")[3];

  const auth = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  
  const fetchDatasets = async() => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/${datasets_id}`
      );

      if (response.status === 200) {
        setDatasets(response.data.result);
        setIsLoading(false);
      }
    } catch(error) {
      console.log(error)
    }
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
        {isAuthenticated() && (
          <div className="container mx-auto mt-4 w-100 flex justify-end">
            <Dropdown
              menu={{
                items,
              }}
              trigger={["click"]}
              placement="bottomLeft"
            >
              <Button size="large">
                <MoreOutlined />
              </Button>
            </Dropdown>
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
              <DiscussionView dataset_id={datasets.id} />
            </TabPane>
            {auth().id === datasets.creator_user_id && (
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
