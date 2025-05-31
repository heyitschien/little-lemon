# Safe House Cleaning Implementation Plan

Here's a detailed, step-by-step plan for safely implementing the house cleaning changes while ensuring 100% functionality throughout the process.

## Phase 1: Preparation and Verification

### Step 1: Create a Detailed Component Map
1. Run the application and ensure it works correctly before making any changes
2. Document all current components and their relationships
3. Create a spreadsheet or document tracking:
   - Current component location
   - Planned new location
   - Files that import each component

### Step 2: Set Up Testing Environment
1. Ensure you have a way to quickly test changes:
   ```bash
   npm run dev -- --host
   ```
2. Have multiple browser windows open to test different parts of the application
3. Prepare a checklist of key functionality to verify after each change

## Phase 2: Directory Structure Creation

### Step 3: Create New Directory Structure
```bash
# Create the new directory structure without moving any files yet
mkdir -p src/components/common
mkdir -p src/components/features/About
mkdir -p src/components/features/Chat
mkdir -p src/components/features/Menu
mkdir -p src/components/features/Reservation
mkdir -p src/components/features/Testimonials
mkdir -p src/components/layout
```

## Phase 3: Component Relocation (One at a Time)

### Step 4: Move Layout Components

#### Header Component
1. Find all references:
   ```bash
   grep -r "from '.*Header" src/
   ```
2. Copy component to new location:
   ```bash
   cp -r src/components/Header src/components/layout/
   ```
3. Update imports in all files that reference Header
4. Test application thoroughly
5. Commit changes:
   ```bash
   git add .
   git commit -m "Move Header component to layout directory"
   ```

#### Footer Component
1. Find all references:
   ```bash
   grep -r "from '.*Footer" src/
   ```
2. Copy component to new location:
   ```bash
   cp -r src/components/Footer src/components/layout/
   ```
3. Update imports in all files that reference Footer
4. Test application thoroughly
5. Commit changes:
   ```bash
   git add .
   git commit -m "Move Footer component to layout directory"
   ```

#### Hero Component
1. Find all references:
   ```bash
   grep -r "from '.*Hero" src/
   ```
2. Copy component to new location:
   ```bash
   cp -r src/components/Hero src/components/layout/
   ```
3. Update imports in all files that reference Hero
4. Test application thoroughly
5. Commit changes:
   ```bash
   git add .
   git commit -m "Move Hero component to layout directory"
   ```

### Step 5: Move Common Components

#### Button Component
1. Find all references:
   ```bash
   grep -r "from '.*Button" src/
   ```
2. Copy component to new location:
   ```bash
   cp -r src/components/Button src/components/common/
   ```
3. Update imports in all files that reference Button
4. Test application thoroughly
5. Commit changes:
   ```bash
   git add .
   git commit -m "Move Button component to common directory"
   ```

### Step 6: Rename and Move Feature Components

#### OrderDeliveryCard → MenuItemCard
1. Find all references:
   ```bash
   grep -r "OrderDeliveryCard" src/
   ```
2. Create new component file:
   ```bash
   mkdir -p src/components/features/Menu/MenuItemCard
   cp src/components/OrderDeliveryCard/OrderDeliveryCard.jsx src/components/features/Menu/MenuItemCard/MenuItemCard.jsx
   cp src/components/OrderDeliveryCard/OrderDeliveryCard.module.css src/components/features/Menu/MenuItemCard/MenuItemCard.module.css
   ```
3. Update component name inside the new file:
   - Change `OrderDeliveryCard` to `MenuItemCard` in the component definition
   - Update CSS import to reference the new file path
4. Update imports in all files that reference OrderDeliveryCard
5. Test application thoroughly
6. Commit changes:
   ```bash
   git add .
   git commit -m "Rename OrderDeliveryCard to MenuItemCard and move to features/Menu"
   ```

#### OrderForDelivery → MenuSection
1. Find all references:
   ```bash
   grep -r "OrderForDelivery" src/
   ```
2. Create new component file:
   ```bash
   mkdir -p src/components/features/Menu/MenuSection
   cp src/components/OrderForDelivery/OrderForDelivery.jsx src/components/features/Menu/MenuSection/MenuSection.jsx
   cp src/components/OrderForDelivery/OrderForDelivery.module.css src/components/features/Menu/MenuSection/MenuSection.module.css
   ```
3. Update component name inside the new file:
   - Change `OrderForDelivery` to `MenuSection` in the component definition
   - Update CSS import to reference the new file path
   - Update import for MenuItemCard (previously OrderDeliveryCard)
4. Update imports in all files that reference OrderForDelivery
5. Test application thoroughly
6. Commit changes:
   ```bash
   git add .
   git commit -m "Rename OrderForDelivery to MenuSection and move to features/Menu"
   ```

### Step 7: Move Remaining Feature Components

#### About Components
1. Find all references to About components
2. Copy components to new location:
   ```bash
   cp -r src/components/About/* src/components/features/About/
   ```
3. Update imports in all files that reference About components
4. Test application thoroughly
5. Commit changes:
   ```bash
   git add .
   git commit -m "Move About components to features/About directory"
   ```

#### Reservation Components
1. Find all references to Reservation components
2. Copy components to new location:
   ```bash
   cp -r src/components/Reservation/* src/components/features/Reservation/
   ```
3. Update imports in all files that reference Reservation components
4. Test application thoroughly
5. Commit changes:
   ```bash
   git add .
   git commit -m "Move Reservation components to features/Reservation directory"
   ```

#### Chat Components
1. Find all references to Chat components
2. Copy components to new location:
   ```bash
   cp -r src/components/ChatAssistant/* src/components/features/Chat/
   ```
3. Update imports in all files that reference Chat components
4. Test application thoroughly
5. Commit changes:
   ```bash
   git add .
   git commit -m "Move Chat components to features/Chat directory"
   ```

#### Testimonials Components
1. Find all references to Testimonials components
2. Copy components to new location:
   ```bash
   cp -r src/components/Testimonials/* src/components/features/Testimonials/
   ```
3. Update imports in all files that reference Testimonials components
4. Test application thoroughly
5. Commit changes:
   ```bash
   git add .
   git commit -m "Move Testimonials components to features/Testimonials directory"
   ```

## Phase 4: Cleanup

### Step 8: Remove Original Directories
After verifying that all components work in their new locations:

1. Create a list of directories to remove
2. Remove each directory one by one:
   ```bash
   rm -rf src/components/Header
   rm -rf src/components/Footer
   # etc.
   ```
3. Test application thoroughly after each removal
4. Commit changes:
   ```bash
   git add .
   git commit -m "Remove original component directories after successful migration"
   ```

### Step 9: Final Verification
1. Run the application and verify all functionality
2. Check browser console for any errors
3. Test all key user flows
4. Verify mobile responsiveness

## Phase 5: Documentation

### Step 10: Update Documentation
1. Update the project progress log with completed changes
2. Document the new directory structure
3. Update any component documentation to reflect new names and locations
4. Commit documentation changes:
   ```bash
   git add .
   git commit -m "Update documentation to reflect new component structure"
   ```

## Safety Measures Throughout

- **Commit after each successful change**: This allows easy rollback if needed
- **Never delete original files until new ones are verified**: Keep the original until you're 100% sure the new one works
- **Test thoroughly after each step**: Don't proceed to the next step until current changes are verified
- **Use git branches**: If a change is complex, create a separate branch
- **Keep the application running**: See changes in real-time as you make them

By following this methodical, step-by-step approach with thorough testing at each stage, we can ensure that the codebase restructuring maintains 100% functionality while achieving our house cleaning goals.