# User Testing Guide - Vazio Orchestrator

## Introduction
This guide provides step-by-step instructions for manually testing the Vazio Orchestrator web application. The orchestrator is a state management system with WebSocket/REST API integration and multi-format file processing capabilities.

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Basic understanding of web applications
- Text editor (for creating test files)

### Accessing the Application
1. Open your web browser
2. Navigate to: `http://localhost:7323`
3. You should see the Vazio Orchestrator home page

### Initial Verification
- [ ] Page loads without errors
- [ ] Navigation menu is visible
- [ ] No JavaScript errors in browser console (F12 → Console)

## Testing Workflow

### 1. Home Page Testing

#### What You'll See
- Orchestrator overview and status
- Basic information about the system
- Navigation to other sections

#### What to Test
1. **Page Load**:
   - [ ] Page displays correctly
   - [ ] All text is readable
   - [ ] Layout is responsive (try resizing browser window)

2. **Navigation**:
   - [ ] Click on "State" in navigation - should navigate to state page
   - [ ] Click on "API" in navigation - should navigate to API page  
   - [ ] Click on "Files" in navigation - should navigate to files page
   - [ ] Click on "Home" to return - should return to home page

#### Expected Behavior
- Smooth navigation between pages
- No broken links or error pages
- Responsive design adapts to browser window size

### 2. State Management Testing

#### Navigate to State Page
Click "State" in the navigation menu.

#### What You'll See
- Current application state display
- Controls for viewing and managing state
- Export functionality

#### What to Test
1. **State Display**:
   - [ ] Current state is visible (may be empty initially)
   - [ ] State is formatted clearly and readable

2. **State Export**:
   - [ ] Try exporting state as JSON
   - [ ] Try exporting state as YAML (if available)
   - [ ] Verify downloaded file contains state data

3. **Real-time Updates** (Advanced):
   - [ ] Navigate to other pages and perform actions
   - [ ] Return to state page - check if state reflects changes

#### Expected Behavior
- State information displays clearly
- Export functions work without errors
- Downloaded files contain valid data

### 3. API Integration Testing

#### Navigate to API Page
Click "API" in the navigation menu.

#### What You'll See
- WebSocket connection controls
- REST API testing interface
- Connection status indicators

#### What to Test
1. **WebSocket Testing**:
   - [ ] Look for WebSocket connection controls
   - [ ] Try connecting to a WebSocket (if URL field available)
   - [ ] Check connection status updates
   - [ ] Try disconnecting if connected

2. **REST API Testing**:
   - [ ] Look for API request form/controls
   - [ ] Try making a simple GET request (if URL field available)
   - [ ] Check response display
   - [ ] Try invalid requests to test error handling

#### Expected Behavior
- Connection status updates appropriately
- API responses display clearly
- Error messages are helpful and not cryptic

#### Test URLs (if needed)
- WebSocket: `wss://echo.websocket.org/` (public echo server)
- REST API: `https://jsonplaceholder.typicode.com/posts/1` (public test API)

### 4. File Processing Testing

#### Navigate to Files Page
Click "Files" in the navigation menu.

#### What You'll See
- File upload interface
- Supported file types information
- File processing results display

#### Preparing Test Files
Create these test files on your computer:

**test.json**:
```json
{
  "name": "Test User",
  "age": 30,
  "skills": ["JavaScript", "TypeScript", "Svelte"],
  "active": true
}
```

**test.yaml**:
```yaml
name: Test User
age: 30
skills:
  - JavaScript
  - TypeScript
  - Svelte
active: true
```

**test.csv**:
```csv
name,age,skill
John,25,JavaScript
Jane,30,TypeScript
Bob,35,Svelte
```

#### What to Test
1. **File Upload Interface**:
   - [ ] File selection button works
   - [ ] Drag and drop works (if available)
   - [ ] File type restrictions are enforced

2. **JSON File Processing**:
   - [ ] Upload the test.json file
   - [ ] Check that file content is displayed
   - [ ] Verify data structure is preserved
   - [ ] Check state page - uploaded file should appear in state

3. **YAML File Processing**:
   - [ ] Upload the test.yaml file
   - [ ] Check that file content is parsed correctly
   - [ ] Verify data matches expected structure
   - [ ] Check state page for updated state

4. **CSV File Processing**:
   - [ ] Upload the test.csv file
   - [ ] Verify CSV is converted to structured data
   - [ ] Check that headers become object keys
   - [ ] Verify rows become array elements

5. **Error Handling**:
   - [ ] Try uploading an unsupported file type (e.g., .txt)
   - [ ] Try uploading a corrupted JSON file
   - [ ] Verify helpful error messages appear

#### Expected Behavior
- All supported file types process correctly
- File data integrates into application state
- Error messages are clear and actionable
- Large files process without freezing the browser

### 5. Cross-Feature Integration Testing

#### State Persistence Test
1. [ ] Upload a JSON file on Files page
2. [ ] Navigate to State page - verify file data appears
3. [ ] Navigate to API page - state should persist
4. [ ] Return to Files page - previous upload should be remembered

