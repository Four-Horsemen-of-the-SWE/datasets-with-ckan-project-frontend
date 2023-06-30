import "./style.css";
import { useState, useEffect } from "react";
import {
  SearchOutlined,
  PushpinOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Button, Col, Divider, Input, Row, Space, Image, Typography, notification, Card } from "antd";
import DatasetsCard from "../../components/Card/DatasetsCard";
import axios from "axios";

const { Title, Text } = Typography;

export default function Home() {
  document.title = "Home"

  const [allDatasets, setAllDatasets] = useState([]);
  const [isHotestLoading, setIsHotestLoading] = useState(true);
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
        description: error.message
      });
    }
  };

  useEffect(() => {
    fetchHotestDatasets();
  }, []);

  return (
    <>
      {contextHolder}
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

      {false && (
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

            <Row gutter={[18, 18]}>
              {isHotestLoading && (
                <Card loading className="shadow-sm h-auto w-96" />
              )}
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
          </section>
        </>
      )}

      {true && (
        <div className="container mx-auto flex items-center justify-center w-full h-96 text-center">
          <Space direction="vertical">
            <Image
              preview={false}
              src={process.env.PUBLIC_URL + "/images/the-rock.gif"}
            />
            <Title>ไม่สามารถโหลดชุดข้อมูลได้</Title>
            <Text>อาจจะเพราะว่า Back-end ยังไม่เสร็จ อิอิ</Text>
            <Typography.Link href="https://www.youtube.com/watch?v=-mEs2laCcxA&pp=ygUb4LiE4Lin4Liy4Lih4LiX4Lij4LiH4LiI4Liz">
              รายละเอียดเพิ่มเติม แนะนำให้อ่าน
            </Typography.Link>
          </Space>
        </div>
      )}
    </>
  );
}
