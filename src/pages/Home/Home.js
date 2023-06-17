import "./style.css";
import { SearchOutlined, PushpinOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Input, Row, Space, Typography } from "antd";
import DatasetsCard from "../../components/Card/DatasetsCard";

const { Title, Text } = Typography;

const datasets = [
  {
    thumbnail: "https://i.ytimg.com/vi/LgrJHDP3F_g/maxresdefault.jpg",
    title: "Geh Datasets",
    description:
      "Hello and welcome back this is the topical discussion on the morning breeze on nbs television, my name is Simon Kangualiala. We bring in the studio this morning one of the gae rights activists: mr. - should i call you Mr??- Pepe Julien Onzima, thank you for coming in, good morning WHY ARE YOU GAEH?",
    date: new Date(),
    author: "Ambatunat",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/LgrJHDP3F_g/maxresdefault.jpg",
    title: "Geh Datasets",
    description:
      "Hello and welcome back this is the topical discussion on the morning breeze on nbs television, my name is Simon Kangualiala. We bring in the studio this morning one of the gae rights activists: mr. - should i call you Mr??- Pepe Julien Onzima, thank you for coming in, good morning WHY ARE YOU GAEH?",
    date: new Date(),
    author: "Ambatunat",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/LgrJHDP3F_g/maxresdefault.jpg",
    title: "Geh Datasets",
    description:
      "Hello and welcome back this is the topical discussion on the morning breeze on nbs television, my name is Simon Kangualiala. We bring in the studio this morning one of the gae rights activists: mr. - should i call you Mr??- Pepe Julien Onzima, thank you for coming in, good morning WHY ARE YOU GAEH?",
    date: new Date(),
    author: "Ambatunat",
  },
  {
    thumbnail: "https://i.ytimg.com/vi/LgrJHDP3F_g/maxresdefault.jpg",
    title: "Geh Datasets",
    description:
      "Hello and welcome back this is the topical discussion on the morning breeze on nbs television, my name is Simon Kangualiala. We bring in the studio this morning one of the gae rights activists: mr. - should i call you Mr??- Pepe Julien Onzima, thank you for coming in, good morning WHY ARE YOU GAEH?",
    date: new Date(),
    author: "Ambatunat",
  },
];

export default function Home() {
  document.title = "Home"
  return (
    <>
      <section className="section--header w-100 h-96 flex justify-center items-center">
        <div className="container mx-auto text-center">
          <Title className="mt-0 uppercase" style={{ color: "#FFF" }}>
            Datasets Hub
          </Title>
          <Text className="block mb-5 text-white capitalize">
            The datasets community, built with CKAN.
          </Text>

          <Space>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Datasets name."
              size="large"
            />
            <Button type="primary" size="large">
              Search
            </Button>
          </Space>
        </div>
      </section>

      <section className="container mx-auto py-5">
        <Title level={2}>
          <Space>
            <PushpinOutlined />
            Newest Datasets
          </Space>
        </Title>

        <Divider />

        <Row gutter={[18, 18]}>
          {datasets.map((item, key) => (
            <Col xs={8} md={6} lg={6}>
              <DatasetsCard
                thumbnail={item.thumbnail}
                title={item.title}
                description={item.description}
                author={item.author}
              />
            </Col>
          ))}
        </Row>
      </section>
    </>
  );
}
