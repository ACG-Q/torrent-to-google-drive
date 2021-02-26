const axios = require("axios");

const status = require("../utils/status");
const diskinfo = require("../utils/diskinfo");
const humanTime = require("../utils/humanTime");
const { uploadFileStream } = require("../utils/gdrive");

const api = process.env.SEARCH_SITE || "https://torrent-aio-bot.herokuapp.com/";
console.log("Using api: ", api);

const searchRegex = /\/search (piratebay|limetorrent|1337x) (.+)/;
const detailsRegex = /\/details (piratebay|limetorrent|1337x) (.+)/;
const downloadRegex = /\/download (.+)/;
const statusRegex = /\/status (.+)/;
const removeRegex = /\/remove (.+)/;

const startMessage = `
欢迎使用，以下是一些让您开始使用的命令：

有3个网站可供搜索: piratebay, 1337x and limetorrent

/search {site} {query} - 搜索 torrents
您搜索要搜索的内容
例如. 
    /search piratebay Chernobyl
    /search piratebay Chernobyl 720p
    /search 1337x Lust Stories

/details {site} {link} - 获取torrent的详细信息
link是指向torrent页面的链接
例如. 
    /details piratebay https://bayunblocked net/torrent/.....
    /details 1337x https://1337x to/torrent/.....

/download {magnet link} - 开始下载
例如.
    /download magnet:?xt=urn:btih:sdfasdfas

/status {magnet link} - 检查下载torrent的状态
info hash is provided when torent download starts
例如.
    /status magnet:?xt=urn:btih:sdfasdfas

/remove {magnet link} - 删除已添加的torrent
例如.
    /remove magnet:?xt=urn:btih:sdfasdfas

若要上载文件，请将文件发送到此bot，它将直接上载到驱动器

服务器状态命令

/server status
/server uptime
/server diskinfo

Happy torrenting :)
`;

