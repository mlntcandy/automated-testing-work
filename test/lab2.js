const { Builder, Browser } = require("selenium-webdriver");
const fs = require("fs/promises");
const MospolytechTimeTablePage = require("../pages/Polytech");
const TimetablePage = require("../pages/TimetablePage");
const { expect } = require("chai");

describe("Timetable Page Test", () => {
  let driver;
  let page;
  let timetablePage;

  before(async () => {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
    page = new MospolytechTimeTablePage(driver);
    timetablePage = new TimetablePage(driver);
  });

  afterEach(async function () {
    if (this.currentTest.state === "failed") {
      const screenshot = await driver.takeScreenshot();
      const testCaseName = this.currentTest.title
        .replace(/\s+/g, "-")
        .toLowerCase();
      const dateTime = new Date().toISOString().replace(/[-:.]/g, "");
      const fileName = `fail-${testCaseName}-${dateTime}.png`;
      await fs.writeFile(fileName, screenshot, "base64");
    }
  });

  after(async () => {
    await driver.quit();
  });

  it("should search for a group timetable", async function () {
    await page.load();
    await page.clickTimetableLink();
    const header = await page.getMospolytechTimeTableHeader();
    expect(header).to.equal("Расписание занятий");
    await page.clickExternalTimetableLink();
    const foundNewTab = await page.switchToNewTab();
    expect(foundNewTab).to.be.true;
    await timetablePage.searchGroup();
    await timetablePage.openGroup();
    const weekdays = [
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
      "Воскресенье",
    ];
    const now = new Date();
    const weekdayIndex = now.getDay() - 1;
    const result = await timetablePage.checkColor();

    expect(result[0]).to.equal(weekdays[weekdayIndex], "Weekday is incorrect");
  });
});
