const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = '1426947243075829761';

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

async function getSteamDeals() {
  try {
    const res = await axios.get(
      'https://store.steampowered.com/api/featuredcategories'
    );

    return res.data.specials.items.slice(0, 5);
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function sendDeals() {
  const channel = await client.channels.fetch(CHANNEL_ID);

  const deals = await getSteamDeals();

  for (const game of deals) {
  const oldPrice = (game.original_price / 100).toFixed(2);
   const newPrice = (game.final_price / 100).toFixed(2);

   const currency = game.currency || "USD";

    const embed = new EmbedBuilder()
      .setTitle(game.name)
      .setURL(`https://store.steampowered.com/app/${game.id}`)
      .setImage(game.large_capsule_image)
 .addFields(
  {
    name: 'Discount',
    value: `${game.discount_percent}%`,
    inline: true
  },
  {
    name: 'Old Price',
    value: `${oldPrice} ${currency}`,
    inline: true
  },
  {
    name: 'New Price',
    value: `${newPrice} ${currency}`,
    inline: true
  }
)
.setColor('Green');

    await channel.send({ embeds: [embed] });
  }
}

client.once('ready', async () => {
  console.log(`${client.user.tag} is online`);

  sendDeals();

  setInterval(sendDeals, 1000 * 60 * 60);
});

client.login(TOKEN);