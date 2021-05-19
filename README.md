# torrent-to-google-drive

```tree
├─downloads
│  └─这里是下载目录.txt     
├─lib
│  ├─bot.js
│  └─torrent.js     
└─web
   └─src
      ├─components
      │  ├─DownloadItem.js
      │  └─TopNav.js  
      └─screens
         └─Downloads.js
```

> 当前仓库已不作部署，此仓库用于保存TelegramRobot翻译文件
> 部属用仓库：https://github.com/ACG-Q/torrent-aio-bot

heroku已部署：https://torrents-to-gdrive.herokuapp.com/
电报机器人：<a href="https://t.me/TorrentTo_Bot">@TorrentTo_Bot</a>

<details>
    <summary><b> 给使用这个部署网站的人说件事  🔨 </b></summary>
    <blockquote>
        ①由于使用heroku的免费版本部署的，所以只有550个小时（即23天左右）<br/>
        ②推荐使用方法：通过Telegram <a href="https://t.me/TorrentTo_Bot">@TorrentTo_Bot</a> 来进行使用<br/>
        ③最重要的点就是，如果想要在下载完种子后，并保存在自己的Google Drive上请自行部署至heroku<br/>
    </blockquote>
</details>
  <details> 
   <summary><b> 简洁的部署的步骤🔨 </b></summary> 
    <p>①第一步：部署 <a src="https://heroku.com/deploy?template=https://github.com/patheticGeek/torrent-aio-bot"><img alt="Deploy" src="https://www.herokucdn.com/deploy/button.svg" /></a></p> 
    <p>②第二步：设置变量：</p> 
    <ul> 
     <li><p>✅key:<code>SITE</code> value:你部署后的网站(记得加<code>\</code>)</p></li>
     <li><p>✅key:<code>TELEGRAM_TOKEN</code> value:<code>Tg机器人的token，不填的话，无法搭建机器人</code></p><p>转到<a href="https://developers.google.com/drive/api/v3/quickstart/nodejs">快速入门NodeJs</a>和<code>Enable Drive</code>。创建一个<code>OAUTH</code>for<code>Desktop</code>并复制<code>CLIENT_ID</code>和<code>CLIENT_SECRET</code>。</p></li>
     <li><p>✅key:<code>CLIENT_ID</code> value:<code>上面 </code></p></li>
     <li><p>✅key:<code>CLIENT_SECRET</code> value:<code>上面</code></p><p>访问<code>https://&lt;项目名称&gt;.herokuapp.com/drivehelp</code>，填空，跟着流程走，获取<code>AUTH_CODE</code>和<code>TOKEN</code></p></li>
     <li><p>✅key:<code>AUTH_CODE</code> value:<code>上面</code></p></li>
     <li><p>✅key:<code>TOKEN</code> value:<code>上面</code></p></li>
     <li><p>✅key:<code>GDRIVE_PARENT_FOLDER</code> value:<code>想要存放的Google Drive 文件id</code></p></li>
    </ul> 
    <blockquote>详细的部署方法：https://github.com/patheticGeek/torrent-aio-bot</blockquote>
  </details>

