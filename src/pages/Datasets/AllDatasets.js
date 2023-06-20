import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Row, Space, Typography, Select, Divider, Card } from "antd";
import axios from "axios";

// import components
import DatasetsCard from "../../components/Card/DatasetsCard";
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

const tags = ['Computer Science', 'Education', 'Classification', 'Computer Vision', 'NLP', 'Data Visualizatio', 'Pre-Trained Model']

export default function AllDatasets() {

  const [allDatasets, setAllDatasets] = useState([]);

  const fetchDatasets = async() => {
    try {
      const response = await axios.get(
        "https://opendata.cea.or.th/api/3/action/current_package_list_with_resources?limit=6"
      );
      if(response.status === 200) {
        setAllDatasets(response.data.result)
      }
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchDatasets()
  }, [])

  return (
    <>
      <div className="container mx-auto">
        <Row justify="center" align="bottom" gutter={18}>
          <Col sm={24} md={9}>
            <Space direction="vertical" className="my-3">
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
                    label: "Newest",
                  },
                ]}
              />
            </div>
          </Col>
        </Row>
      </div>

      <Divider />

      <div className="container mx-auto">
        <Row gutter={[18, 18]} justify="space-between" align="top">
          <Col md={4} className="w-full">
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
              {allDatasets.map((item, key) => (
                <Col xs={12} md={12} lg={6}>
                  <DatasetsCard
                    id={item.id}
                    thumbnail={item?.thumbnail}
                    title={item.title}
                    notes={item.notes}
                    metadata_modified={item.metadata_modified}
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