#### Real-time State Updates Test
1. [ ] Open State page in one browser tab
2. [ ] Open Files page in another tab
3. [ ] Upload a file in the Files tab
4. [ ] Switch to State tab - should show updated state immediately

### 6. Responsive Design Testing

#### Desktop Testing
- [ ] Test on full desktop screen (1920x1080 or similar)
- [ ] Verify all content is visible and accessible
- [ ] Check that layout uses screen space effectively

#### Tablet Testing
- [ ] Resize browser to tablet size (~768px width)
- [ ] Verify navigation adapts appropriately
- [ ] Check that all features remain accessible
- [ ] Ensure touch-friendly interface elements

#### Mobile Testing
- [ ] Resize browser to mobile size (~375px width)
- [ ] Verify mobile-optimized layout
- [ ] Check that all critical features work
- [ ] Test navigation in mobile view

### 7. Performance Testing

#### Load Time Testing
- [ ] Refresh the page and note load time (should be under 3 seconds)
- [ ] Navigate between pages - transitions should be smooth
- [ ] Check browser memory usage (F12 → Performance tab)

#### Large File Testing
Create a larger test file (e.g., CSV with 1000+ rows) and:
- [ ] Upload the large file
- [ ] Verify processing completes without freezing
- [ ] Check memory usage doesn't spike excessively
- [ ] Verify UI remains responsive

### 8. Error Recovery Testing

#### Network Error Simulation
- [ ] Disconnect internet connection
- [ ] Try making API requests
- [ ] Verify appropriate error messages
- [ ] Reconnect internet and retry operations

#### Browser Tab Testing
- [ ] Open multiple tabs with the application
- [ ] Verify each tab works independently
- [ ] Test state synchronization between tabs (if applicable)

## Issues to Watch For

### Critical Issues (Stop Testing - Report Immediately)
- Application crashes or becomes unresponsive
- Data loss or corruption
- Security vulnerabilities (XSS, injection, etc.)
- Complete feature failure

### Major Issues (Complete Testing - High Priority)
- Features work but with significant usability problems
- Performance issues that impact user experience
- Inconsistent behavior across browsers
- Error messages that don't help users understand problems

### Minor Issues (Note but Continue Testing)
- Cosmetic/styling problems
- Minor usability improvements
- Performance optimizations
- Feature enhancements

## Browser Testing Checklist

Test the complete workflow in each browser:

### Chrome Testing
- [ ] All features work correctly
- [ ] Performance is acceptable
- [ ] No console errors
- [ ] File uploads work properly

### Firefox Testing  
- [ ] All features work correctly
- [ ] WebSocket connections work
- [ ] File processing works
- [ ] State management functions

### Safari Testing
- [ ] All features work correctly
- [ ] File uploads function properly
- [ ] API requests work
- [ ] Performance is acceptable

### Edge Testing
- [ ] All features work correctly
- [ ] No compatibility issues
- [ ] Full feature functionality
- [ ] Consistent behavior

## Completion Checklist

Before completing testing, verify:

### Functionality Verification
- [ ] All major features tested and working
- [ ] File processing works for all supported formats
- [ ] State management operates correctly
- [ ] API integration functions properly
- [ ] Navigation works smoothly

### User Experience Verification
- [ ] Interface is intuitive and easy to use
- [ ] Error messages are helpful
- [ ] Performance meets user expectations
- [ ] Responsive design works on different screen sizes

### Quality Verification
- [ ] No critical or major bugs identified
- [ ] Application handles errors gracefully
- [ ] Data integrity maintained throughout testing
- [ ] Security considerations appear adequate

## Reporting Results

### For Each Feature Tested
Document:
1. **Status**: ✅ Working, ⚠️ Issues Found, ❌ Not Working
2. **Details**: What you tested and what happened
3. **Issues**: Any problems encountered
4. **Browser**: Which browser(s) you used

### Example Report Format
```
Feature: File Upload (JSON)
Status: ✅ Working
Details: Uploaded 5KB JSON file with nested objects
Browser: Chrome 120
Issues: None

Feature: WebSocket Connection
Status: ⚠️ Issues Found
Details: Connection works but takes 10+ seconds
Browser: Firefox 121
Issues: Slow connection establishment
```

## Next Steps After Testing

### If Testing Passes
- Document successful completion
- Note any minor improvements for future enhancement
- Approve progression to Enhancement Phase

### If Issues Found
- Document all issues with severity levels
- Prioritize fixes based on impact
- Retest after fixes are implemented

---

**Testing Duration**: Allow 2-3 hours for comprehensive testing  
**Retesting**: After any fixes, retest affected areas  
**Sign-off**: Required before Enhancement Phase begins

*User Testing Guide prepared by @agent-reporter*  
*Date: 2025-09-03*  
*Project: Vazio Orchestrator (@TheNexusGroup/orchestrator)*