import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Row, Space, Typography, Select, Divider, Card } from "antd";

// import components
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

const tags = ['Computer Science', 'Education', 'Classification', 'Computer Vision', 'NLP', 'Data Visualizatio', 'Pre-Trained Model']

export default function AllDatasets() {
  return (
    <>
      <div className="container mx-auto">
        <Row justify="center" align="bottom" gutter={18}>
          <Col sm={24} md={9}>
            <Space direction="vertical">
              <Title>Our Datasets</Title>
              <Text>
                Browse 10+ open source datasets for your next machine learning
                project. Our list of free datasets keeps growing, so make sure
                you visit it frequently.
              </Text>
            </Space>
          </Col>
          <Col sm={24} md={15}>
            <div className="flex gap-2">
              <Input
                prefix={<SearchOutlined />}
                allowClear
                size="large"
                placeholder="Search datasets"
                style={{ width: "100%" }}
              />
              <Select
                defaultValue="hotest"
                size="large"
                options={[
                  {
                    value: "hotest",
                    label: "Hotest",
                  },
                  {
                    value: "newest",
                    label: "Neweset",
                  },
                  {
                    
                  },
                ]}
              />
            </div>
          </Col>
        </Row>
      </div>

      <Divider />

      <div className="container mx-auto">
        <Row gutter={18} justify="space-between" align="top">
          <Col md={4}>
            <Space direction="vertical" className="w-full">
              <Title level={5} style={{ marginTop: 0 }}>
                Tags
              </Title>

              {/* tag list rendering */}
              {tags.map((item, key) => (
                <Card
                  bodyStyle={{
                    padding: 6,
                    width: "100%",
                    backgroundColor: "#F7F9FC",
                    cursor: "pointer",
                  }}
                  key={key}
                >
                  {item}
                </Card>
              ))}
            </Space>
          </Col>
          <Col md={20}>
            <Row gutter={[18, 18]}>
              {datasets.map((item, key) => (
                <Col xs={8} md={6} lg={6}>
                  <DatasetsCard
                    thumbnail={item.thumbnail}
                    title={item.title}
                    description={item.description}
                    author={item.author}
                    key={key}
                  />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}
