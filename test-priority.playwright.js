import { test, expect } from '@playwright/test';

test.describe('Priority Field Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  });

  test('should display priority select field in task form', async ({ page }) => {
    // Check if priority select field exists
    const prioritySelect = page.locator('[data-testid="priority-input"]');
    await expect(prioritySelect).toBeVisible();
  });

  test('should create a task with default P3 priority', async ({ page }) => {
    // Fill in the task form
    await page.fill('[data-testid="title-input"]', 'Test Task P3');
    await page.fill('[data-testid="description-input"]', 'This is a test task');
    
    // Submit form without changing priority (should default to P3)
    await page.click('[data-testid="submit-task"]');
    
    // Wait for task to appear in the list
    await page.waitForTimeout(1000);
    
    // Verify task was created
    const taskText = page.locator('text=Test Task P3');
    await expect(taskText).toBeVisible();
    
    // Check that P3 priority badge is displayed
    const priorityBadge = page.locator('text=P3 - Low');
    await expect(priorityBadge).toBeVisible();
  });

  test('should create a task with P1 priority', async ({ page }) => {
    // Fill in the task form
    await page.fill('[data-testid="title-input"]', 'Urgent Task P1');
    await page.fill('[data-testid="description-input"]', 'High priority task');
    
    // Select P1 priority
    await page.selectOption('[data-testid="priority-input"]', 'P1');
    
    // Submit form
    await page.click('[data-testid="submit-task"]');
    
    // Wait for task to appear
    await page.waitForTimeout(1000);
    
    // Verify task was created with P1 priority
    const taskText = page.locator('text=Urgent Task P1');
    await expect(taskText).toBeVisible();
    
    const priorityBadge = page.locator('text=P1 - High');
    await expect(priorityBadge).toBeVisible();
  });

  test('should create a task with P2 priority', async ({ page }) => {
    // Fill in the task form
    await page.fill('[data-testid="title-input"]', 'Medium Task P2');
    await page.fill('[data-testid="description-input"]', 'Medium priority task');
    
    // Select P2 priority
    await page.selectOption('[data-testid="priority-input"]', 'P2');
    
    // Submit form
    await page.click('[data-testid="submit-task"]');
    
    // Wait for task to appear
    await page.waitForTimeout(1000);
    
    // Verify task was created with P2 priority
    const taskText = page.locator('text=Medium Task P2');
    await expect(taskText).toBeVisible();
    
    const priorityBadge = page.locator('text=P2 - Medium');
    await expect(priorityBadge).toBeVisible();
  });

  test('should update task priority when editing', async ({ page }) => {
    // Create initial task with P3
    await page.fill('[data-testid="title-input"]', 'Editable Task');
    await page.fill('[data-testid="description-input"]', 'Initial P3 task');
    await page.click('[data-testid="submit-task"]');
    
    // Wait for task to appear
    await page.waitForTimeout(1000);
    
    // Click edit button (first edit icon)
    const editButtons = page.locator('[aria-label="edit"]');
    await editButtons.first().click();
    
    // Wait for form to be populated
    await page.waitForTimeout(500);
    
    // Change priority to P1
    await page.selectOption('[data-testid="priority-input"]', 'P1');
    
    // Save changes
    await page.click('[data-testid="submit-task"]');
    
    // Wait for update
    await page.waitForTimeout(1000);
    
    // Verify the task now shows P1 priority
    const priorityBadge = page.locator('text=P1 - High');
    await expect(priorityBadge).toBeVisible();
  });

  test('should display all three priority levels with correct colors', async ({ page }) => {
    // Create tasks with all three priority levels
    const priorities = [
      { level: 'P1', label: 'P1 - High', title: 'High Priority' },
      { level: 'P2', label: 'P2 - Medium', title: 'Medium Priority' },
      { level: 'P3', label: 'P3 - Low', title: 'Low Priority' },
    ];

    for (const priority of priorities) {
      await page.fill('[data-testid="title-input"]', priority.title);
      await page.fill('[data-testid="description-input"]', `Testing ${priority.label}`);
      await page.selectOption('[data-testid="priority-input"]', priority.level);
      await page.click('[data-testid="submit-task"]');
      await page.waitForTimeout(500);
    }

    // Wait for all tasks to appear
    await page.waitForTimeout(1000);

    // Verify all priority badges are visible
    for (const priority of priorities) {
      const badge = page.locator(`text=${priority.label}`);
      await expect(badge).toBeVisible();
    }
  });

  test('should persist priority after page refresh', async ({ page }) => {
    // Create a task with P1 priority
    await page.fill('[data-testid="title-input"]', 'Persistent Priority Task');
    await page.fill('[data-testid="description-input"]', 'Should persist P1');
    await page.selectOption('[data-testid="priority-input"]', 'P1');
    await page.click('[data-testid="submit-task"]');
    
    // Wait for task to appear
    await page.waitForTimeout(1000);
    
    // Refresh the page
    await page.reload({ waitUntil: 'networkidle' });
    
    // Wait for tasks to load
    await page.waitForTimeout(2000);
    
    // Verify the task still has P1 priority
    const taskText = page.locator('text=Persistent Priority Task');
    await expect(taskText).toBeVisible();
    
    const priorityBadge = page.locator('text=P1 - High');
    await expect(priorityBadge).toBeVisible();
  });
});
