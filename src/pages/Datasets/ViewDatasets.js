import { useParams } from "react-router-dom";
import { ContainerOutlined } from "@ant-design/icons";
import { Space, Typography, Image, Row, Col, Divider, Tabs } from "antd";

// import components
import ResourceView from "../../components/Datasets/ResourceView";
import InformationView from "../../components/Datasets/InformationView";
import DiscussionView from "../../components/Discussion/DiscussionView";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

export default function ViewDatasets() {
  document.title = "Datasets";
  const { datasets_name } = useParams();

  // call axios here

  return (
    <>
      <div className="container mx-auto">
        <Row
          justify="space-between"
          align="center"
          gutter={[18, 18]}
          className="my-5"
        >
          <Col md={18}>
            <Title level={2}>Retail store computer hardware inventory 💀</Title>
            <Paragraph
              ellipsis={{
                rows: 2,
                symbol: "more",
              }}
            >
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English. Many desktop
              publishing packages and web page editors now use Lorem Ipsum as
              their default model text, and a search for 'lorem ipsum' will
              uncover many web sites still in their infancy. Various versions
              have evolved over the years, sometimes by accident, sometimes on
              purpose (injected humour and the like).
            </Paragraph>
          </Col>
          <Col md={6}>
            <Image
              src="https://cdn.akamai.steamstatic.com/steam/apps/271590/capsule_616x353.jpg?t=1678296348"
              alt="datasets thumbnail"
              className="rounded-md self-center"
            />
          </Col>
        </Row>
      </div>

      <Divider />

      <section className="container mx-auto">
        <Tabs defaultActiveKey="1" size="large">
          <TabPane tab="Data" key="1">
            <Row gutter={18}>
              <Col sm={24} md={20}>
                <ResourceView />
              </Col>
              <Col sm={24} md={4}>
                <InformationView />
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Discussion" key="2">
            <DiscussionView />
          </TabPane>
        </Tabs>
      </section>
    </>
  );
}
