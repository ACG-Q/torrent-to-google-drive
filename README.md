# torrent-to-google-drive

heroku已部署：https://torrent-to-google-drive-one.herokuapp.com/

### 破解30分钟限制

> heroku免费版有一个限制，如果APP30分钟没人访问就会设置成休眠状态！
> 破解也简单，网上有好多免费的网站监控。随便找一个监控一下就可以了！比如阿里云的云监控！

<details>
    <summary><b> 给使用这个部署网站的人说件事  🔨 </b></summary>
    <blockquote>
        ①由于使用heroku的免费版本部署的，所以只有550个小时（即23天左右）<br/>
        ②由于未知原因，下载总量（即所有种子下载完成后相加）大于40GB左右，就会被强制重新部署（即全部清空）<br/>
        ③最重要的点就是，如果想要在下载完种子后，并保存在自己的Google Drive上请自行部署至heroku<br/>
        <blockquote>关于部署方法：https://github.com/patheticGeek/torrent-aio-bot</blockquote>
    </blockquote>
</details>

<details>
    <summary><b> 部署的步骤  🔨 </b></summary>
    <blockquote>
        ①第一步：部署 [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/patheticGeek/torrent-aio-bot)<br/>
        ②第二步：设置变量：<br>
        <b>✅key:`SITE` value:'你部署后的网站(记得加`\`)'</b><br/>
        <b>✅key:`SITE` value:'你部署后的网站(记得加`\`)'</b><br/>
        <b>✅key:`SITE` value:'你部署后的网站(记得加`\`)'</b><br/>
        <b>✅key:`SITE` value:'你部署后的网站(记得加`\`)'</b><br/>
        <br/>
        ③最重要的点就是，如果想要在下载完种子后，并保存在自己的Google Drive上请自行部署至heroku<br/>
</details>