import { useEffect, useState } from "react";
import {
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import {
  SearchOutlined,
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
  Button,
  message,
  Tag,
  List,
  Spin,
  DatePicker,
} from "antd";
import axios from "axios";
import moment from "moment";

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
  {
    value: "most_downloaded",
    label: "Most Downloaded"
  }
];

export default function AllDatasets() {
  const [searchName, setSearchName] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedLicense, setSelectedLicense] = useState("");
  const [allDatasets, setAllDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // tags
  const [allTags, setAllTags] = useState([]);
  // licenses
  const [allLicenses, setAllLicenses] = useState([]);
  // sort
  // const [sort, setSort] = useState("");

  // date range
  const [selectedDateRange, setSelectedDateRange] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || undefined;
  const tags = searchParams.getAll("tags") || undefined;
  const licenses = searchParams.get("license") || undefined;
  const sort = searchParams.get("sort" || undefined);

  const disabledDate = (current) => current && current > moment().endOf("day");

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

  const handleSearch = async (name, tags, license, sort, date_range) => {
    setIsLoading(true);
    // prevent uiser enter special character
    const special_character_regex = /:/g;
    if (special_character_regex.test(name)) {
      setIsLoading(false);
      return message("Can not find with special character.");
    }

    if (name === undefined) {
      setSearchName("");
    } else {
      setSearchName(name);
    }

    // search from api
    try {
      let api_url = `${process.env.REACT_APP_CKAN_API_ENDPOINT}/datasets/search?q=${name || ""}&sort=${sort || "relevance desc"}`;

      // if license selected
      if (license !== undefined && license !== "") {
        api_url += `&license=${license}`;
      }

      // if tag selected
      if (tags) {
        const tag_list = tags.map((item) => `tags=${item}`).join("&");
        api_url += `&${tag_list}`;
      }

      if (date_range !== null && date_range !== undefined && date_range?.length !== 0) {
        // const range = `&date_range=[${date_range[0]}T00:00:00Z TO ${date_range[1]}T23:59:59Z]`;
        const start = new Date(date_range[0]?.$d).toISOString().split("T")[0];
        const end = new Date(date_range[1]?.$d).toISOString().split("T")[0];
        const range = `&date_range=[${start}T00:00:00Z TO ${end}T23:59:59Z]`;
        api_url += range;
      }

      

      const response = await axios.get(api_url);
      if (response.data.ok) {
        setAllDatasets(response.data.result);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      message.error("Searcing Error...");
    }
  };

  const handleLicenseSelected = (license) => {
    if (license === selectedLicense) {
      setSelectedLicense("");
    } else {
      setSelectedLicense(license);
    }
  };

  const handleSelectedLicenseRemove = () => {
    setSelectedLicense("");
    handleSearch(searchName, selectedTags, "", null, selectedDateRange);
  };

  const handleTagsSelected = (tag) => {
    if (selectedTags.includes(tag)) {
      const new_data = selectedTags.filter((item) => item !== tag);
      setSelectedTags(new_data);
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSelectedTagsRemove = (tag) => {
    const new_data = selectedTags.filter((item) => item !== tag);
    setSelectedTags(new_data);
    handleSearch(searchName, new_data, selectedLicense, null, selectedDateRange);
  };

  const hanldleClearFilter = () => {
    setSelectedTags([]);
    setSelectedLicense("");
    setSelectedDateRange([]);
    handleSearch(searchName);
  };

  const handleSelectedSort = (sort_selected) => {
    handleSearch(searchName, selectedTags, selectedLicense, sort_selected, selectedDateRange);
  };

  const handleDateRangeChange = (date) => {
    setSelectedDateRange(date)
  }

  useEffect(() => {
    if (!query && !tags && !licenses) {
      handleSearch("");
    } else {
      handleSearch(query, tags, licenses, sort, selectedDateRange);
    }

    fetchTags();
    fetchLicenses();
  }, []);

  /*
  useEffect(() => {
    handleSearch(searchName, selectedTags, selectedLicense);
  }, [sort]);
  */

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
                onChange={(e) =>
                  handleSearch(e.target.value, selectedTags, selectedLicense, null, selectedDateRange)
                }
              />
              <Select
                defaultValue="relevance"
                size="large"
                options={sort_data}
                style={{ width: "15%" }}
                onChange={handleSelectedSort}
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
                    <Tag.CheckableTag
                      checked={selectedTags.includes(item.display_name)}
                      className="block py-1.5 px-2.5 mb-1.5 rounded-lg text-sm border-1 border-[#f5f3f3] shadow-xs cursor-pointer transition ease-in-out delay-50"
                      onClick={() => handleTagsSelected(item.display_name)}
                    >
                      {item.display_name}
                    </Tag.CheckableTag>
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
                {/* if license not selected, then return a list of licenses */}
                {selectedLicense.length === 0 ? (
                  <List
                    dataSource={allLicenses}
                    renderItem={(item) => (
                      <div
                        className="bg-[#F7F9FC] py-1 px-2.5 mb-1.5 rounded-lg cursor-pointer transition ease-in-out delay-50 hover:bg-[#D6DEE1]"
                        onClick={() => handleLicenseSelected(item.id)}
                      >
                        {item.title}
                      </div>
                    )}
                  />
                ) : (
                  <Tag.CheckableTag
                    checked={true}
                    className="w-full py-1 px-2 rounded-lg font-semibold text-xs"
                    onClick={() => handleLicenseSelected(selectedLicense)}
                  >
                    {selectedLicense}
                  </Tag.CheckableTag>
                )}
              </div>
            </div>

            {/* date range selection */}
            <div className="mb-10">
              <Title level={5} style={{ marginTop: 0 }}>
                Date
              </Title>
              <DatePicker.RangePicker disabledDate={disabledDate} value={selectedDateRange} showToday={true} className="w-full" onChange={handleDateRangeChange} />
            </div>

            <Space direction="vertical" style={{ width: "100%" }}>
              {/* apply button */}
              <Button
                block={true}
                type="primary"
                onClick={() =>
                  handleSearch(searchName, selectedTags, selectedLicense, null, selectedDateRange)
                }
              >
                Apply
              </Button>
              {/* Clear button */}
              <Button block={true} danger={true} onClick={hanldleClearFilter}>
                Clear
              </Button>
            </Space>
          </Col>
          {/* show all datasets in database (ckan) */}
          <Col xs={24} lg={18}>
            <div className="container mx-auto mb-4 -mt-2 flex justify-between items-center">
              <div>Datasets {allDatasets?.length}</div>
              <div>
                {/* selected tag */}
                {selectedTags?.map((item, key) => (
                  <Tag
                    key={key}
                    className="px-2 py-1 bg-[#E8EAED] font-semibold text-sm rounded-lg"
                    closable={true}
                    onClose={() => handleSelectedTagsRemove(item)}
                  >
                    {item}
                  </Tag>
                ))}

                {/* selected license */}
                {selectedLicense.length !== 0 && (
                  <Tag
                    className="px-2 py-1 bg-[#E8EAED] font-semibold text-sm rounded-lg"
                    closable={true}
                    onClose={handleSelectedLicenseRemove}
                  >
                    {selectedLicense}
                  </Tag>
                )}
              </div>
            </div>
            <Row gutter={[18, 18]}>
              {isLoading ? (
                <div className="w-full h-screen flex items-center justify-center">
                  <Spin size="large" />
                </div>
              ) : allDatasets.length ? (
                allDatasets.map((item, key) => (
                  <Col xs={12} md={8} xl={6} key={key}>
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
                  <Empty description="Not found" />
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
}
