import React from "react";
import ContentLoader from "react-content-loader";

interface IInfoLoader {
  width?: number;
  height?: number;
}

const InfoLoader = (props: IInfoLoader) => {
  const { height = 25, width = 100 } = props;
  return (
    <ContentLoader width={width} height={height} >
      <rect x="0" y="0" rx="5" ry="5" width={width} height={height} />
    </ContentLoader>
  );
};

export default InfoLoader;
