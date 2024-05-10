const assert = require("assert");
const webdriver = require("selenium-webdriver");

const driver = new webdriver.Builder().forBrowser("chrome").build();
async function lab1() {
  // 1 - Navigate to:
  driver.get("https://lambdatest.github.io/sample-todo-app/");

  // check if the title (h2) is "LambdaTest Sample App"
  const title = await driver.findElement(webdriver.By.xpath("//h2")).getText();
  assert.equal(
    title,
    "LambdaTest Sample App",
    'Title is not "LambdaTest Sample App"'
  );
  // 2 - check if following text is present: "5 of 5 remaining"
  let remaining = 5;
  let total = 5;
  const texts = await driver.findElements(
    webdriver.By.xpath(`//span[text()='${remaining} of ${total} remaining']`)
  );

  assert.ok(
    texts.length > 0,
    `Text "${remaining} of ${total} remaining" is not present`
  );

  // 3 - check if the first checkbox is not crossed out, 4 - check it, 5 - do this for all checkboxes
  for (; remaining > 0; remaining--) {
    const i = total - remaining + 1;
    // text is crossed out if it has a class "done-true" and not crossed out if it has "done-false"
    const label = await driver.findElement(
      webdriver.By.xpath(`//li[${i}]//span`)
    );
    assert.equal(
      await label.getAttribute("class"),
      "done-false",
      `Label ${i} is crossed out`
    );
    const checkbox = await driver.findElement(
      webdriver.By.xpath(`//li[${i}]//input`)
    );
    const checked = await checkbox.isSelected();
    assert.ok(
      !checked,
      `Checkbox ${i} is checked, but text is not crossed out`
    );
    await checkbox.click();
  }
  // 6 - add a new item to the list
  const input = await driver.findElement(webdriver.By.id("sampletodotext"));
  const submit = await driver.findElement(webdriver.By.id("addbutton"));
  await input.sendKeys("Андрюшин Александр 221-323");
  await submit.click();
  total++;
  remaining++;
  // check if new item is added, and text is not crossed out
  const label = await driver.findElement(
    webdriver.By.xpath(`//li[${total}]//span`)
  );
  assert.equal(
    await label.getAttribute("class"),
    "done-false",
    `Label ${total} is crossed out`
  );
  // recheck the text
  const texts2 = await driver.findElements(
    webdriver.By.xpath(`//span[text()='${remaining} of ${total} remaining']`)
  );
  assert.ok(
    texts2.length > 0,
    `Text "${remaining} of ${total} remaining" is not present`
  );
  // 7 - click the new checkbox
  const checkbox = await driver.findElement(
    webdriver.By.xpath(`//li[${total}]//input`)
  );
  await checkbox.click();
}

lab1()
  .then(() => console.log("Lab 1 is complete!"))
  .catch((e) => console.error("Lab 1 failed with error: ", e))
  .finally(() => driver.quit());
