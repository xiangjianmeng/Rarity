/**
 * 创建英雄
 * - 参数：带私钥的账号列表，每个账号英雄数量（默认会按class=1-11循环，建议数量设置为11的倍数）
 */
const path = require('path')
const Rarity = require('../Rarity')
const rarity = new Rarity()

async function main() {
  console.log(process.argv)
  const accounts = require(path.resolve('.', process.argv[2]))
  const heroCount = Number(process.argv[3])

  console.log(`will mint ${heroCount} heros for each of ${accounts.length} accounts`)

  for (const account of accounts) {
    const address = await rarity.addAccount(account.privateKey)
    if (address !== account.address) {
      console.error(`account ${address} import failed`)
      continue
    }
    console.log(`min heros for account ${address}`)
    for (let i = 0; i < heroCount; ++i) {
      const _class = i % 11 + 1
      console.log(`mint hero ${i} with class ${_class} for account ${address}`)
      try {
        await rarity.summon(address, _class)
      } catch (e) {
        console.error(`mint hero ${i} failed`, e)
      }
    }
  }
  console.log(`complete`)
}

main()
