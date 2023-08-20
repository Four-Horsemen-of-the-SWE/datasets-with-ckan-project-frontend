import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  SearchOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  FireOutlined,
} from "@ant-design/icons";
import {
  Col,
  Input,
  Row,
  Space,
  Typography,
  Select,
  Divider,
  Empty,
  DatePicker,
  Button,
  message,
  Card,
  Tag,
  AutoComplete,
  List,
} from "antd";
import axios from "axios";

// import components
import DatasetsCard from "../../components/Card/DatasetsCard";

const { Title, Text } = Typography;

const sort_data = [
  {
    value: "relevance desc",
    label: "Relevance",
  },
  {
    value: "name asc",
    label: "Name (A - Z)",
  },
  {
    value: "name desc",
    label: "Name (Z - A)",
  },
  {
    value: "metadata_modified desc",
    label: "Latest",
  },
];

export default function AllDatasets() {
  const [searchName, setSearchName] = useState("");
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [allDatasets, setAllDatasets] = useState([]);

  // tags
  const [allTags, setAllTags] = useState([]);
  // licenses
  const [allLicenses, setAllLicenses] = useState([]);
  // sort
  const [sort, setSort] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const fetchDatasets = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/search`
      );
      if (response.status === 200) {
        setAllDatasets(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/tags`
      );
      if (response.status === 200) {
        setAllTags(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchLicenses = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/licenses`
      );
      if (response.data.ok) {
        setAllLicenses(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async (name) => {
    // prevent uiser enter soecial character
    const special_character_regex = /:/g;
    if (special_character_regex.test(name)) {
      return message("Can not find with special character.");
    }

    setSearchName(name);
    // update the query param in URL
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("q", name);
    navigate({ search: queryParams.toString() });

    // search from api
    try {
      const tag_list = selectedFilter
        .map(
          (item) =>
            `${Object.keys(item)}=${encodeURIComponent(Object.values(item))}`
        )
        .join("&");
      const response = await axios.get(
        `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/search?q=${name}&${tag_list}&sort=${sort}`
      );
      if (response.data.ok) {
        setAllDatasets(response.data.result);
      }
    } catch (error) {
      message.error("Searcing Error...");
    }
  };

  useEffect(() => {
    fetchDatasets();
    fetchTags();
    fetchLicenses();
  }, []);

  useEffect(() => {
    handleSearch(searchName);
  }, [sort])

  return (
    <>
      {/* filtered */}
      <div className="container mx-auto">
        <Row justify="center" align="bottom" gutter={18}>
          <Col sm={24} md={9}>
            <Space direction="vertical" className="my-3">
              <Title>Our Datasets</Title>
              <Text>
                Browse open source datasets for your next machine learning
                project. Our list of free datasets keeps growing, so make sure
                you visit it frequently.
              </Text>
            </Space>
          </Col>
          <Col sm={24} md={15}>
            <div className="flex gap-2">
              <Input
                prefix={<SearchOutlined />}
                allowClear={true}
                size="large"
                placeholder="Search datasets"
                style={{ width: "85%" }}
                onChange={(e) => handleSearch(e.target.value)}
              />
              <Select
                defaultValue="relevance"
                size="large"
                options={sort_data}
                style={{ width: "15%" }}
                onChange={(value) => setSort(value)}
              />
            </div>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* datasets and selected tags and license */}
      <div className="container mx-auto">
        <Row gutter={[18, 18]}>
          {/* show filter options, such asssssss date, tag, license */}
          <Col xs={24} lg={6}>
            {/* Tag Section */}
            <div className="mb-10">
              <Title level={5} style={{ marginTop: 0 }}>
                Tags
              </Title>
              {/* <AutoComplete placeholder="Search tags here." className="w-full mb-2" /> */}
              <div className="overflow-y-auto overflow-x-hidden max-h-56">
                <List
                  dataSource={allTags}
                  renderItem={(item) => (
                    <div
                      style={{
                        backgroundColor: "#F7F9FC",
                        padding: "4px 10px",
                        marginBottom: "5px",
                        borderRadius: "7px",
                        cursor: "pointer",
                      }}
                      onClick={null}
                    >
                      {item.display_name}
                    </div>
                  )}
                />
              </div>
            </div>

            {/* License Section */}
            <div className="mb-10">
              <Title level={5} style={{ marginTop: 0 }}>
                License
              </Title>
              {/* <AutoComplete placeholder="Search license here." className="w-full mb-2" /> */}
              <div className="overflow-y-auto overflow-x-hidden max-h-56">
                <List 
                  dataSource={allLicenses}
                  renderItem={(item) => (
                    <div
                      style={{
                        backgroundColor: "#F7F9FC",
                        padding: "4px 10px",
                        marginBottom: "5px",
                        borderRadius: "7px",
                        cursor: "pointer",
                      }}
                      onClick={null}
                    >
                      {item.title}
                    </div>
                  )}
                />
              </div>
            </div>

            <Space direction="vertical" style={{ width: "100%" }}>
              {/* apply button */}
              <Button block={true} type="primary" onClick={null}>
                Apply
              </Button>
              {/* Clear button */}
              <Button block={true} danger={true} onClick={null}>
                Clear
              </Button>
            </Space>
          </Col>
          {/* show all datasets in database (ckan) */}
          <Col xs={24} lg={18}>
            <div className="container mx-auto mb-4 -mt-2 flex justify-between items-center">
              <div>Datasets {allDatasets?.length}</div>
              <div>
                {selectedFilter.map((item) => (
                  <Tag
                    className="px-2 py-1 bg-[#E8EAED] font-semibold text-sm rounded-lg"
                    closable={true}
                    onClose={null}
                  >
                    {Object.values(item)}
                  </Tag>
                ))}
              </div>
            </div>
            <Row gutter={[18, 18]}>
              {allDatasets.length ? (
                allDatasets.map((item, key) => (
                  <Col xs={12} md={12} lg={6} key={key}>
                    <DatasetsCard
                      id={item.id}
                      thumbnail={item?.thumbnail}
                      title={item.title}
                      notes={item.notes}
                      metadata_modified={item.metadata_modified}
                      author={item.author}
                    />
                  </Col>
                ))
              ) : (
                <Col
                  span={24}
                  className="w-full h-96 flex items-center justify-center"
                >
                  <Empty />
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}
