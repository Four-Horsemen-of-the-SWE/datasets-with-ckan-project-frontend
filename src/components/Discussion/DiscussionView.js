import { useEffect, useState } from "react";
import {
  CaretUpOutlined,
  CaretDownOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Typography,
  List,
  Avatar,
  Button,
  Input,
  Space,
  Empty,
  message,
  Form,
  Tag
} from "antd";
import { useParams } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import axios from "axios";

// import componests
import CreateTopicModal from "./CreateTopicModal";
import ViewTopic from "./ViewTopic";

const { Title } = Typography;

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

export default function DiscussionView({ dataset_id, dataset_creator_user_id }) {
  const auth = useAuthUser();

  const { topic_id } = useParams();
  const [topic, setTopic] = useState([]);
  const [isCreateTopicModalShow, setIsTopicModalShow] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchTopics = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/discussions/${dataset_id}/topics`
      );

      if (response.data.ok) {
        setTopic(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createTopic = async () => {
    try {
    } catch (error) {
      messageApi.error(error.message);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // return a topic's discussion
  if (topic_id) {
    return (
      <>
        <ViewTopic
          topic_id={topic_id}
          dataset_creator_user_id={dataset_creator_user_id}
        />
      </>
    );
  }

  return (
    <>
      <CreateTopicModal
        dataset_id={dataset_id}
        isOpen={isCreateTopicModalShow}
        close={() => setIsTopicModalShow(false)}
      />
      {contextHolder}
      <div className="container mx-auto">
        <div className="flex justify-between items-center my-5">
          <Title level={3} style={{ margin: "auto 0" }}>
            Discussions
          </Title>

          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setIsTopicModalShow(true)}
          >
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
                  title={
                    <>
                      <a href={`discussions/${item.id}`}>{item.title}</a>{" "}
                      {item.user_id === auth()?.id && (
                        <Tag color="red">Your Topic</Tag>
                      )}
                    </>
                  }
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
