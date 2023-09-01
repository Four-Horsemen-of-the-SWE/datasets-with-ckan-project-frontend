import {
  formatted_date,
  formatted_date_time,
} from "../../../lib/formatted_date";
import { Link } from "react-router-dom";
import { Button, Space, Tag, Typography } from "antd";
import DeleteDatasetModal from "./DeleteDatasetModal";
import ReportDatasetModal from "./ReportDatasetModal";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    sortDirections: ["descend"],
    render: (text, record) => (
      <Space align="center" size="large">
        <img
          src={record?.thumbnail}
          alt="Thumbnail"
          style={{ maxWidth: "45px", borderRadius: "7px" }}
        />
        <Link to={`/datasets/${record?.id}`} style={{ color: "black" }}>
          {text}
        </Link>
      </Space>
    ),
  },
  {
    title: "Author",
    dataIndex: "author",
    key: "author",
    render: (user_name) => (
      <Link to={`/profile/${user_name}`} target="_blank">
        {user_name}
      </Link>
    ),
  },
  {
    title: "Visibility",
    dataIndex: "private",
    key: "private",
    align: "center",
    render: (visibility) =>
      visibility ? (
        <Tag color="error">Private</Tag>
      ) : (
        <Tag color="processing">Public</Tag>
      ),
  },
  {
    title: "Tag",
    dataIndex: "tags",
    key: "tags",
    render: (tags) =>
      tags.slice(0, 3).map((tag) => <Tag>{tag.display_name}</Tag>),
  },
  {
    title: "Last Modified",
    dataIndex: "metadata_modified",
    key: "metadata_modifie",
    sorter: (a, b) =>
      new Date(a.metadata_modifie) - new Date(b.metadata_modifie),
    render: (text) => formatted_date(text),
  },
  {
    title: "Delete",
    dataIndex: "url",
    key: "url",
    width: "10px",
    align: "center",
    render: (url, record) => (
      <DeleteDatasetModal dataset_id={record.id} dataset_name={record.name} />
    ),
  }
];

export default columns;
