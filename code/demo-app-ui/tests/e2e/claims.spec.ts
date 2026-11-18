
import { test, expect, type Page } from '@playwright/test';

async function loginAsClaimant(page: Page) {
  await page.goto('/login');

  await page.getByLabel('Email').fill('claimant@demo.com');
  await page.locator('input[type="password"]').fill('Claimant123!');
  await page.getByRole('button', { name: 'Log In' }).click();

  await expect(page).toHaveURL(/\/claims\/?$/, {
    timeout: 15000,
  });
}

async function fillIncidentDetails(page: Page) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const incidentDate = [
    yesterday.getFullYear(),
    String(yesterday.getMonth() + 1).padStart(2, '0'),
    String(yesterday.getDate()).padStart(2, '0'),
  ].join('-');

  await page.locator('#incidentDate').fill(incidentDate);
  await page.locator('#incidentLocation').fill('123 Main Street, Springfield');
  await page.locator('#claimAmount').fill('1500.50');
}

test.describe('Insurance Claims - Claim Submission Wizard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsClaimant(page);
    await page.goto('/claims/new');

    await expect(page.getByTestId('wizard-step-1')).toBeVisible();
  });

  test('TC_CLAIM_001 - Empty incident details prevent navigation', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Incident Details' })
    ).toBeVisible();

    await expect(page.locator('#incidentDate')).toBeVisible();
    await expect(page.locator('#incidentLocation')).toBeVisible();
    await expect(page.locator('#claimAmount')).toBeVisible();

    await expect(
     page.getByTestId('wizard-step-1').getByRole('button', { name: 'Next', exact: true })
    ).toBeDisabled();
  });

  test('TC_CLAIM_002 - Valid incident details navigate to Step 2', async ({ page }) => {
    await fillIncidentDetails(page);

    await expect(
      page.getByTestId('wizard-step-1').getByRole('button', { name: 'Next', exact: true })
    ).toBeEnabled();

    await page.getByTestId('wizard-step-1').getByRole('button', { name: 'Next', exact: true }).click();

    await expect(page.getByTestId('wizard-step-2')).toBeVisible();

    await expect(
      page.getByRole('heading', { name: 'Supporting Details' })
    ).toBeVisible();
  });

  test('TC_CLAIM_003 - Cancel with entered data displays confirmation', async ({ page }) => {
    await fillIncidentDetails(page);

    await page.getByTestId('wizard-step-1').getByRole('button', { name: 'Next', exact: true }).click();

    await expect(page.getByTestId('wizard-step-2')).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(
      page.getByRole('dialog', { name: 'Cancel Claim Submission?' })
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Keep Editing' })
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Discard & Leave' })
    ).toBeVisible();
  });
  test('TC_CLAIM_004 - Description validation prevents invalid input', async ({ page }) => {
    await fillIncidentDetails(page);

    await page.getByTestId('wizard-step-1')
      .getByRole('button', { name: 'Next', exact: true })
      .click();

    await expect(page.getByTestId('wizard-step-2')).toBeVisible();

    const description = page.locator('#description');
    const nextButton = page.getByTestId('wizard-step-2')
      .getByRole('button', { name: 'Next', exact: true });

    await expect(nextButton).toBeDisabled();

    await description.fill('Short');

    await expect(nextButton).toBeDisabled();
    await expect(page.locator('#description-counter')).toHaveText('5/1000');

    await description.fill('The vehicle was damaged in a parking lot.');

    await expect(nextButton).toBeEnabled();
  });

  test('TC_CLAIM_005 - Back navigation preserves incident details', async ({ page }) => {
    await fillIncidentDetails(page);

    await page.getByTestId('wizard-step-1')
      .getByRole('button', { name: 'Next', exact: true })
      .click();

    await expect(page.getByTestId('wizard-step-2')).toBeVisible();

    await page.getByRole('button', { name: 'Back', exact: true }).click();

    await expect(page.getByTestId('wizard-step-1')).toBeVisible();

    await expect(page.locator('#incidentLocation'))
      .toHaveValue('123 Main Street, Springfield');

    await expect(page.locator('#claimAmount')).toHaveValue('1500.5');
  });
  test('TC_CLAIM_006 - Review screen displays entered claim details', async ({ page }) => {
    await fillIncidentDetails(page);

    await page.getByTestId('wizard-step-1')
      .getByRole('button', { name: 'Next', exact: true })
      .click();

    await expect(page.getByTestId('wizard-step-2')).toBeVisible();

    const description = 'The vehicle was damaged in a parking lot.';
    await page.locator('#description').fill(description);

    await page.getByTestId('wizard-step-2')
      .getByRole('button', { name: 'Next', exact: true })
      .click();

    const review = page.getByTestId('wizard-step-3');
    await expect(review).toBeVisible();

    await expect(review.getByText('123 Main Street, Springfield')).toBeVisible();
    await expect(review.getByText('$1,500.50')).toBeVisible();
    await expect(review.getByText(description)).toBeVisible();

    await expect(
      review.getByRole('button', { name: 'Submit Claim' })
    ).toBeEnabled();
  });

  test('TC_CLAIM_007 - Claimant successfully submits a claim', async ({ page }) => {
    await fillIncidentDetails(page);

    await page.getByTestId('wizard-step-1')
      .getByRole('button', { name: 'Next', exact: true })
      .click();

    await expect(page.getByTestId('wizard-step-2')).toBeVisible();

    await page.locator('#description')
      .fill('The vehicle was damaged in a parking lot.');

    await page.getByTestId('wizard-step-2')
      .getByRole('button', { name: 'Next', exact: true })
      .click();

    await expect(page.getByTestId('wizard-step-3')).toBeVisible();

    await page.getByTestId('wizard-step-3').getByRole('button', { name: 'Submit Claim', exact: true }).click();

    await expect(page).toHaveURL(/\/claims\/?$/, {
      timeout: 15000,
    });

    await expect(
      page.getByText(/Claim submitted successfully! Claim ID:/)
    ).toBeVisible();
  });
});




