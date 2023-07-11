import "./style.css";
import { useState, useEffect } from "react";
import {
  SearchOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import { Button, Col, Divider, Input, Row, Space, Typography, notification, Empty, AutoComplete } from "antd";
import DatasetsCard from "../../components/Card/DatasetsCard";
import axios from "axios";

const { Title, Text } = Typography;

export default function Home() {
  document.title = "Home"

  const [allDatasets, setAllDatasets] = useState([]);
  const [isHotestLoading, setIsHotestLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  const fetchHotestDatasets = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets`
      );
      if (response.status === 200) {
        setAllDatasets(response.data.result);
        setIsHotestLoading(false);
      }
    } catch (error) {
      console.log(error);
      api.error({
        message: 'Error',
        description: error.message,
        placement: 'bottomRight'
      });
    }
  };

  const handleSearch = async (value) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/search/auto_complete?q=${value}`
      );
      if(response.data.ok) {
        setOptions(response.data.result?.map(item => ({value: item.name, label: item.title})));
      }
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchHotestDatasets();
  }, []);

  return (
    <>
      {contextHolder}
      <section className="section--header w-full h-96 flex justify-center items-center">
        <div className="container mx-auto text-center">
          <Title className="mt-0 uppercase" style={{ color: "#FFF" }}>
            Datasets Hub
          </Title>
          <Text className="block mb-5 text-white capitalize">
            The datasets community, built with CKAN.
          </Text>

          <AutoComplete
            allowClear
            options={options}
            onSearch={handleSearch}
            onClear={() => setOptions([])}
            onSelect={(value) => window.location.href = `/datasets/${value}`}
            placeholder="Search datasets."
            size="large"
            style={{
              width: "400px",
              textAlign: "left",
            }}
          />
        </div>
      </section>

      <section className="container mx-auto text-center my-16">
        <Title style={{ lineHeight: "1.6em" }}>
          "Inside our platform you'll find all the datasets you need to do with
          your data science work. Over{" "}
          <Title mark className="inline">
            {5000}
          </Title>{" "}
          data."
        </Title>
      </section>

      <>
        <section className="container mx-auto py-5">
          <Title level={2}>
            <Space direction="vertical">
              <Space>
                <PushpinOutlined />
                Newest Datasets
              </Space>
              <Title level={4} type="secondary" className="mt-0">
                รายการดาต้าเซ็ทที่ใหม่ที่สุด
              </Title>
            </Space>
          </Title>

          <Divider />

          {isHotestLoading ? (
            <Empty description="No Datasets" />
          ) : (
            <Row gutter={[18, 18]}>
              {allDatasets.map((item, key) => (
                <Col xxs={12} md={12} lg={6}>
                  <DatasetsCard
                    id={item.id}
                    thumbnail={item?.thumbnail}
                    title={item.title}
                    notes={item.notes}
                    metadata_modified={item.metadata_modified}
                    author={item.author}
                    loading={isHotestLoading}
                    key={key}
                  />
                </Col>
              ))}
            </Row>
          )}
        </section>
      </>
    </>
  );
}
