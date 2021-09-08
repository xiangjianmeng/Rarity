# Rarity

## 使用方法

1、在Ubuntu系统中运行 `./install.sh` 安装依赖，如果失败了可以根据脚本里的内容手动安装

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

5、立即执行一次adventure：运行 `yarn startNow`

6、每天凌晨12:00自动执行一次adventure：
- 启动：`./start.sh`
- 停止：`pm2 stop rarity`
- 查看Log：`pm2 log rarity`


## 说明

1. 目前为测试版本，不保证稳定可靠
2. gas price为web3自动设置，可能会消耗较多gas
