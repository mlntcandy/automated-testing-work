const { Builder, Browser } = require("selenium-webdriver");
const MarketPage = require("../pages/MarketPage");
const { assert, expect } = require("chai");

describe("Yandex Market Add to Cart Functionality", function () {
  let driver;
  let marketPage;

  before(async function () {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
    marketPage = new MarketPage(driver);
    await driver.manage().setTimeouts({ implicit: 5000 });
    try {
      await marketPage.open();
    } catch (error) {
      console.error("Error in before hook:", error);
      throw error;
    }
  });

  after(async function () {
    await marketPage.closeBrowser();
  });

  it("should successfully add a product to the cart", async function () {
    console.log("Вход в каталог ноутбуков");
    await marketPage.clickCatalog();
    await marketPage.clickBigCategory();
    await marketPage.clickMediumCategory();
    await marketPage.clickSmallCategory();
    assert.isTrue(
      await marketPage.verifyHeaderText("Ноутбуки"),
      "Header text is not correct"
    );

    console.log("Переключение на список");
    await marketPage.switchToListView();

    console.log("Логирование первых пяти товаров");
    const firstFive = await marketPage.logFirstFiveProducts();
    console.log(firstFive.secondProductName);

    console.log("Добавление товара в корзину");
    const productInCart = await marketPage.addProductToCart();
    expect(productInCart.plusBtn.length).to.equal(1);
    expect(productInCart.minusBtn.length).to.equal(1);
    expect(productInCart.record.length).to.equal(1);

    console.log("Переход в корзину");
    await marketPage.clickCart();

    console.log("Проверка количества товара");
    const amount = await marketPage.findProductAmount();
    expect(await amount.getAttribute("value")).to.equal("1");
    await marketPage.increaseProductAmount();
    expect(await amount.getAttribute("value")).to.equal("2");
    await marketPage.closeProductPopup();
  });
});
