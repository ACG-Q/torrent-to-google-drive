/*
 * @Author: 六记
 * @Date: 2021-05-18 12:32:01
 * @LastEditTime: 2021-05-18 18:33:11
 * @Description: 汉化，添加help命令
 * @FilePath: \lib\bot.js
 */
const axios = require("axios");

const status = require("../utils/status");
const diskinfo = require("../utils/diskinfo");
const humanTime = require("../utils/humanTime");
const { uploadFileStream } = require("../utils/gdrive");

const api = process.env.SEARCH_SITE || "https://torrent-aio-bot.herokuapp.com/";
console.log("Using api: ", api);

const helpRegex = /\/start|help/;// 帮助信息
const searchRegex = /\/search (piratebay|limetorrent|1337x) (.+)/;// 搜索 torrents
const detailsRegex = /\/details (piratebay|limetorrent|1337x) (.+)/;// 获取torrent的详细信息
const serverDiskinfoRegex = /\/server diskinfo (.+)/;// 服务器磁盘状态
const serverUptimeRegex = /\/server uptime/;// 服务器运行状态
const serverStatusRegex = /\/server status/;// 服务器状态
const downloadRegex = /\/download (.+)/;// 下载
const statusRegex = /\/status (.+)/;// 检查下载torrent的状态
const removeRegex = /\/remove (.+)/;// 删除已添加的torrent
const logsRegex = /\/logs/;// 日志信息

const startMessage = `
欢迎使用，以下是一些让您开始使用的命令：

有3个网站可供搜索: piratebay, 1337x and limetorrent

/search {site} {query} - 搜索 torrents
您搜索要搜索的内容
例如. 
    /search piratebay Chernobyl
    /search limetorrent Dark
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
torent下载开始时提供信息哈希
例如.
    /status magnet:?xt=urn:btih:sdfasdfas

/remove {magnet link} -  删除已添加的torrent
eg.
    /remove magnet:?xt=urn:btih:sdfasdfas

若要上载文件，请将文件发送到此bot，它将直接上载到驱动器

服务器状态命令

/server status
/server uptime
/server diskinfo

Happy torrenting :)
`;

