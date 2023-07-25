import { useEffect, useState } from "react";
import {
  CaretUpOutlined,
  CaretDownOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined
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
  Tag,
  Popconfirm,
} from "antd";
import { useParams } from "react-router-dom";
import { useAuthUser, useAuthHeader } from "react-auth-kit";
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
  const authHeader = useAuthHeader();
  const JWTToken = authHeader().split(" ")[1];

  const { topic_id } = useParams();
  const [topics, setTopics] = useState([]);
  const [isCreateTopicModalShow, setIsTopicModalShow] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  

  const fetchTopics = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/discussions/${dataset_id}/topics`
      );

      if (response.data.ok) {
        setTopics(response.data.result);
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

  const handleDelteTopic = async(topic_id) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/discussions/${topic_id}/topics`,
        {
          headers: {
            Authorization: JWTToken
          }
        }
      );
      if(response.data.ok) {
        messageApi.success("success");
        // then remove from list
        const new_topics = topics.filter(item => item.id !== response.data.result);
        setTopics(new_topics)
      }
    } catch(error) {
      messageApi.error(error.message);
    }
  }

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
      {contextHolder}
      <CreateTopicModal
        dataset_id={dataset_id}
        isOpen={isCreateTopicModalShow}
        close={() => setIsTopicModalShow(false)}
        topics={topics}
        setTopics={setTopics}
      />
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

        {topics.length ? (
          <List
            loading={false}
            itemLayout="horizontal"
            dataSource={topics}
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
                  auth()?.id === item.user_id && (
                    <Popconfirm
                      title="Delete this topic ?"
                      description="Are you sure to delete this topic."
                      icon={<DeleteOutlined style={{ color: "red" }} />}
                      placement="right"
                      onConfirm={() => handleDelteTopic(item.id)}
                    >
                      <Button>
                        <DeleteOutlined style={{ color: "red" }} />
                      </Button>
                    </Popconfirm>
                  ),
                  auth()?.id === item.user_id && (
                    <Button>
                      <EditOutlined style={{ color: "red" }} />
                    </Button>
                  ),
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
