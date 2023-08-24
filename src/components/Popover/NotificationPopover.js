import {
  NotificationOutlined,
  WarningOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { Button, List, Popover, Space, Tooltip, Typography } from "antd";
import { useAuthHeader } from "react-auth-kit";
import { useEffect, useState } from "react";
import axios from "axios";

const data = [
  "Racing car sprays burning fuel into crowd.",
  "Japanese princess to wed commoner.",
  "Australian walks 100km after outback crash.",
  "Man charged over missing wedding girl.",
  "Los Angeles battles huge wildfires.",
];

const NotificationList = ({notifications}) => {
  console.log(notifications)
  return (
    <List
      size="middle"
      bordered
      dataSource={notifications}
      renderItem={(item) => (
        <List.Item>
          <div className="flex gap-2 items-center justify-between w-full">
            <a href={item.entity_url}>
              <Space align="center">
                <WarningOutlined />
                <Typography.Paragraph
                  ellipsis={{ rows: 1, expandable: false, symbol: "more" }}
                  style={{ marginBottom: 0 }}
                >
                  {item.message}
                </Typography.Paragraph>
              </Space>
            </a>
            <Tooltip title="Click to mark as read.">
              <EyeTwoTone />
            </Tooltip>
          </div>
        </List.Item>
      )}
    />
  );
}

export default function NotificationPopover() {
  const authHeader = useAuthHeader();
  const [notifications, setNotifications] = useState([]);
  
  const config = {
    headers: {
      Authorization: authHeader().split(" ")[1]
    },
  };

  const fetchNotifications = async() => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/reports/notifications`,
        config
      );

      if(response.data.ok) {
        setNotifications(response.data.result);
      }
    } catch(error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, []);
  return (
    <Popover title="Notification" content={<NotificationList notifications={notifications} />} placement="bottom" trigger="click">
      <Button icon={<NotificationOutlined />} />
    </Popover>
  );
}
