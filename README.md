# Rarity

## 使用方法

1、配置环境：
- 【推荐】 Ubuntu系统：切换到项目根目录，运行 `./install.sh` 安装依赖，如果失败了可以根据脚本里的内容手动安装
- Windows系统：参考下面的url，手动下载安装nodejs和yarn并配置环境变量。打开cmd，cd切换到项目根目录，输入`yarn`回车给项目安装依赖。

   https://nodejs.org
   https://classic.yarnpkg.com/en/docs/install/#windows-stable
   https://www.jianshu.com/p/2d9fa3659645
   https://blog.csdn.net/sanqima/article/details/108807898


2、创建secrets目录，和src目录平级

3、创建secrects/rarity_accounts.json文件，保存所有账号私钥，格式如下：
```json
{
  "privateKeys": [
    "xxx1",
    "xxx2",
  ]
}
```

4、从ftmscan下载所有账号ERC721的csv，保存到secrects目录，文件名中默认包含了该账号的地址（如果没有需要自己修改文件名）
https://ftmscan.com/address/0x123xxx456#tokentxnsErc721

下载的csv格式如下：
```
"Txhash","UnixTimestamp","DateTime","From","To","ContractAddress","TokenId","TokenName","TokenSymbol"
"0xac...","1630...","2021-09-05 13:00:00","0x0000000000000000000000000000000000000000","0x36...","0xce761d788df608bd21bdd59d6f4b54b2e27f25bb","00001","Rarity Manifested","RM"
```

5、立即执行一次adventure：运行 `yarn startNow` 或者 `node src/index_now.js`

6、常驻后台，自动执行adventure：

【建议】使用Linux系统，用pm2管理
- 启动/重启：`./start.sh`
- 停止：`pm2 stop rarity`
- 查看Log：`pm2 log rarity`

Windows系统：直接运行 `yarn start`，保持命令行窗口始终开启

## 说明

1. 目前为测试版本，不保证稳定可靠
2. gas price逻辑（具体可参考src/rariry/Rarity.js, src/base/ContractManager.js）：
    - 如果当前的gasPrice>150Gwei，终止操作，稍后会重新尝试
    - 如果当前的gasPrice>80Gwei，尝试用80Gwei发送transaction
    - 如果当前的gasPrice<80Gwei，直接用当前值发送transaction
