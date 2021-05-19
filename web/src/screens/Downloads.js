import React, { useState } from "react";
import useSWR from "swr";
import Input from "../components/Input";
import DownloadItem from "../components/DownloadItem";

function Downloads() {
  const fetcher = (...args) => fetch(...args).then(res => res.json());
  const { data, error } = useSWR("/api/v1/torrent/list", fetcher, { refreshInterval: 3500 });
  const [link, setLink] = useState("");
  const [adding, setAdding] = useState(false);
  const [addingError, setAddingError] = useState("");

  const add = async e => {
    if (e) e.preventDefault();
    setAdding(true);

    if (link.indexOf("magnet:") !== 0) {
      setAddingError("当前链接好像不是磁力链接");
    } else {
      setAddingError("");
      const resp = await fetch(`/api/v1/torrent/download?link=${link}`);

      if (resp.status === 200) {
        setLink("");
      } else {
        setAddingError("发生了一个错误");
      }
    }

    setAdding(false);
  };

  return (
    <>
      <h1>Downloads</h1>

      <form onSubmit={add}>
        <Input
          id="link"
          name="link"
          label="Magnet Link"
          placeholder="magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10"
          value={link}
          onChange={setLink}
          required
        />
        {addingError !== "" && <div className="text-danger">{addingError}</div>}
        <button disabled={adding} className={`btn primary${adding ? " loading" : ""}`} type="submit">
          Add
        </button>
      </form>
      {error && <div className="text-danger mt-1">发生错误.检查你的互联网.</div>}
      {data && (
        <div className="d-flex-column mt-1">
          {data.torrents.map(torrent => (
            <DownloadItem torrent={torrent} key={torrent.magnetURI} />
          ))}
        </div>
      )}
    </>
  );
}

export default Downloads;
