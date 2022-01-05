import { Telegraf } from 'telegraf';

/**
 * Instance of the telegram bot
 */
export const bot = new Telegraf(process.env.BOT_TOKEN);

/**
 * Send a formatted message for the availability of a product
 *
 * @param {object} product Product informations
 */
export async function sendNewProductMessage(product) {
  const string = `A new product has just been added to the available products of the weekend:
🥫 ${product.name}
⚖️ ${product.quantity} ${product.unit}
💰 ${product.price} €/${product.unit}`;

  sendTelegramMessage(string);
}

/**
 * Send a message to the telegram channel
 *
 * @param {string} string Message
 */
export async function sendTelegramMessage(string) {
  if (process.env.BOT_TOKEN) {
    bot.telegram.sendMessage(process.env.CHANNEL_ID, string);
  }
}

/**
 * Send a formatted message when the updated list of available products is available
 *
 */
export async function sendAvailableProductsMessage() {
  sendTelegramMessage("Now it is possible to order all available products this week. Look at them on the web page.");
}

/**
 * Launch the telegram bot
 */
export function launchTelegramBot() {
  bot.launch();
}

// Enable graceful stop
if (process.env.BOT_TOKEN) {
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
