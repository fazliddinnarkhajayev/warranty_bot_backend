import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Bot, InlineKeyboard, session } from 'grammy';
import { TelegramAuthService } from './telegram.auth.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { WarrantyHistoriesRepository } from 'src/shared/repositories/warranty-histories.repository';

@Injectable()
export class TelegramService implements OnModuleInit {
  bot: Bot;

  @Inject()
  private readonly telegramAuthService: TelegramAuthService;

  @Inject()
  private readonly usersService: UsersService;

  @Inject()
  private readonly productsService: ProductsService;

  @Inject()
  private readonly warrantyHistoriesRepository: WarrantyHistoriesRepository;

  async onModuleInit() {
    this.bot = new Bot('8442054593:AAFs7SI4aGCmYO1tTFJLt06jf0QmjGv8Mjc');

    this.bot.use(
      session({
        initial: () => ({ user: null, warrantyStep: null, warrantyData: null }),
      }),
    );

    this.bot.use(async (ctx, next) => {
      const telegramId = ctx.from?.id?.toString();
      if (!telegramId) return next();

      const user =
        await this.telegramAuthService.getUserBytelegramId(telegramId);
      if (user) ctx['session'].user = user;

      await next();
    });

    this.bot.use(async (ctx, next) => {
      const isStart = ctx.message?.text === '/start';
      const isContact = Boolean(ctx.message?.contact);

      if (!ctx['session'].user) {
        if (isStart || isContact) {
          return next(); // login qilishga ruxsat
        }

        await ctx.reply('📱 Iltimos telefon raqamingizni yuboring');
        return;
      }

      await next();
    });

    // -------------------- START COMMAND --------------------
    this.bot.command('start', (ctx) => this.handleStart(ctx));

    // -------------------- CONTACT HANDLER --------------------
    this.bot.on('message:contact', (ctx) => this.handleContact(ctx));

    // -------------------- MESSAGE HANDLER (steps) --------------------
    this.bot.on('message', async (ctx) => {
      const step = ctx['session'].warrantyStep;
      if (!step) return;

      switch (step) {
        case 'phone':
          await this.handlePhoneStep(ctx);
          break;
        case 'product_code':
          await this.handleProductCodeStep(ctx);
          break;
        case 'confirm':
          await this.handleConfirmStep(ctx);
          break;
        default:
          break;
      }
    });

    // -------------------- CALLBACK QUERY HANDLER --------------------
    this.bot.on('callback_query:data', (ctx) => this.handleCallback(ctx));

    await this.bot.start();
    console.log('🤖 Telegram bot ishga tushdi');
  }

  // -------------------- START --------------------
  private async handleStart(ctx: any) {
    await ctx.reply('Iltimos, Telefon raqamingizni yuboring', {
      reply_markup: {
        keyboard: [
          [{ text: '📲 Telefon raqamini yuborish', request_contact: true }],
        ],
        resize_keyboard: true,
      },
    });
  }

  // -------------------- CONTACT --------------------
  private async handleContact(ctx: any) {
    const phone = ctx.message.contact.phone_number.trim().replace('+', '');
    try {
      // DB login by phone
      const res = await this.telegramAuthService.loginByPhone(phone);

      if (!res.success) {
        await ctx.reply('❌ Siz tizimda yo‘qsiz');
        return;
      }

      ctx.session.user = res.user;
      await ctx.reply(`Xush kelibsiz, ${res.user.first_name}`);
      this.showMenu(ctx, res.user.role);
    } catch (err) {
      console.log('Contact error: ', err);
      await ctx.reply('❌ Siz tizimda yo‘qsiz');
    }
  }

  // -------------------- SHOW MENU --------------------
  private showMenu(ctx: any, role: string) {
    switch (role) {
      case 'seller':
        ctx.reply('📋 Sotuvchi menyusi', {
          reply_markup: new InlineKeyboard()
            .text('🟢 Kafolatni yoqish', 'seller_warranty_activate')
            .row()
            .text('📦 Kafolatlar tarixi', 'seller_warranty_history')
            .row()
            .text('ℹ️ Ma’lumot', 'seller_info'),
        });
        break;
      default:
        ctx.reply('❌ Sizning rolingiz aniqlanmadi');
        break;
    }
  }

