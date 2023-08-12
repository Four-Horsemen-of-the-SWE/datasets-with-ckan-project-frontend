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
  Tooltip,
} from "antd";
import { Link, useParams } from "react-router-dom";
import { useAuthUser, useAuthHeader, useIsAuthenticated } from "react-auth-kit";
import axios from "axios";

// import componests
import CreateTopicModal from "./CreateTopicModal";
import ViewTopic from "./ViewTopic";
import VoteButton from "./VoteButton";

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
  const isAuthenticated = useIsAuthenticated();
  const JWTToken = authHeader().split(" ")[1];

  const { topic_id } = useParams();
  const [topics, setTopics] = useState([]);
  const [isCreateTopicModalShow, setIsTopicModalShow] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  
  const config = isAuthenticated()
    ? {
        headers: {
          Authorization: authHeader().split(" ")[1],
        },
      }
    : {};

  const fetchTopics = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/discussions/${dataset_id}/topics`,
        config
      );

      if (response.data.ok) {
        setTopics(response.data.result);
      }
    } catch (error) {
      console.log(error);
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

  console.log(topics)

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

          {isAuthenticated() && (
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setIsTopicModalShow(true)}
            >
              New Topic
            </Button>
          )}
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
                  <VoteButton
                    target_id={item.id}
                    target_type="topic"
                    vote_type={item.voted_type}
                    direction="horizontal"
                    vote={item.vote}
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar src={item?.user_image_url} />}
                  title={
                    <>
                      <a href={`discussions/${item.id}`}>{item.title}</a>{" "}
                      {item.user_id === auth()?.id && (
                        <Tooltip title="You can edit and delete this topic on the View Topics page." placement="right">
                          <Tag color="red">Your Topic</Tag>
                        </Tooltip>
                      )}
                    </>
                  }
                  description={item?.body}
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