function bot(torrent, bot) {
  bot.onText(/\/start/, async msg => {
    bot.sendMessage(msg.chat.id, startMessage);
  });

  bot.on("message", async msg => {
    if (!msg.document) return;
    const chatId = msg.chat.id;
    const mimeType = msg.document.mimeType;
    const fileName = msg.document.file_name;
    const fileId = msg.document.file_id;

    bot.sendMessage(chatId, "正在上载文件...");
    try {
      const uploadedFile = await uploadFileStream(fileName, bot.getFileStream(fileId));
      const driveId = uploadedFile.data.id;
      const driveLink = `https://drive.google.com/file/d/${driveId}/view?usp=sharing`;
      const publicLink = `${process.env.SITE}api/v1/drive/file/${fileName}?id=${driveId}`;
      bot.sendMessage(chatId, `${fileName} 上传成功\n云盘 Link: ${driveLink}\nPublic link: ${publicLink}`);
    } catch (e) {
      bot.sendMessage(chatId, e.message || "发生了一个错误");
    }
  });

  bot.onText(/\/server diskinfo (.+)/, async (msg, match) => {
    const from = msg.chat.id;
    const path = match[1];
    const info = await diskinfo(path);
    bot.sendMessage(from, info);
  });

  bot.onText(/\/server uptime/, async msg => {
    const from = msg.chat.id;
    bot.sendMessage(from, humanTime(process.uptime() * 1000));
  });

  bot.onText(/\/server status/, async msg => {
    const from = msg.chat.id;
    const currStatus = await status();
    bot.sendMessage(from, currStatus);
  });

  bot.onText(searchRegex, async (msg, match) => {
    var from = msg.from.id;
    var site = match[1];
    var query = match[2];

    bot.sendMessage(from, "搜索中...");

    const data = await axios(`${api}api/v1/search/${site}?query=${query}`).then(({ data }) => data);

    if (!data || data.error) {
      bot.sendMessage(from, "服务器上发生错误");
    } else if (!data.results || data.results.length === 0) {
      bot.sendMessage(from, "找不到结果.");
    } else if (data.results.length > 0) {
      let results1 = "";
      let results2 = "";
      let results3 = "";

      data.results.forEach((result, i) => {
        if (i <= 2) {
          results1 += `名称: ${result.name} \n种子: ${result.seeds} \n详情: ${result.details} \n链接: ${result.link} \n\n`;
        } else if (2 < i && i <= 5) {
          results2 += `名称: ${result.name} \n种子: ${result.seeds} \n详情: ${result.details} \n链接: ${result.link} \n\n`;
        } else if (5 < i && i <= 8) {
          results3 += `名称: ${result.name} \n种子: ${result.seeds} \n详情: ${result.details} \n链接: ${result.link} \n\n`;
        }
      });

      bot.sendMessage(from, results1);
      bot.sendMessage(from, results2);
      bot.sendMessage(from, results3);
    }
  });

  bot.onText(detailsRegex, async (msg, match) => {
    var from = msg.from.id;
    var site = match[1];
    var query = match[2];

    bot.sendMessage(from, "读取中...");

    const data = await axios(`${api}/details/${site}?query=${query}`).then(({ data }) => data);
    if (!data || data.error) {
      bot.sendMessage(from, "生了一个错误");
    } else if (data.torrent) {
      const torrent = data.torrent;
      let result1 = "";
      let result2 = "";

      result1 += `名称: ${torrent.title} \n\n信息: ${torrent.info}`;
      torrent.details.forEach(item => {
        result2 += `${item.infoTitle} ${item.infoText} \n\n`;
      });
      result2 += "Magnet Link:";

      await bot.sendMessage(from, result1);
      await bot.sendMessage(from, result2);
      await bot.sendMessage(from, torrent.downloadLink);
    }
  });

  bot.onText(downloadRegex, (msg, match) => {
    var from = msg.from.id;
    var link = match[1];
    let messageObj = null;
    let torrInterv = null;

    const reply = async torr => {
      let mess1 = "";
      mess1 += `种子名称: ${torr.name}\n\n`;
      mess1 += `种子状态: ${torr.status}\n\n`;
      mess1 += `种子大小: ${torr.total}\n\n`;
      if (!torr.done) {
        mess1 += `当前已下载: ${torr.downloaded}\n\n`;
        mess1 += `当前速度: ${torr.speed}\n\n`;
        mess1 += `当前进度: ${torr.progress}%\n\n`;
        mess1 += `剩余时间: ${torr.redableTimeRemaining}\n\n`;
      } else {
        mess1 += `Link: ${torr.downloadLink}\n\n`;
        clearInterval(torrInterv);
        torrInterv = null;
      }
      mess1 += `Magnet URI: ${torr.magnetURI}`;
      try {
        if (messageObj) {
          if (messageObj.text !== mess1) bot.editMessageText(mess1, { chat_id: messageObj.chat.id, message_id: messageObj.message_id });
        } else messageObj = await bot.sendMessage(from, mess1);
      } catch (e) {
        console.log(e.message);
      }
    };

    const onDriveUpload = (torr, url) => bot.sendMessage(from, `${torr.name} uploaded to drive\n${url}`);
    const onDriveUploadStart = torr => bot.sendMessage(from, `Uploading ${torr.name} to gdrive`);

    if (link.indexOf("magnet:") !== 0) {
      bot.sendMessage(from, "Link is not a magnet link");
    } else {
      bot.sendMessage(from, "Starting download...");
      try {
        const torren = torrent.download(
          link,
          torr => reply(torr),
          torr => reply(torr),
          onDriveUpload,
          onDriveUploadStart
        );
        torrInterv = setInterval(() => reply(torrent.statusLoader(torren)), 5000);
      } catch (e) {
        bot.sendMessage(from, "An error occured\n" + e.message);
      }
    }
  });

  bot.onText(statusRegex, (msg, match) => {
    var from = msg.from.id;
    var link = match[1];

    const torr = torrent.get(link);
    if (link.indexOf("magnet:") !== 0) {
      bot.sendMessage(from, "Link is not a magnet link");
    } else if (!torr) {
      bot.sendMessage(from, "Not downloading please add");
    } else {
      let mess1 = "";
      mess1 += `种子名称: ${torr.name}\n\n`;
      mess1 += `种子状态: ${torr.status}\n\n`;
      mess1 += `种子大小: ${torr.total}\n\n`;
      if (!torr.done) {
        mess1 += `当前已下载: ${torr.downloaded}\n\n`;
        mess1 += `当前速度: ${torr.speed}\n\n`;
        mess1 += `当前进度: ${torr.progress}%\n\n`;
        mess1 += `剩余时间: ${torr.redableTimeRemaining}\n\n`;
      } else {
        mess1 += `Link: ${torr.downloadLink}\n\n`;
      }
      mess1 += `Magnet URI: ${torr.magnetURI}`;
      bot.sendMessage(from, mess1);
    }
  });

  bot.onText(removeRegex, (msg, match) => {
    var from = msg.from.id;
    var link = match[1];

    try {
      torrent.remove(link);
      bot.sendMessage(from, "删除成功");
    } catch (e) {
      bot.sendMessage(from, `${e.message}`);
    }
  });
}

module.exports = bot;
