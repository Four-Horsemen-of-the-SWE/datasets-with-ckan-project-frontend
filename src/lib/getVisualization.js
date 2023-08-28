import React, { useState, useEffect } from "react";
import { AutoSizer, Table, Column } from "react-virtualized";
import "react-virtualized/styles.css"; // Import the styles
import { Image } from "antd";
import Papa from "papaparse";
import mime from "mime";

const imageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/tiff",
  "image/webp",
  "image/svg+xml",
  "image/vnd.microsoft.icon",
  "image/jp2",
];

export function getVisualize(mimetype, url) {
  if (imageMimeTypes.includes(mimetype)) {
    return <VisualizeImage url={url} />;
  } else if (mimetype === "text/csv") {
    return (
      <VisualizeCSV
        csvFilePath={
          "http://127.0.0.1:5000/dataset/fab1f121-733c-4001-bfc7-5d62c3b2d0ef/resource/5b6fbb81-defe-4c7b-8b09-cf3183398b09/download/1e1e_netflix-userbase.csv"
        }
      />
    );
  } else {
    return null;
  }
}

export function VisualizeImage({url}) {
  return (
    <Image
      src={url}
      fallback={process.env.PUBLIC_URL + "/images/placeholder/image.jpg"}
    />
  );
}

export function VisualizeCSV({ csvFilePath }) {
  const [csvData, setCsvData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await new Promise((resolve, reject) => {
          Papa.parse(csvFilePath, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
              resolve(result.data);
            },
            error: (error) => {
              reject(error);
            },
          });
        });

        setCsvData(result);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [csvFilePath]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(csvData)

  return (
    <div style={{ minHeight: "60vh", width: "auto", overflow: "auto", marginTop: "2em" }}>
      {csvData?.length !== 0 && (
        <AutoSizer>
          {({ width, height }) => (
            <Table
              width={width}
              height={height}
              headerHeight={20}
              rowHeight={30}
              rowCount={csvData.length}
              rowGetter={({ index }) => csvData[index]}
            >
              {Object.keys(csvData[0]).map((key, index) => (
                <Column key={index} label={key} dataKey={key} width={150} />
              ))}
            </Table>
          )}
        </AutoSizer>
      )}
    </div>
  );
}

/**

*/