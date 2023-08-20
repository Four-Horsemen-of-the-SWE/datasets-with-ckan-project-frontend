import { EyeOutlined, CheckOutlined, FullscreenOutlined } from "@ant-design/icons";
import { Button, Card, Modal, Typography } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment/moment";

const { Meta } = Card;
const { Paragraph } = Typography;

export default function DatasetsCard({
  id,
  thumbnail,
  title,
  notes,
  metadata_modified,
  author,
}) {
  return (
    <>
      {/* datasets card */}
      <Card
        hoverable
        className="shadow-sm h-full"
        cover={
          <img
            alt="thumbnail"
            src={
              thumbnail
                ? thumbnail
                : "https://avatars.githubusercontent.com/u/47313528?v=4"
            }
          />
        }
        actions={[
          <Link to={`/profile/${author ? author : "Admin"}`}>
            {author ? author : "Admin"}
          </Link>,
          moment(metadata_modified).format("MMM Do YY"),
        ]}
      >
        <Link to={`/datasets/${id}`}>
          <Meta
            title={title}
            description={
              <Paragraph ellipsis={{ rows: 3 }}>
                {notes ? notes : "No Description"}
              </Paragraph>
            }
            className="h-24"
          />
        </Link>
      </Card>
    </>
  );
}
