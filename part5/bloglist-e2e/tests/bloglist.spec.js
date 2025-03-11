const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      await expect(page.locator('.notification')).toContainText('Wrong username or password')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'a blog created by playwright', 'playwright', 'playwright.dev')
      await expect(page.getByText('a blog created by playwright playwright')).toBeVisible()
    })

    describe('and several blogs exist', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'a blog created by playwright', 'playwright', 'playwright.dev')
        await createBlog(page, 'another blog created by playwright', 'playwright', 'playwright.dev')
        await createBlog(page, 'yet another blog created by playwright', 'playwright', 'playwright.dev')
      })
  
      test('a blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).first().click()

        const likeButton = page.getByRole('button', { name: 'like' })
        await likeButton.click()
        await expect(likeButton.locator('..')).toContainText('likes 1')
      })

      test('a blog can be deleted', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).first().click()

        page.on('dialog', async dialog => await dialog.accept())
        await page.getByRole('button', { name: 'delete' }).click()

        await expect(page.getByText('a blog created by playwright playwright')).not.toBeVisible()
      })

      test('can\'t delete other user\'s blog', async ({ page, request }) => {
        await request.post('http://localhost:3003/api/users', {
          data: {
            name: 'Ada Lovelace',
            username: 'alovelace',
            password: 'lovelace123'
          }
        })

        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'alovelace', 'lovelace123')

        await page.getByRole('button', { name: 'view' }).first().click()
        await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
      })

      test('blogs are ordered by likes', async ({ page }) => {
        await page.getByRole('button', { name: 'view' }).nth(2).click()
        await page.getByRole('button', { name: 'like' }).click()
        await page.getByText('likes 1').waitFor()

        await page.getByRole('button', { name: 'hide' }).click()
        await page.getByRole('button', { name: 'view' }).first().click()
        await expect(page.getByRole('button', { name: 'like' }).locator('..')).toContainText('likes 1')
      })
    })
  })
})