const { By } = require("selenium-webdriver");

class TodoPage {
  constructor(driver) {
    this.driver = driver;
  }

  todoHeader() {
    return By.xpath("//h2");
  }

  remainingCount() {
    return By.xpath("//span[contains(text(),' remaining')]");
  }

  todoInput() {
    return By.id("sampletodotext");
  }

  addButton() {
    return By.id("addbutton");
  }

  todoItem(index) {
    return By.name(`li${index}`);
  }

  todoItemSpan(index) {
    return By.xpath(`//li[${index}]//span`);
  }

  checkbox(index) {
    return By.xpath(`//li[${index}]//input`);
  }

  async open() {
    await this.driver.get("https://lambdatest.github.io/sample-todo-app/");
  }

  async getHeaderText() {
    const header = await this.driver.findElement(this.todoHeader()).getText();
    return header;
  }

  async getRemainingCountText() {
    const text = await this.driver.findElement(this.remainingCount()).getText();
    return text;
  }

  async addTodoItem(text) {
    await this.driver.findElement(this.todoInput()).sendKeys(text);
    await this.driver.findElement(this.addButton()).click();
  }

  async markTodoItemDone(index) {
    await this.driver.findElement(this.todoItem(index)).click();
  }

  async getTodoItemClass(index) {
    return await this.driver
      .findElement(this.todoItemSpan(index))
      .getAttribute("class");
  }

  async getCheckboxChecked(index) {
    return await this.driver.findElement(this.checkbox(index)).isSelected();
  }
}

module.exports = TodoPage;
