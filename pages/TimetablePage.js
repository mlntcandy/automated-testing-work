const { By } = require("selenium-webdriver");

class TimetablePage {
  constructor(driver) {
    this.driver = driver;
    this.groupNumber = "221-323";
    this.searchField = By.className("groups");
    this.groupElement = By.id(this.groupNumber);
  }
  async searchGroup() {
    const searchField = await this.driver.findElement(this.searchField);
    await searchField.sendKeys(this.groupNumber);
    const resultElements = await this.driver.findElements(
      By.className("group")
    );
    const groupTexts = await Promise.all(
      resultElements.map(async (element) => {
        return await element.getText();
      })
    );
    if (groupTexts.length === 1 && groupTexts[0] === this.groupNumber) {
      await this.driver.findElement(this.groupElement).click();
    }
    await this.driver.sleep(1000);
  }
  async openGroup() {
    await this.driver.findElement(this.groupElement).click();
    await this.driver.sleep(1000);
  }

  async checkColor() {
    await this.driver.findElement(By.className("goToToday")).click();
    const parentElements = [
      await this.driver.findElement(By.className("schedule-day_today")),
    ];
    const data = await Promise.all(
      parentElements.map(async (element) => {
        const title = await element
          .findElement(By.className("schedule-day__title"))
          .getText();
        return title;
      })
    );
    return data;
  }
}

module.exports = TimetablePage;
