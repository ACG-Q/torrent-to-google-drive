# torrent-to-google-drive

heroku已部署：https://torrent-to-google-drive-one.herokuapp.com/

### 破解30分钟限制

> heroku免费版有一个限制，如果APP30分钟没人访问就会设置成休眠状态！
> 破解也简单，网上有好多免费的网站监控。随便找一个监控一下就可以了！比如阿里云的云监控！

### 给使用这个部署网站的人说件事

> ①由于使用heroku的免费版本部署的，所以只有550个小时（即23天左右）
>
> ②由于未知原因，下载总量（即所有种子下载完成后相加）大于40GB左右，就会被强制重新部署（即全部清空）
>
> ③最重要的点就是，如果想要在下载完种子后，并保存在自己的Google Drive上请自行部署至heroku
> > 关于部署方法：https://github.com/lahirulks84/torrent-aio-bot
