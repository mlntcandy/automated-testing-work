const { By } = require("selenium-webdriver");

class MospolytechTimeTablePage {
  constructor(driver) {
    this.driver = driver;
  }
  async load() {
    await this.driver.get("https://mospolytech.ru/");
  }

  async clickTimetableLink() {
    await this.clickLink("//a[@href='/obuchauschimsya/raspisaniya/']");
  }

  async clickExternalTimetableLink() {
    await this.clickLink("//a[@href='https://rasp.dmami.ru/']");
  }

  async switchToNewTab() {
    const initialWindowHandle = await this.driver.getWindowHandle();
    const newWindowHandle = await this.driver.wait(async () => {
      const handlesAfterAction = await this.driver.getAllWindowHandles();
      return handlesAfterAction.find(
        (handle) => handle !== initialWindowHandle
      );
    }, 3000);
    if (newWindowHandle) {
      await this.driver.switchTo().window(newWindowHandle);
    }
    return !!newWindowHandle;
  }

  async getMospolytechTimeTableHeader() {
    return await this.driver.findElement(By.xpath("//h1")).getText();
  }

  async clickLink(xpath) {
    await this.driver.findElement(By.xpath(xpath)).click();
  }
}

module.exports = MospolytechTimeTablePage;