function bot(torrent, bot) {
  bot.onText(helpRegex, async msg => {
    bot.sendMessage(msg.chat.id, startMessage);
  });

  bot.on("message", async msg => {
    if (!msg.document) return;
    const chatId = msg.chat.id;
    const mimeType = msg.document.mimeType;
    const fileName = msg.document.file_name;
    const fileId = msg.document.file_id;

    bot.sendMessage(chatId, "📤 正在上载文件...");
    try {
      const uploadedFile = await uploadFileStream(fileName, bot.getFileStream(fileId));
      const driveId = uploadedFile.data.id;
      const driveLink = `https://drive.google.com/file/d/${driveId}/view?usp=sharing`;
      const publicLink = `${process.env.SITE}api/v1/drive/file/${fileName}?id=${driveId}`;
      bot.sendMessage(chatId, `${fileName} 上传成功\nGdrive link: ${driveLink}\nPublic link: ${publicLink}`);
    } catch (e) {
      bot.sendMessage(chatId, e.message || "发生了一个错误 🥺");
    }
  });

  bot.onText(serverDiskinfoRegex, async (msg, match) => {
    const from = msg.chat.id;
    const path = match[1];
    const info = await diskinfo(path);
    bot.sendMessage(from, info);
  });

  bot.onText(serverUptimeRegex, async msg => {
    const from = msg.chat.id;
    bot.sendMessage(from, humanTime(process.uptime() * 1000));
  });

  bot.onText(serverStatusRegex, async msg => {
    const from = msg.chat.id;
    const currStatus = await status();
    bot.sendMessage(from, currStatus);
  });

  bot.onText(searchRegex, async (msg, match) => {
    var from = msg.from.id;
    var site = match[1];
    var query = match[2];

    bot.sendMessage(from, "🔍 搜索中...");

    const data = await axios(`${api}api/v1/search/${site}?query=${query}`).then(({ data }) => data);

    if (!data || data.error) {
      bot.sendMessage(from, "服务器上发生错误 🥺");
    } else if (!data.results || data.results.length === 0) {
      bot.sendMessage(from, "❌ 找不到结果.");
    } else if (data.results.length > 0) {
      let results1 = "";
      let results2 = "";
      let results3 = "";

      data.results.forEach((result, i) => {
        if (i <= 2) {
          results1 += `名称: ${result.name} \n种子: ${result.seeds} \n详情: ${result.details} \n磁力链接: ${result.link} \n\n`;
        } else if (2 < i && i <= 5) {
          results2 += `名称: ${result.name} \n种子: ${result.seeds} \n详情: ${result.details} \n磁力链接: ${result.link} \n\n`;
        } else if (5 < i && i <= 8) {
          results3 += `名称: ${result.name} \n种子: ${result.seeds} \n详情: ${result.details} \n磁力链接: ${result.link} \n\n`;
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

    bot.sendMessage(from, "⏱️ 读取中...");

    const data = await axios(`${api}/details/${site}?query=${query}`).then(({ data }) => data);
    if (!data || data.error) {
      bot.sendMessage(from, "发生了一个错误 🥺");
    } else if (data.torrent) {
      const torrent = data.torrent;
      let result1 = "";
      let result2 = "";

      result1 += `🏷️ 名称: ${torrent.title} \n\n信息: ${torrent.info}`;
      torrent.details.forEach(item => {
        result2 += `${item.infoTitle} ${item.infoText} \n\n`;
      });
      result2 += "🧲 磁力链接:";

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
      mess1 += `🏷️ 种子名称: ${torr.name}\n\n`;
      mess1 += `📱 种子状态: ${torr.status}\n\n`;
      mess1 += `📏 种子大小: ${torr.total}\n\n`;
      if (!torr.done) {
        mess1 += `✅ 已下载: ${torr.downloaded}\n\n`;
        mess1 += `🚀 当前速度: ${torr.speed}\n\n`;
        mess1 += `📥 当前进度: ${torr.progress}%\n\n`;
        mess1 += `⏳ 剩余时间 : ${torr.redableTimeRemaining}\n\n`;
      } else {
        mess1 += `🔗 下载链接: ${torr.downloadLink}\n\n`;
        clearInterval(torrInterv);
        torrInterv = null;
      }
      mess1 += `🧲 磁力链接: ${torr.magnetURI}`;
      try {
        if (messageObj) {
          if (messageObj.text !== mess1) bot.editMessageText(mess1, { chat_id: messageObj.chat.id, message_id: messageObj.message_id });
        } else messageObj = await bot.sendMessage(from, mess1);
      } catch (e) {
        console.log(e.message);
      }
    };

    const onDriveUpload = (torr, url) => bot.sendMessage(from, `${torr.name} 已上传到 Gdrive 📁:\n${url}`);
    const onDriveUploadStart = torr => bot.sendMessage(from, `📤 正在上传 ${torr.name} 到 Gdrive...`);

    if (link.indexOf("magnet:") !== 0) {
      bot.sendMessage(from, "❌ 这链接看起来不像是磁力");
    } else {
      bot.sendMessage(from, "✔️ 开始下载...");
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
        bot.sendMessage(from, "发生了一个错误🥺\n" + e.message);
      }
    }
  });

  bot.onText(statusRegex, (msg, match) => {
    var from = msg.from.id;
    var link = match[1];

    const torr = torrent.get(link);
    if (link.indexOf("magnet:") !== 0) {
      bot.sendMessage(from, "🧲 这链接看起来不像是磁力");
    } else if (!torr) {
      bot.sendMessage(from, "❌ 未下载请添加");
    } else {
      let mess1 = "";
      mess1 += `🏷️ 种子名称: ${torr.name}\n\n`;
      mess1 += `📱 种子状态: ${torr.status}\n\n`;
      mess1 += `📏 种子大小: ${torr.total}\n\n`;
      if (!torr.done) {
        mess1 += `✅ 已下载: ${torr.downloaded}\n\n`;
        mess1 += `🚀 当前速度: ${torr.speed}\n\n`;
        mess1 += `📥 当前进度: ${torr.progress}%\n\n`;
        mess1 += `⏳ 剩余时间 : ${torr.redableTimeRemaining}\n\n`;
      } else {
        mess1 += `🔗 下载链接: ${torr.downloadLink}\n\n`;
      }
      mess1 += `🧲 磁力链接: ${torr.magnetURI}`;
      bot.sendMessage(from, mess1);
    }
  });

  bot.onText(removeRegex, (msg, match) => {
    var from = msg.from.id;
    var link = match[1];

    try {
      torrent.remove(link);
      bot.sendMessage(from, "已删除 🚮");
    } catch (e) {
      bot.sendMessage(from, `${e.message}`);
    }
  });
  
  bot.onText(logsRegex, async msg => {
    var from = msg.from.id;

    const data = await axios(`${api}logs`).then(({ data }) => data);
    
    bot.sendMessage(from, data);
  });
}

module.exports = bot;
