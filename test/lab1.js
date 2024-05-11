const { Builder, Browser } = require("selenium-webdriver");
const TodoPage = require("../pages/ToDoPage");
const { expect } = require("chai");
const { describe, it, before, after } = require("mocha");

describe("Todo App Functionality", () => {
  let driver;
  let todoPage;

  before(async () => {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
    todoPage = new TodoPage(driver);
    await todoPage.open();
  });

  it("task1", async () => {
    const header = await todoPage.getHeaderText();
    expect(header).to.equal(
      "LambdaTest Sample App",
      "Header text is incorrect"
    );

    let remainingCountText = await todoPage.getRemainingCountText();
    expect(remainingCountText).to.equal(
      "5 of 5 remaining",
      "Remaining count is incorrect"
    );

    for (let i = 1; i <= 5; i++) {
      expect(await todoPage.getTodoItemClass(i)).to.contain(
        "done-false",
        "Todo item is crossed out"
      );
      expect(await todoPage.getCheckboxChecked(i)).to.equal(
        false,
        "Checkbox is checked"
      );
      await todoPage.markTodoItemDone(i);
      expect(await todoPage.getTodoItemClass(i)).to.contain(
        "done-true",
        "Todo item is not crossed out"
      );
      expect(await todoPage.getCheckboxChecked(i)).to.equal(
        true,
        "Checkbox is not checked"
      );
      remainingCountText = await todoPage.getRemainingCountText();
      expect(remainingCountText).to.equal(
        `${5 - i} of 5 remaining`,
        "Remaining count is incorrect"
      );
    }

    remainingCountText = await todoPage.getRemainingCountText();
    expect(remainingCountText).to.equal(
      "0 of 5 remaining",
      "Remaining count is incorrect"
    );

    await todoPage.addTodoItem("Андрюшин Александр 221-323");
    remainingCountText = await todoPage.getRemainingCountText();
    expect(remainingCountText).to.equal(
      "1 of 6 remaining",
      "Remaining count is incorrect"
    );

    await todoPage.markTodoItemDone(6);
    remainingCountText = await todoPage.getRemainingCountText();
    expect(remainingCountText).to.equal(
      "0 of 6 remaining",
      "Remaining count is incorrect"
    );
  });

  after(async () => {
    await driver.quit();
  });
});