  // -------------------- CALLBACKS --------------------
  private async handleCallback(ctx: any) {
    const data = ctx.callbackQuery.data;
    const user_role = ctx.session.user.role;

    switch (data) {
      case 'seller_warranty_activate':
        await ctx.answerCallbackQuery({
          text: 'Kafolatni aktivatsiya qilasiz!',
        });
        await ctx.reply('📲 Iltimos, mijoz telefon raqamini kiriting:');
        ctx.session.warrantyStep = 'phone';
        break;

      case 'seller_warranty_history':
        await ctx.answerCallbackQuery({ text: 'Kafolatlar tarixi' });
        const history = await this.getSellerWarrantyHistory(
          ctx.session.user.id,
        );
        await ctx.reply(`📦 Sizning kafolatlar tarixingiz:\n${history}`);
        break;

      case 'seller_info':
        await ctx.answerCallbackQuery({ text: 'Sotuvchi haqida' });
        await ctx.reply(
          `ℹ️ Siz ${ctx.session.user.first_name} ${ctx.session.user.last_name} ${user_role == 'seller' ? 'sotuvchi' : 'foydalanuvchi'} sifatida tizimda ro‘yxatdan o‘tgan foydalanuvchisiz.`,
        );
        break;

      default:
        await ctx.answerCallbackQuery({ text: '❌ Noma’lum amal' });
        break;
    }
  }

  // -------------------- PHONE STEP --------------------
  private async handlePhoneStep(ctx: any) {
    let phone = ctx.message?.text?.toString().trim() || '';
    phone = phone.replace(/\D/g, '');

    if (!this.isValidUzbekPhone(phone)) {
      await ctx.reply(
        '❌ Telefon raqam noto‘g‘ri. Faqat O‘zbek raqami (+998XXXXXXXXX) qabul qilinadi.',
      );
      return;
    }

    ctx.session.warrantyData = { phone };
    ctx.session.warrantyStep = 'product_code';
    await ctx.reply('📦 Iltimos, mahsulot kodini kiriting:');
  }

  // -------------------- PRODUCT CODE STEP --------------------
  private async handleProductCodeStep(ctx: any) {
    const productCode = ctx.message?.text?.toString().trim();
    if (!(await this.isValidProductCode(productCode))) {
      await ctx.reply(
        '❌ Bunday mahsulot kodi mavjud emas. Iltimos, qayta kiriting:',
      );
      return;
    }

    ctx.session.warrantyData.productCode = productCode;
    ctx.session.warrantyStep = 'confirm';
    await ctx.reply(
      `✅ Ma’lumotlar:\nTelefon: ${ctx.session.warrantyData.phone}\nMahsulot kodi: ${productCode}\n\nTasdiqlaysizmi? (ha/yo‘q)`,
    );
  }

  // -------------------- CONFIRM STEP --------------------
  private async handleConfirmStep(ctx: any) {
    const answer = ctx.message?.text?.toString().trim().toLowerCase();
    if (answer === 'ha') {
      await this.activateWarranty(
        ctx.session.warrantyData,
        ctx.session.user.id,
      );
      await ctx.reply('🟢 Kafolat muvaffaqiyatli aktivatsiya qilindi!');
    } else if (answer === "yo'q" || answer === 'yo‘q' || answer === 'yoq') {
      await ctx.reply('❌ Kafolat aktivatsiyasi bekor qilindi.');
    } else {
      return await ctx.reply(`✅ Tasdiqlaysizmi? (ha/yo‘q)`);
    }

    ctx.session.warrantyStep = null;
    ctx.session.warrantyData = null;
    this.showMenu(ctx, 'seller');
  }

  // -------------------- PHONE VALIDATION --------------------
  private isValidUzbekPhone(phone: string): boolean {
    return /^998\d{9}$/.test(phone);
  }

  // -------------------- PRODUCT CODE VALIDATION --------------------
  private async isValidProductCode(productCode: string): Promise<boolean> {
    const product = await this.productsService.getByCode(productCode);

    if (!product) {
      return false;
    }

    const history = await this.warrantyHistoriesRepository.findByProductId(
      product.id,
    );
    if (history) {
      return false;
    }

    return true;
  }

  // -------------------- ACTIVATE WARRANTY --------------------
  private async activateWarranty(
    data: { phone: string; productCode: string },
    sellerId: number,
  ) {
    const product = await this.productsService.getByCode(data.productCode);
    await this.warrantyHistoriesRepository.create({
      product_id: product.id,
      phone: data.phone,
      seller_id: sellerId,
    });
  }

  // -------------------- GET SELLER WARRANTY HISTORY --------------------
  private async getSellerWarrantyHistory(sellerId: number): Promise<string> {
    const histories =
      await this.warrantyHistoriesRepository.findHistoriesBySellerId(sellerId);
    histories.map((history) => {
      return `Mahsulot kodi: ${history.product_code}; Haridor telefon raqami: ${history.phone}, Aktivlashtirgan sana: ${history.activated_at}`;
    });

    return histories.join('\n');
  }
}
