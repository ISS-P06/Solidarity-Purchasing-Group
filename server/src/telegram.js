import { Telegraf, Markup } from 'telegraf';
import { randomInt } from 'crypto';

/**
 * Instance of the telegram bot
 */
export const bot = initTelegraf();

/**
 * Check the env variable and start the bot
 *
 * @returns Instace of the bot or `false`
 */
function initTelegraf() {
  if (process.env.BOT_ACTIVE === 'true' && process.env.BOT_TOKEN) {
    console.log('==> Telegram bot is up and running');
    return new Telegraf(process.env.BOT_TOKEN);
  } else {
    console.log('==> Telegram bot is not running');
    return null;
  }
}

/**
 * Send a formatted message for the availability of a product
 *
 * @param {object} product Product informations
 */
export async function sendNewProductMessage(product) {
  const string = `A new product has just been added to the available products of the week:
🥫 ${product.name}
⚖️ ${product.quantity} ${product.unit}
💰 ${product.price} €/${product.unit}`;

  sendTelegramMessage(string);
}

/**
 * Send a formatted message when the updated list of available products is available
 *
 */
export async function sendAvailableProductsMessage() {
  sendTelegramMessage(
    "Now it's possible to order all the available products of the week\nHave a look on the app 👀"
  );
}

/**
 * Send a message to the telegram channel
 *
 * @param {string} string Message
 */
export async function sendTelegramMessage(string) {
  if (!bot) {
    return;
  }

  const keyboard = Markup.inlineKeyboard([
    Markup.button.url('Solidarity Purchasing Group', 'https://spg06.herokuapp.com/'),
  ]);

  const finger = ['👇', '👇🏻', '👇🏿', '👇🏽', '👇🏾', '👇🏼'][randomInt(6)];

  bot.telegram.sendMessage(
    process.env.CHANNEL_ID,
    `${string}\n\nClick on the link below! ${finger}`,
    keyboard
  );
}

/**
 * Launch the telegram bot
 */
export function launchTelegramBot() {
  if (bot !== null) {
    bot.launch();
  }
}

// Enable graceful stop
if (bot !== null) {
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}
