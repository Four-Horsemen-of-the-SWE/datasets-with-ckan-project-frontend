import { CaretUpOutlined, CaretDownOutlined, PlusOutlined } from "@ant-design/icons";
import { Typography, List, Avatar, Button, Input, Space, Empty } from "antd"

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

export default function DiscussionView() {
  return (
    <>
      <div className="container mx-auto">
        <div className="flex justify-between items-center my-5">
          <Title level={3} style={{ margin: "auto 0" }}>Discussions</Title>

          <Button type="primary" size="large" icon={<PlusOutlined />}>New Topic</Button>
        </div>

        {false ? <List
          loading={false}
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <Space.Compact size="" block>
                  <Button>
                    <CaretUpOutlined />
                  </Button>
                  <Input
                    disabled
                    defaultValue={9}
                    style={{ width: "40px", textAlign: "center" }}
                  />
                  <Button>
                    <CaretDownOutlined />
                  </Button>
                </Space.Compact>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                  />
                }
                title={<a href="https://ant.design">{item.title}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
            </List.Item>
          )}
        /> : <Empty description="No Discussion" />}

        
      </div>
    </>
  );
}