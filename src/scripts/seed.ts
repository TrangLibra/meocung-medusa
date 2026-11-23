import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  const countries = ["vn"];

  logger.info("Seeding store data for Mèo Cưng Ecommerce...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });

  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Vietnam",
          currency_code: "vnd",
          countries: ["vn"],
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];

  logger.info("Seeding stock location...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Kho Mèo Cưng HCM",
          address: {
            city: "Ho Chi Minh",
            country_code: "VN",
            address_1: "Quan 1",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
      },
    },
  });

  logger.info("Seeding categories for Mèo Cưng...");
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        { name: "Thức ăn hạt", handle: "thuc-an-hat" },
        { name: "Pate cho mèo", handle: "pate-cho-meo" },
        { name: "Cát vệ sinh", handle: "cat-ve-sinh" },
      ],
    },
  });

  logger.info("Seeding shipping profile...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles();
  let shippingProfile = shippingProfiles.find((sp) => sp.type === "default");
  if (!shippingProfile) {
    const { result: createdSp } = await createShippingProfilesWorkflow(
      container
    ).run({
      input: {
        data: [{ name: "Default Shipping", type: "default" }],
      },
    });
    shippingProfile = createdSp[0];
  }

  logger.info("Seeding Products for Mèo Cưng...");
  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Thức Ăn Hạt Royal Canin Cho Mèo Trưởng Thành (Fit 32)",
          handle: "royal-canin-fit-32",
          description: "Thức ăn hạt cân bằng dinh dưỡng tối ưu cho mèo trưởng thành, hỗ trợ kiểm soát búi lông và tiêu hóa.",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=80" }
          ],
          options: [{ title: "Trọng lượng", values: ["2kg", "4kg"] }],
          variants: [
            {
              title: "2kg",
              sku: "RC-FIT32-2KG",
              options: { "Trọng lượng": "2kg" },
              prices: [{ amount: 185000, currency_code: "vnd" }],
            },
            {
              title: "4kg",
              sku: "RC-FIT32-4KG",
              options: { "Trọng lượng": "4kg" },
              prices: [{ amount: 350000, currency_code: "vnd" }],
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Pate Mèo Ciao Churu Dạng Tuýp Súp Thưởng (Gói 4 thanh)",
          handle: "ciao-churu-soup",
          description: "Súp thưởng thơm ngon kích thích vị giác và bù nước cho mèo, bổ sung tinh chất trà xanh.",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80" }
          ],
          options: [{ title: "Hương vị", values: ["Cá ngừ & Ức gà", "Cá hồi"] }],
          variants: [
            {
              title: "Cá ngừ & Ức gà",
              sku: "CIAO-TUNA-4P",
              options: { "Hương vị": "Cá ngừ & Ức gà" },
              prices: [{ amount: 35000, currency_code: "vnd" }],
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Cát Đậu Nành Tofu Cature Khử Mùi Kháng Khuẩn 6L",
          handle: "cat-dau-nanh-cature-6l",
          description: "Cát vệ sinh hữu cơ 100% từ bã đậu nành thiên nhiên, vón cục cực nhanh và xả được bồn cầu.",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          images: [
            { url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80" }
          ],
          options: [{ title: "Mùi hương", values: ["Trà xanh", "Sữa"] }],
          variants: [
            {
              title: "Trà xanh",
              sku: "CAT-TOFU-GREENTEA",
              options: { "Mùi hương": "Trà xanh" },
              prices: [{ amount: 95000, currency_code: "vnd" }],
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        }
      ]
    }
  });

  logger.info("Seed data completed successfully for Mèo Cưng Ecommerce!");
}
