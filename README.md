# Rarity

## 配置环境

- 【推荐】 Ubuntu系统：切换到项目根目录，运行 `./install.sh` 安装依赖，如果失败了可以根据脚本里的内容手动安装
- Windows系统：参考下面的url，手动下载安装nodejs和yarn并配置环境变量。打开cmd，cd切换到项目根目录，输入`yarn`回车给项目安装依赖。

   https://nodejs.org
   https://classic.yarnpkg.com/en/docs/install/#windows-stable
   https://www.jianshu.com/p/2d9fa3659645
   https://blog.csdn.net/sanqima/article/details/108807898


## 账号批量管理

支持批量创建账号英雄等操作。如果已经手动创建了英雄，可以先跳过这部分。

为了安全，不在命令行中输入/输出私钥，均使用json文件读写，账号json文件格式统一为 `[{address,privateKey}, {...}, ...]`，只需要单个账号的只读取第一个，私钥会按需读取。

以下脚本已经过测试可用。还不放心的话，可以先看下源码，找少量账号先测试一下，确认无误后再使用更多号。

批量创建账号
- 参数: 创建账号数量，输出账号列表
```bash
node src/scripts/batch-create-accounts.js 10 accounts.json
```

批量查看FTM余额
- 参数：账号列表
```bash
node src/scripts/batch-check-ether.js secrets/rarity-accounts.json
```

批量FTM转账
- 参数：转出账号(使用列表中的第一个)，转入账号列表，每个账号转账FTM数量
```bash
node src/scripts/batch-transfer-ether.js src-account.json dst-accounts.json 5e18
```

批量创建英雄
- 参数：账号列表，每个账号英雄数量（默认会按class=1-11循环，建议数量设置为11的倍数）
```bash
node src/rarity/scripts/batch-create-heros.js accounts.json 11
```

指定账号中创建单个英雄（可用于批量创建时少数失败调用的补创建）
- 参数：账号列表(列表中包含了指定的账号即可)，指定账号地址，英雄的class
```bash
node src/rarity/scripts/manually-create-hero.js accounts.json 0x123...456 5
```

## 配置游戏账号

1、创建secrets目录，和src目录平级

2、创建secrects/rarity-accounts.json文件，保存所有账号地址和私钥，格式如下：
```json
[
  {
    "address": "0x123...",
    "privateKey": "123..."
  },
  {
    "address": "0x123...",
    "privateKey": "123..."
  }
]
```

3、从ftmscan下载所有账号ERC721的csv，保存到secrects目录，文件名中默认包含了该账号的地址（如果没有需要自己修改文件名）
https://ftmscan.com/address/0x123xxx456#tokentxnsErc721

下载的csv格式如下：
```
"Txhash","UnixTimestamp","DateTime","From","To","ContractAddress","TokenId","TokenName","TokenSymbol"
"0xac...","1630...","2021-09-05 13:00:00","0x0000000000000000000000000000000000000000","0x36...","0xce761d788df608bd21bdd59d6f4b54b2e27f25bb","00001","Rarity Manifested","RM"
```


## 游戏运行

立即执行一次adventure + craft
```bash
node src/rarity/scripts/start-adventure.js
```

常驻后台，自动执行adventure + craft

- 【建议】使用Linux系统，用pm2管理
  1. 启动/重启：`./start.sh`
  1. 停止：`pm2 stop rarity`
  1. 查看Log：`pm2 log rarity`

- Windows系统：直接运行 `yarn start`，保持命令行窗口始终开启

领取金币
```bash
node src/rarity/scripts/start-claim-gold.js
```

随机分配英雄attributes
```bash
node src/rarity/scripts/start-assign-attributes.js
```

## 说明

1. 目前为测试版本，不保证稳定可靠
2. gas price逻辑：具体可参考 `GasPriceCalculators.default()`


## 常见问题

1. `transaction underpriced`: 可能是当前gasPrice较高，而设置的gasPrice过低，GasPriceCalculators.default 修改成120e9 或者更高试试
