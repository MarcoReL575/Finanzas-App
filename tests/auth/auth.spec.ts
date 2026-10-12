import { test, expect } from '@playwright/test';

test.describe('Auth Test', () => {
  test.describe('Signup Success', ()=> {
    test('un usuario nuevo puede registrarse y es redirigido a /home', async ({ page }) => {
      const uniqueEmail = `usuario.${Date.now()}@test.com`;
      const password = 'Pa$$word123';
      const name = 'Usuario de Prueba';

      await page.goto('/auth/signup');

      await page.getByTestId('name').fill(name);
      await page.getByTestId('email').fill(uniqueEmail);
      await page.getByTestId('password').fill(password);
      await page.getByTestId('confirmPassword').fill(password);

      await page.getByRole('button', { name: 'Crear cuenta' }).click();

      await expect(page.getByText(`Usuario creado, !Bienvenido: ${name}!`)).toBeVisible();
      await expect(page).toHaveURL(/\/home$/);
    });
  });

  test.describe('Signup Validation', () => {
    test('muestra errores de validación y no envía el formulario', async ({ page }) => {
      await page.goto('/auth/signup');

      await page.getByTestId('name').fill('Usuario de Prueba');
      await page.getByTestId('email').fill('correo-invalido');
      await page.getByTestId('password').fill('123');
      await page.getByTestId('confirmPassword').fill('456');

      await page.getByRole('button', { name: 'Crear cuenta' }).click();

      await expect(page.getByText('Ingresa un email válido')).toBeVisible();
      await expect(page.getByText('El password no puede tener menos de 6 caracteres')).toBeVisible();
      await expect(page).toHaveURL(/\/auth\/signup$/);
    });

    test('muestra error cuando las contraseñas no coinciden', async ({ page }) => {
      await page.goto('/auth/signup');

      await page.getByTestId('name').fill('Usuario de Prueba');
      await page.getByTestId('email').fill(`usuario.${Date.now()}@test.com`);
      await page.getByTestId('password').fill('Pa$$word123');
      await page.getByTestId('confirmPassword').fill('Pa$$word456');

      await page.getByRole('button', { name: 'Crear cuenta' }).click();

      await expect(page.getByText('Las contraseñas no coinciden')).toBeVisible();
      await expect(page).toHaveURL(/\/auth\/signup$/);
    });
  });

  test.describe('Signup Email Duplicado', () => {
    test('no permite registrar un email que ya existe', async ({ page }) => {
      const email = `usuario.${Date.now()}@test.com`;
      const password = 'Pa$$word123';
      const name = 'Usuario de Prueba';

      await page.goto('/auth/signup');
      await page.getByTestId('name').fill(name);
      await page.getByTestId('email').fill(email);
      await page.getByTestId('password').fill(password);
      await page.getByTestId('confirmPassword').fill(password);
      await page.getByRole('button', { name: 'Crear cuenta' }).click();

      await expect(page).toHaveURL(/\/home$/);

      await page.goto('/auth/signup');
      await page.getByTestId('name').fill(name);
      await page.getByTestId('email').fill(email);
      await page.getByTestId('password').fill(password);
      await page.getByTestId('confirmPassword').fill(password);
      await page.getByRole('button', { name: 'Crear cuenta' }).click();

      await expect(page.getByText('Error al crear usuario')).toBeVisible();
      await expect(page).toHaveURL(/\/auth\/signup$/);
    });
  });

  test.describe('Login Credenciales Inválidas', () => {
    test('no permite iniciar sesión con un email que no existe', async ({ page }) => {
      await page.goto('/auth/signin');

      await page.getByTestId('email').fill(`inexistente.${Date.now()}@test.com`);
      await page.getByTestId('password').fill('Pa$$word123');
      await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

      await expect(page.getByText('El usuario no existe')).toBeVisible();
      await expect(page).toHaveURL(/\/auth\/signin$/);
    });

    test('no permite iniciar sesión con password incorrecta', async ({ page }) => {
      const email = `usuario.${Date.now()}@test.com`;
      const password = 'Pa$$word123';
      const name = 'Usuario de Prueba';

      await page.goto('/auth/signup');
      await page.getByTestId('name').fill(name);
      await page.getByTestId('email').fill(email);
      await page.getByTestId('password').fill(password);
      await page.getByTestId('confirmPassword').fill(password);
      await page.getByRole('button', { name: 'Crear cuenta' }).click();
      await expect(page).toHaveURL(/\/home$/);

      await page.goto('/auth/signin');
      await page.getByTestId('email').fill(email);
      await page.getByTestId('password').fill('OtraPassword456');
      await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

      await expect(page.getByText('Error al iniciar sesión')).toBeVisible();
      await expect(page).toHaveURL(/\/auth\/signin$/);
    });
  });

  test.describe('Navegación Cruzada', () => {
    test('desde signin se puede navegar a signup', async ({ page }) => {
      await page.goto('/auth/signin');

      await page.getByRole('link', { name: 'Crea una aquí' }).click();

      await expect(page).toHaveURL(/\/auth\/signup$/);
    });

    test('desde signup se puede navegar a signin', async ({ page }) => {
      await page.goto('/auth/signup');

      await page.getByRole('link', { name: 'Inicia sesión aquí' }).click();

      await expect(page).toHaveURL(/\/auth\/signin$/);
    });
  });

  test.describe('Logout', () => {
    test('el usuario puede cerrar sesión y pierde el acceso a rutas protegidas', async ({ page }) => {
      const email = `usuario.${Date.now()}@test.com`;
      const password = 'Pa$$word123';
      const name = 'Usuario de Prueba';

      await page.goto('/auth/signup');
      await page.getByTestId('name').fill(name);
      await page.getByTestId('email').fill(email);
      await page.getByTestId('password').fill(password);
      await page.getByTestId('confirmPassword').fill(password);
      await page.getByRole('button', { name: 'Crear cuenta' }).click();
      await expect(page).toHaveURL(/\/home$/);

      await page.getByText(email).click();
      await page.getByText('Log out').click();

      await expect(page).toHaveURL(/\/auth\/signin$/);

      await page.goto('/home');
      await expect(page).toHaveURL(/\/auth\/signin$/);
    });
  });

  test.describe('Protección de Rutas', () => {
    test('acceder a /home sin sesión redirige a signin', async ({ page }) => {
      await page.goto('/home');

      await expect(page).toHaveURL(/\/auth\/signin$/);
    });

    test('acceder a /perfil sin sesión redirige a signin', async ({ page }) => {
      await page.goto('/perfil');

      await expect(page).toHaveURL(/\/auth\/signin$/);
    });
  });
});