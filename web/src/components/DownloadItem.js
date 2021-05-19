/*
 * @Author: 六记
 * @Date: 2021-05-18 18:26:33
 * @LastEditTime: 2021-05-18 18:34:40
 * @Description: 汉化
 * @FilePath: web\src\components\DownloadItem.js
 */
import React, { useState } from "react";

function DownloadItem({ torrent }) {
  const [stopping, setStopping] = useState(false);

  const stop = () => {
    setStopping(true);

    try {
      fetch(`/api/v1/torrent/remove?link=${torrent.magnetURI}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="card" style={{ opacity: stopping ? 0.75 : 1 }}>
      <div className="card-header compact d-flex space-between">
        <h3 style={{ lineBreak: "anywhere", marginRight: "8px" }}>{torrent.name}</h3>
        <div className="text-400 text-primary">{torrent.done ? "Done" : torrent.redableTimeRemaining}</div>
      </div>
      {torrent.progress !== 100 && (
        <div
          style={{
            height: "4px",
            width: `${torrent.progress}%`,
            backgroundColor: "var(--primary)"
          }}
        />
      )}
      <div className="card-body compact">
        <div className="d-flex space-between">
          <div className="text-400">状态: </div>
          <div>{torrent.status}</div>
        </div>
        <div className="d-flex space-between">
          <div className="text-400">大小: </div>
          <div>{torrent.total}</div>
        </div>
        <div className="d-flex space-between">
          <div className="text-400">已下载: </div>
          <div>{torrent.downloaded}</div>
        </div>
        <div className="d-flex space-between">
          <div className="text-400">下载速度: </div>
          <div>{torrent.speed}</div>
        </div>
        {!torrent.done && (
          <button disabled={stopping} className="btn danger" onClick={stop}>
            Stop
          </button>
        )}
        {torrent.done && (
          <a href={torrent.downloadLink} className="btn success">
            Open
          </a>
        )}
      </div>
    </div>
  );
}

export default DownloadItem;
