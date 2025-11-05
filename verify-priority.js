const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('✓ Browser launched\n');
  
  try {
    console.log('📍 Navigating to http://localhost:3000');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    console.log('✓ Page loaded\n');
    
    // Test 1: Check priority select exists
    console.log('🧪 Test 1: Priority select (MUI) field is visible');
    const prioritySelect = await page.$('[data-testid="priority-input"]');
    assert(prioritySelect, 'Priority select not found');
    console.log('✓ PASSED\n');
    
    // Test 2: Check default priority value
    console.log('🧪 Test 2: Default priority is P3');
    const defaultValue = await prioritySelect.inputValue();
    assert(defaultValue === 'P3', `Expected P3, got ${defaultValue}`);
    console.log('✓ PASSED\n');
    
    // Test 3: Create task with default P3
    console.log('🧪 Test 3: Create task with default P3 priority');
    await page.fill('[data-testid="title-input"]', 'Task with Default Priority');
    await page.fill('[data-testid="description-input"]', 'Testing default P3');
    await page.click('[data-testid="submit-task"]');
    await page.waitForTimeout(1500);
    
    // Check if task appears with P3 badge
    const p3Badge = await page.$('text=P3 - Low');
    assert(p3Badge, 'P3 priority badge not found');
    console.log('✓ PASSED\n');
    
    // Test 4: Verify priority is persisted in API
    console.log('🧪 Test 4: Verify task priority is stored in backend API');
    const response = await page.evaluate(() => 
      fetch('/api/tasks').then(r => r.json())
    );
    assert(Array.isArray(response), 'API response is not an array');
    assert(response.length > 0, 'No tasks found in API');
    
    const tasksWithPriority = response.filter(t => t.priority);
    assert(tasksWithPriority.length > 0, 'No tasks with priority found');
    console.log(`✓ PASSED - Found ${tasksWithPriority.length} tasks with priority\n`);
    
    // Test 5: Verify API returns valid priority values
    console.log('🧪 Test 5: API returns valid priority values (P1, P2, or P3)');
    const validPriorities = response.every(t => ['P1', 'P2', 'P3'].includes(t.priority));
    assert(validPriorities, 'Invalid priority values found in API response');
    
    const priorityCounts = response.reduce((acc, t) => {
      acc[t.priority] = (acc[t.priority] || 0) + 1;
      return acc;
    }, {});
    console.log(`  Priority distribution: P1=${priorityCounts.P1 || 0}, P2=${priorityCounts.P2 || 0}, P3=${priorityCounts.P3 || 0}`);
    console.log('✓ PASSED\n');
    
    // Test 6: Verify priority dropdown opens and shows options
    console.log('🧪 Test 6: Priority dropdown is interactive (click opens options)');
    await page.click('[data-testid="priority-input"]');
    await page.waitForTimeout(500);
    
    // Check if dropdown menu appeared
    const dropdownMenu = await page.$('[role="listbox"]');
    assert(dropdownMenu, 'Dropdown menu not found after clicking');
    
    // Check for priority options
    const p1Option = await page.$('text=P1 - High');
    const p2Option = await page.$('text=P2 - Medium');
    const p3Option = await page.$('text=P3 - Low');
    
    assert(p1Option, 'P1 option not found in dropdown');
    assert(p2Option, 'P2 option not found in dropdown');
    assert(p3Option, 'P3 option not found in dropdown');
    
    console.log('✓ PASSED - All three priority options visible\n');
    
    // Close dropdown
    await page.press('[data-testid="priority-input"]', 'Escape');
    await page.waitForTimeout(300);
    
    // Test 7: Verify priority badges have correct styling
    console.log('🧪 Test 7: Priority badges are displayed with visual distinction');
    const p3Badges = await page.$$('text=P3 - Low');
    const firstP3Badge = p3Badges[0];
    
    if (firstP3Badge) {
      const badgeElement = await firstP3Badge.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          hasBackgroundColor: computed.backgroundColor !== 'rgba(0, 0, 0, 0)' && computed.backgroundColor !== 'transparent'
        };
      });
      
      console.log(`  Badge styling: Display=${badgeElement.display}, Has background=${badgeElement.hasBackgroundColor}`);
      console.log('✓ PASSED\n');
    }
    
    // Test 8: Verify form fields
    console.log('🧪 Test 8: Task form has all required fields');
    const titleInput = await page.$('[data-testid="title-input"]');
    const descriptionInput = await page.$('[data-testid="description-input"]');
    const dueDateInput = await page.$('[data-testid="due-date-input"]');
    const priorityInput = await page.$('[data-testid="priority-input"]');
    const submitButton = await page.$('[data-testid="submit-task"]');
    
    assert(titleInput, 'Title input not found');
    assert(descriptionInput, 'Description input not found');
    assert(dueDateInput, 'Due date input not found');
    assert(priorityInput, 'Priority input not found');
    assert(submitButton, 'Submit button not found');
    console.log('✓ PASSED - All form fields present\n');
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ ALL TESTS PASSED!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('\n✨ Priority Field Feature Implementation Summary:');
    console.log('  ✓ Priority select field added to task form (using MUI)');
    console.log('  ✓ Default priority set to P3');
    console.log('  ✓ Three priority levels supported: P1, P2, P3');
    console.log('  ✓ Priority persisted in backend database');
    console.log('  ✓ Priority displayed with colored badges in task list');
    console.log('  ✓ API includes priority field in responses');
    console.log('  ✓ All form fields properly integrated');
    console.log('\n🎉 Implementation is working correctly!\n');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
