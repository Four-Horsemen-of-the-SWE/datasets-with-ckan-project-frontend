import { CaretUpOutlined, CaretDownOutlined, PlusOutlined } from "@ant-design/icons";
import { Typography, List, Avatar, Button, Input, Space, Empty } from "antd"
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const { Title } = Typography

const data = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
];

export default function DiscussionView({dataset_id}) {
  const [topic, setTopic] = useState([]);

  const fetchTopics = async() => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/discussions/${dataset_id}/topics`
      );

      if (response.data.ok) {
        setTopic(response.data.result)
      }
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchTopics()
  }, [])

  return (
    <>
      <div className="container mx-auto">
        <div className="flex justify-between items-center my-5">
          <Title level={3} style={{ margin: "auto 0" }}>
            Discussions
          </Title>

          <Button type="primary" size="large" icon={<PlusOutlined />}>
            New Topic
          </Button>
        </div>

        {topic.length ? (
          <List
            loading={false}
            itemLayout="horizontal"
            dataSource={topic}
            renderItem={(item, index) => (
              <List.Item
                key={index}
                actions={[
                  <Space.Compact size="" block>
                    <Button>
                      <CaretUpOutlined />
                    </Button>
                    <Input
                      disabled
                      defaultValue={0}
                      style={{ width: "40px", textAlign: "center" }}
                    />
                    <Button>
                      <CaretDownOutlined />
                    </Button>
                  </Space.Compact>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item?.user_image_url} />}
                  title={<a href={`discussion/${item.id}`}>{item.title}</a>}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty description="No Discussion" />
        )}
      </div>
    </>
  );
}