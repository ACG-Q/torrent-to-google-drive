/*
 * @Author: 六记
 * @Date: 2021-05-18 18:26:33
 * @LastEditTime: 2021-05-18 18:36:18
 * @Description: 汉化
 * @FilePath: web\src\components\TopNav.js
 */
import React from "react";
import { Link } from "react-router-dom";

export default function TopNav({ nav }) {
  return (
    <div className="nav nav-horiz">
      <div className="content">
        <ul className="d-flex align-items-center space-around width-100 m-0">
          <li className={`cursor-pointer p-0 ph-1 height-100 d-flex align-items-center${nav === "search" ? " border-bottom-1" : ""}`}>
            <Link to="/search" className="height-100 d-flex align-items-center">
              <i className="h2 m-0 d-flex align-items-center">
                <ion-icon name="search-outline" />
              </i>
              <span className="tablet-desktop-only ml-05">搜索</span>
            </Link>
          </li>
          <li className={`cursor-pointer p-0 ph-1 height-100 d-flex align-items-center${nav === "downloads" ? " border-bottom-1" : ""}`}>
            <Link to="/download" className="height-100 d-flex align-items-center">
              <i className="h2 m-0 d-flex align-items-center">
                <ion-icon name="download-outline" />
              </i>
              <span className="tablet-desktop-only ml-05">下载界面</span>
            </Link>
          </li>
          <li className={`cursor-pointer p-0 ph-1 height-100 d-flex align-items-center${nav === "drive" ? " border-bottom-1" : ""}`}>
            <Link to="/drive" className="height-100 d-flex align-items-center">
              <i className="h2 m-0 d-flex align-items-center">
                <ion-icon name="push-outline" />
              </i>
              <span className="tablet-desktop-only ml-05">网盘</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
