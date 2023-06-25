import { SearchOutlined } from '@ant-design/icons';
import { Col, Input, Row, Space, Typography, Select, Divider, Card, Empty } from "antd";
import axios from "axios";

// import components
import DatasetsCard from "../../components/Card/DatasetsCard";
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

export default function AllDatasets() {

  const [allDatasets, setAllDatasets] = useState([]);
  const [allTags, setAllTags] = useState([]);

  const fetchDatasets = async() => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets`
      );
      if(response.status === 200) {
        setAllDatasets(response.data.result)
      }
    } catch(error) {
      console.log(error)
    }
  }

  const fetchTags = async() => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/tags`
      );
      if(response.status === 200) {
        setAllTags(response.data.result)
      }
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchDatasets();
    fetchTags();
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
              {allTags.length ? (
                allTags.map((item, key) => (
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
                ))
              ) : (
                <div className="w-full h-96 flex items-center justify-center">
                  <Empty />
                </div>
              )}
            </Space>
          </Col>
          <Col md={20}>
            <Row gutter={[18, 18]}>
              {allDatasets.length ? (
                allDatasets.map((item, key) => (
                  <Col xs={12} md={12} lg={6} key={key}>
                    <DatasetsCard
                      id={item.id}
                      thumbnail={item?.thumbnail}
                      title={item.title}
                      notes={item.notes}
                      metadata_modified={item.metadata_modified}
                      author={item.author}
                    />
                  </Col>
                ))
              ) : (
                <Col
                  span={24}
                  className="w-full h-96 flex items-center justify-center"
                >
                  <Empty />
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}
