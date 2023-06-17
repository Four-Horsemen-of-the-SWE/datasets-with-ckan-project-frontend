import { StarOutlined } from "@ant-design/icons";
import { Card } from "antd";
import moment from "moment/moment";

const { Meta } = Card;

export default function DatasetsCard({ thumbnail, title, description, date, author }) {
  return (
    <Card
      hoverable
      loading={false}
      className="shadow-sm"
      cover={<img alt="thumbnail" src={thumbnail} />}
      actions={[
        author,
        moment(date).format("MMM Do YY"),
        <StarOutlined key="bookmark" />,
      ]}
    >
      <Meta
        title={title}
        description={
          description.length > 100
            ? description.slice(0, 100) + "..."
            : description
        }
      />
    </Card>
  );
}
