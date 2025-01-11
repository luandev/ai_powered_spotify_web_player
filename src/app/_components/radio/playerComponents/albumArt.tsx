import React, { useEffect, useState } from "react";
import { RadioAlbumProps } from "../types";

type AlbumArtProps = {
  album: RadioAlbumProps;
  imagePeriod: number;
}

const AlbumArt: React.FC<AlbumArtProps> = ({imagePeriod, album: {
  images,
  name,
  uri,
}}) => {


  return (
    <>
    <a href={uri}>
      <img
        src={images[0]?.url || "https://via.placeholder.com/150"}
        alt={name}
        className="w-48 h-48 rounded-md"
      />
    </a>
    </>
  )
}

export default AlbumArt