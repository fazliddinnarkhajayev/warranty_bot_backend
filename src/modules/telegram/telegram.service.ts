import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Bot, InlineKeyboard, session } from 'grammy';
import { TelegramAuthService } from './telegram.auth.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { WarrantyHistoriesRepository } from 'src/shared/repositories/warranty-histories.repository';
import { CustomersRepository } from 'src/shared/repositories/customers.repository';
import { ServicesLogsRepository } from 'src/shared/repositories/services-logs.repository';
import { dot } from 'node:test/reporters';

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

  @Inject()
  private readonly customersRepository: CustomersRepository;

  @Inject()
  private readonly servicesLogsRepository: ServicesLogsRepository

  async onModuleInit() {
    this.initBot()
  }

  async initBot() {
    try {
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
        console.log({ location: 'mid', user })
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
        await this.bot.api.setMyCommands([
          { command: "menu", description: "Menu" },
        ]);
        await next();
      });

      // -------------------- START COMMAND --------------------
      this.bot.command('start', (ctx) => this.handleStart(ctx));

      // ------------------- MENU COMMAND -----------------------
      this.bot.command('menu', async (ctx) => {
        if (!ctx['session'].user) {
          this.handleStart(ctx)
        }
        await this.showMenu(ctx, ctx['session'].user.role);
      });

      // -------------------- CONTACT HANDLER --------------------
      this.bot.on('message:contact', (ctx) => this.handleContact(ctx));

      // -------------------- MESSAGE HANDLER (steps) --------------------
      this.bot.on('message', async (ctx) => {
        const step = ctx['session'].warrantyStep;
        console.log({ step })
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
          case 'repairing_product_code':
            await this.handleRepairingProductCode(ctx);
            break;
          case 'repairing_problem':
            await this.handleRepairingProblem(ctx);
            break;
          case 'repairing_solution':
            await this.handleRepairingSolution(ctx);
            break;
          case 'repairing_cost':
            await this.handleRepairingPrice(ctx);
            break;
          case 'repairing_submit':
            await this.handleRepairingConfirmStep(ctx);
            break;
          default:
            break;
        }
      });

      // -------------------- CALLBACK QUERY HANDLER --------------------
      this.bot.on('callback_query:data', (ctx) => this.handleCallback(ctx));

      await this.bot.start();
      console.log('🤖 Telegram bot ishga tushdi');
    } catch (err: any) {
      console.log('Error while starting bot', err)
    }
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

      await this.telegramAuthService.setTelegramId(
        res.user.id,
        ctx.message.contact.user_id.toString(),
        res.user.role,
      );

      ctx.session.user = res.user;
      await ctx.reply(`Xush kelibsiz, ${res.user.first_name} ${res.user.last_name}!`);
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
            .text('🟢 Kafolatni yoqish', 'seller_warranty_create')
            .row()
            .text('📦 Kafolatlar tarixi', 'seller_warranty_history')
            .row()
            .text('ℹ️ Ma’lumot', 'seller_info'),
        });
      case 'customer':
        ctx.reply('📋 Haridor menyusi', {
          reply_markup: new InlineKeyboard()
            .text('🟢 Kafolatni aktivlashtrish', 'customer_warranty_activation')
            .row()
            .text('📦 Kafolatlar tarixi', 'customer_warranty_history')
            .row()
            .text('ℹ️ Ma’lumot', 'customer_info'),
        });
        break;
      case 'technician':
        ctx.reply('📋 Texnik menyusi', {
          reply_markup: new InlineKeyboard()
            .text('🟢 Tamirlashni aktivlashtrish', 'technician_repairing_activation')
            .row()
            .text('📦 Tamirlar tarixi', 'technician_repairing_history')
            .row()
            .text('ℹ️ Ma’lumot', 'technician_info'),
        });
        break;
      default:
        ctx.reply('❌ Sizning rolingiz aniqlanmadi');
        break;
    }
  }

  private async showCustomerWarrantiesToActivate(ctx: any, phone: string) {

    const createdProducts = await this.warrantyHistoriesRepository.findCreatedByPhone(phone);

    if (!createdProducts.length) {
      ctx.reply('Aktivlashtrish uchun mahsulot topilmadi')
    } else {
      const productsMenu = new InlineKeyboard();

      // Dynamic menu uchun loop
      for (const item of createdProducts) {
        // item.name va item.id ni o'zing yaratgan product obyektiga qarab o'zgartir
        productsMenu.text(`📦 Mahsulot kodi: ${item.product_code}`, `product_to_activate_#${item.id}`).row();
      }
      ctx.reply('📋 Aktivlashtrish uchun mahsulotni tanlang', {
        reply_markup: productsMenu
      });

    }
  }

  // -------------------- CALLBACKS --------------------
  private async handleCallback(ctx: any) {
    const data = ctx.callbackQuery.data;

    if (data.split('_#').length == 1) {

      switch (data) {
        case 'seller_warranty_create':
          await ctx.answerCallbackQuery({
            text: 'Kafolatni yaratasiz!',
          });
          await ctx.reply('📲 Iltimos, mijoz telefon raqamini kiriting:');
          ctx.session.warrantyStep = 'phone';
          break;

        case 'technician_repairing_activation':
          await ctx.answerCallbackQuery({
            text: 'Tamirlashni aktivlashtirish !',
          });
          await ctx.reply('Iltimos, Mahsulot code`ni kiriting');
          ctx.session.warrantyStep = 'repairing_product_code';
          break;

        case 'customer_warranty_activation':
          await ctx.answerCallbackQuery({
            text: 'Kafolatni aktivlashtirasiz!',
          });
          await this.showCustomerWarrantiesToActivate(ctx, ctx.session.user.phone);
          ctx.session.warrantyStep = 'customer_warranty_activation';
          break;

        case 'seller_warranty_history':
          await ctx.answerCallbackQuery({ text: 'Kafolatlar tarixi' });
          const history = await this.getSellerWarrantyHistory(
            ctx.session.user.id,
          );
          await ctx.reply(`📦 Sizning kafolatlar tarixingiz:\n${history}`);
          break;

        case 'customer_warranty_history':
          await ctx.answerCallbackQuery({ text: 'Kafolatlar tarixi' });
          const customer_history = await this.getCustomerWarrantyHistory(
            ctx.session.user.phone,
          );
          await ctx.reply(`📦 Sizning kafolatlar tarixingiz:\n${customer_history}`);
          break;

        case 'technician_repairing_history':
          await ctx.answerCallbackQuery({ text: 'Kafolatlar tarixi' });
          const technician_history = await this.getTechniciansRepairingHistory(
            ctx.session.user.phone,
          );
          await ctx.reply(`📦 Sizning tamirlar tarixingiz:\n${technician_history}`);
          break;


        case 'seller_info':
          await ctx.answerCallbackQuery({ text: 'Sotuvchi haqida' });
          await ctx.reply(
            `ℹ️ Siz ${ctx.session.user.first_name} ${ctx.session.user.last_name} Sotuvchi sifatida tizimda ro‘yxatdan o‘tgan foydalanuvchisiz.`,
          );
          break;

        case 'customer_info':
          await ctx.answerCallbackQuery({ text: 'Haridor haqida' });
          await ctx.reply(
            `ℹ️ Siz ${ctx.session.user.first_name} ${ctx.session.user.last_name} Haridor sifatida tizimda ro‘yxatdan o‘tgan foydalanuvchisiz.`,
          );
          break;

        case 'technician_info':
          await ctx.answerCallbackQuery({ text: 'Texnik haqida' });
          await ctx.reply(
            `ℹ️ Siz ${ctx.session.user.first_name} ${ctx.session.user.last_name} Texnik sifatida tizimda ro‘yxatdan o‘tgan foydalanuvchisiz.`,
          );
          break;

        default:
          await ctx.answerCallbackQuery({ text: '❌ Noma’lum amal' });
          break;
      }
    } else {
      if (data.startsWith('product')) {
        const warranty_history_id = data.split('_#')[1];
        await this.warrantyHistoriesRepository.update(warranty_history_id, { status: 'ACTIVATED', activated_at: new Date() })
        await ctx.reply('Kafolat muvaffaqiyatli aktivlashtirildi !');
      }
    }

  }

  // -------------------- PHONE STEP --------------------
  private async handlePhoneStep(ctx: any) {
    let phone = ctx.message?.text?.toString().trim() || '';
    phone = phone.replace(/\D/g, '');
    console.log(phone)
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
      await this.createCustomerIfNotExists(ctx.session.warrantyData);
      await this.createWarranty(
        ctx.session.warrantyData,
        ctx.session.user.id,
      );
      await ctx.reply('🟢 Kafolat muvaffaqiyatli yaratildi!');
    } else if (answer === "yo'q" || answer === 'yo‘q' || answer === 'yoq') {
      await ctx.reply('❌ Kafolat yaratish bekor qilindi.');
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

  // -------------------- CREATE WARRANTY --------------------
  private async createWarranty(
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

  private async createServiceToProduct(
    data: any,
    technician_id: number,
  ) {
    const dto = {
      product_id: data.product_id,
      problem: data.problem,
      solution: data.solution,
      price: data.price,
      technician_id: technician_id,
      is_warranty: data.is_warranty
    }
    await this.servicesLogsRepository.create(dto);
  }

  private async createCustomerIfNotExists(data: { phone: string; productCode: string }) {
    const customer = await this.customersRepository.findByPhone(data.phone);
    if (!customer) {
      await this.customersRepository.create({ phone: data.phone });
    }
  }

  // -------------------- GET SELLER WARRANTY HISTORY --------------------
  private async getSellerWarrantyHistory(sellerId: number): Promise<string> {
    const histories =
      await this.warrantyHistoriesRepository.findHistoriesBySellerId(sellerId);
    const str = histories.map((history) => {
      return `\nMahsulot kodi: ${history.product_code}; \nHaridor telefon raqami: ${history.phone}; \nStatus: ${history.status}; \nAriza yaratilgan sana: ${this.formatDate(history.created_at)}; ${history.activated_at ? `\nAktivlashtirgan sana: ${this.formatDate(history.activated_at)};` : ''} \n---------------------`;
    });
    return str.join('\n');
  }

  private async getCustomerWarrantyHistory(phone: string): Promise<string> {
    const histories =
      await this.warrantyHistoriesRepository.findHistoriesByCustomerPhone(phone);
    const str = histories.map((history) => {
      return `\nMahsulot kodi: ${history.product_code}; \nHaridor telefon raqami: ${history.phone}; \nStatus: ${history.status}; \nAriza yaratilgan sana: ${this.formatDate(history.created_at)}; ${history.activated_at ? `\nAktivlashtirgan sana: ${this.formatDate(history.activated_at)};` : ''} \n---------------------`;
    });
    return str.join('\n');
  }

  private async getTechniciansRepairingHistory(phone: string): Promise<string> {
    const histories =
      await this.servicesLogsRepository.findAllByTechnicianPhone(phone);
    const str = histories.map((history) => {
      return `\nMahsulot kodi: ${history.product_code}; \nHaridor telefon raqami: ${history.phone}; \nAriza yaratilgan sana: ${this.formatDate(history.created_at)};`;
    });
    return str.join('\n');
  }

  //   CREATING REPAIRING HANDLE PRODUCT CODE 
  private async handleRepairingProductCode(ctx: any) {
    const answer = ctx.message?.text?.toString().trim().toLowerCase();

    const product = await this.productsService.getByCode(answer);
    if (!product) {
      await ctx.reply(
        '❌ Bunday mahsulot kodi mavjud emas. Iltimos, qayta kiriting:',
      );
      return;
    }
    const warranty = await this.warrantyHistoriesRepository.findByProductId(product.id);
    if (!warranty) {
      await ctx.reply(
        `Mahsulot: ${product.name} \nMahsulot uchun kafolat toplimadi`,
      );

      ctx.session.warrantyStep = 'repairing_problem';
      ctx.session.warrantyData = { is_warranty: false, product_code: answer, product_id: product.id };
    }
    if (warranty) {
      await ctx.reply(
        `Mahsulot: ${product.name} \nMahsulot ${this.formatDate(warranty.activated_at)} gacha kafolatlangan`,
      );
      ctx.session.warrantyStep = 'repairing_problem';
      ctx.session.warrantyData = { is_warranty: true, product_code: answer, product_id: product.id };
    }
    await ctx.reply('Iltimos muammoni yuboring !');

  }

  private async handleRepairingProblem(ctx: any) {
    const answer = ctx.message?.text?.toString().trim().toLowerCase();

    ctx.session.warrantyStep = 'repairing_solution';
    ctx.session.warrantyData['problem'] = answer;
    await ctx.reply('Iltimos yechimni yuboring !');

  }

  private async handleRepairingSolution(ctx: any) {
    const answer = ctx.message?.text?.toString().trim().toLowerCase();

    ctx.session.warrantyStep = 'repairing_cost';
    ctx.session.warrantyData['solution'] = answer;
    await ctx.reply('Iltimos hizmat narxini yuboring !');
  }

  private async handleRepairingPrice(ctx: any) {
    const answer = ctx.message?.text?.toString().trim().toLowerCase();

    ctx.session.warrantyStep = 'repairing_submit';
    ctx.session.warrantyData['price'] = answer;
    await ctx.reply(`Iltimos malumotlarni tasqidlang !
    \nMahsulot kodi: ${ctx.session.warrantyData.product_code}
    \nMahsulot kafolati: ${ctx.session.warrantyData.is_warranty ? 'bor' : ' yoq'}
    \nMahsulot muammosi: ${ctx.session.warrantyData.problem}
    \nMuammo yechimi: ${ctx.session.warrantyData.solution}
    \nHismat narxi: ${ctx.session.warrantyData.price}`);
    return await ctx.reply(`✅ Tasdiqlaysizmi? (ha/yo‘q)`);
  }

  private async handleRepairingConfirmStep(ctx: any) {
    const answer = ctx.message?.text?.toString().trim().toLowerCase();
    if (answer === 'ha') {
      await this.createServiceToProduct(
        ctx.session.warrantyData,
        ctx.session.user.id,
      );
      await ctx.reply('🟢 Tamirlash muvaffaqiyatli yaratildi!');
    } else if (answer === "yo'q" || answer === 'yo‘q' || answer === 'yoq') {
      await ctx.reply('❌ Tamirlash yaratish bekor qilindi.');
    } else {
      return await ctx.reply(`✅ Tasdiqlaysizmi? (ha/yo‘q)`);
    }

    ctx.session.warrantyStep = null;
    ctx.session.warrantyData = null;
    return this.showMenu(ctx, 'technician');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}
