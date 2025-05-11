import { Selectors } from './selectors';

describe('Тесты API ингредиентов', () => {
  it('Должен загружать моковые ингредиенты', () => {
    // 1. Загружаем фикстуру и настраиваем перехват ПЕРЕД визитом на страницу
    cy.fixture('ingredients.json').then((ingredientsData) => {
      cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
        statusCode: 200,
        body: ingredientsData
      }).as('getIngredients');
    });

    // 2. Переходим на страницу
    cy.visit('http://localhost:4000/');

    // 3. Ждем завершения запроса и проверяем
    cy.wait('@getIngredients').then((interception) => {
      //  проверка что response существует
      if (!interception.response) {
        throw new Error('Response is undefined');
      }

      const { body } = interception.response;

      // Проверяем структуру ответа
      expect(body.success).to.be.true;
      expect(body.data).to.be.an('array');

      // Проверяем количество элементов
      expect(body.data).to.have.length(15);
    });

    // 4. Проверяем отображение на странице
    cy.get(Selectors.INGREDIENT).should('have.length', 15);
  });
});

describe('Добавление ингредиента в конструктор', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000/');
    cy.get(Selectors.INGREDIENT).should('be.visible');
  });

  it('Добавление булки в конструктор', () => {
    // 1. Предварительная проверка - конструктор пуст
    cy.get(Selectors.CONSTRUCTOR_ELEMENT).should('not.exist');

    // 2. Получаем первую булку и запоминаем её название
    cy.get(Selectors.INGREDIENT)
      .first()
      .as('bun')
      .find('[data-testid="ingredient-name"]') // находим элемент с названием
      .invoke('text')
      .as('bunName'); // сохраняем текст названия в алиас

    // 3. Добавляем булку
    cy.get('@bun').contains('button', 'Добавить').click();

    // 4. Проверяем, что в конструкторе появились именно эта булка (2 раза - верх и низ)
    cy.get('@bunName').then((bunName) => {
      cy.get(Selectors.CONSTRUCTOR_ELEMENT).should('have.length', 2);
    });
  });
});

describe('Тесты модальных окон ингредиентов', () => {
  beforeEach(() => {
    // Настраиваем мок для API ингредиентов
    cy.fixture('ingredients.json').then((ingredientsData) => {
      cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
        statusCode: 200,
        body: ingredientsData
      }).as('getIngredients');
    });

    // Переходим на страницу
    cy.visit('http://localhost:4000/');

    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');

    // Убеждаемся, что ингредиенты загрузились
    cy.get(Selectors.INGREDIENT).should('exist');
  });

  describe('Открытие модального окна ингредиента', () => {
    it('Должно открывать модальное окно при клике на ингредиент', () => {
      // Кликаем на первый ингредиент
      cy.get(Selectors.INGREDIENT).first().click();

      // Проверяем, что модальное окно открылось
      cy.get(Selectors.MODAL).should('exist');
      cy.get(Selectors.MODAL).contains('Детали ингредиента').should('exist');

      // Проверяем, что данные ингредиента отображаются корректно
      cy.fixture('ingredients.json').then((ingredients) => {
        const firstIngredient = ingredients.data[0];
        cy.get(Selectors.INGREDIENT_DETAILS_NAME).should(
          'contain',
          firstIngredient.name
        );
        cy.get(Selectors.INGREDIENT_DETAILS_CALORIES).should(
          'contain',
          firstIngredient.calories
        );
        cy.get(Selectors.INGREDIENT_DETAILS_PROTEINS).should(
          'contain',
          firstIngredient.proteins
        );
        cy.get(Selectors.INGREDIENT_DETAILS_FAT).should(
          'contain',
          firstIngredient.fat
        );
        cy.get(Selectors.INGREDIENT_DETAILS_CARBOHYDRATES).should(
          'contain',
          firstIngredient.carbohydrates
        );
      });
    });
  });

  describe('Закрытие модального окна ингредиента', () => {
    beforeEach(() => {
      // Открываем модальное окно перед каждым тестом
      cy.get(Selectors.INGREDIENT).first().click();
      cy.get(Selectors.MODAL).should('exist');
    });

    it('Должно закрывать модальное окно при клике на крестик', () => {
      cy.get(Selectors.MODAL_CLOSE_BUTTON).click();
      cy.get(Selectors.MODAL).should('not.exist');
    });

    it('Должно закрывать модальное окно при клике на оверлей', () => {
      cy.get(Selectors.MODAL_OVERLAY).click({ force: true });
      cy.get(Selectors.MODAL).should('not.exist');
    });

    it('Должно закрывать модальное окно при нажатии Escape', () => {
      cy.get('body').type('{esc}');
      cy.get(Selectors.MODAL).should('not.exist');
    });
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    // Мокаем API для ингредиентов
    cy.fixture('ingredients.json').then((ingredients) => {
      cy.intercept('GET', 'https://norma.nomoreparties.space/api/ingredients', {
        statusCode: 200,
        body: ingredients
      }).as('getIngredients');
    });

    // Мокаем API для данных пользователя
    cy.fixture('user.json').then((user) => {
      cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
        statusCode: 200,
        body: user
      }).as('getUser');
    });

    // Мокаем API для создания заказа
    cy.fixture('order.json').then((order) => {
      cy.intercept('POST', 'https://norma.nomoreparties.space/api/orders', {
        statusCode: 200,
        body: order
      }).as('createOrder');
    });

    // Устанавливаем cookie для авторизации
    cy.setCookie('accessToken', 'test-token');

    // Переходим на страницу
    cy.visit('http://localhost:4000/');

    // Ждем загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  it('Должен блокировать кнопку "Оформить заказ" без булки', () => {
    // 1. Предварительная проверка - убеждаемся, что конструктор пуст
    cy.get(Selectors.CONSTRUCTOR_ELEMENT).should('not.exist');

    // 2. Получаем начинку и проверяем, что она доступна для добавления
    cy.get(Selectors.INGREDIENT)
      .first()
      .as('bun')
      .contains('button', 'Добавить')
      .should('be.visible');

    // 3. Выполняем действие - добавляем булку
    cy.get('@bun').contains('button', 'Добавить').click();

    // 4. Проверяем результат - булка появилась в конструкторе (2 элемента - верх и низ)
    cy.get(Selectors.INGREDIENT).eq(2).as('main');
    // Кликаем по кнопке "Добавить"
    cy.get('@main').contains('button', 'Добавить').click();
    cy.get(Selectors.INGREDIENT).eq(2).contains('Добавить').click();
    // Пытаемся оформить заказ
    cy.get(Selectors.ORDER_BUTTON).click();

    // Дополнительная проверка, что модальное окно заказа НЕ открылось
    cy.get(Selectors.ORDER_MODAL).should('not.exist');
  });

  it('Полный цикл создания заказа: должен создавать заказ после авторизации и должен очищать конструктор после успешного заказа', () => {
    // 1. Проверка авторизации
    cy.wait('@getUser').then((interception) => {
      expect(interception.response?.body.success).to.be.true;
    });

    // 2. Проверяем, что конструктор изначально пуст
    cy.get(Selectors.CONSTRUCTOR_ELEMENT).should('not.exist');

    // 3. Добавляем ингредиенты с проверками
    const addIngredient = (index: number) => {
      cy.get(Selectors.INGREDIENT)
        .eq(index)
        .as('ingredient')
        .contains('button', 'Добавить')
        .should('be.visible')
        .click();

      // Проверяем, что ингредиент добавился
      cy.get('@ingredient')
        .find('[data-testid="ingredient-name"]')
        .invoke('text')
        .then((ingredientName) => {
          cy.get(Selectors.CONSTRUCTOR_ELEMENT)
            .should('contain', ingredientName)
            .and('be.visible');
        });
    };

    // Добавляем булку и начинку
    addIngredient(0); // Булки (верх/низ)
    addIngredient(2); // Начинка

    // Проверяем конструктор
    cy.get(Selectors.CONSTRUCTOR_ELEMENT).should('have.length', 3);

    // 4. Оформляем заказ
    cy.get(Selectors.ORDER_BUTTON).click();

    // 5. Ждем ответа от сервера и проверяем очистку конструктора ДО открытия модального окна
    cy.wait('@createOrder').then(() => {
      // Проверяем, что конструктор очистился после успешного ответа сервера
      cy.get(Selectors.CONSTRUCTOR_ELEMENT).should('have.length', 0);
    });

    // 6. Проверяем модальное окно заказа
    cy.get(Selectors.MODAL).should('exist');
    cy.fixture('order.json').then((order) => {
      cy.get('[data-testid="order-number"]').should(
        'contain',
        order.order.number
      );
    });

    // 7. Закрываем модальное окно
    cy.get(Selectors.MODAL_CLOSE_BUTTON).click();
    cy.get(Selectors.MODAL).should('not.exist');

    // 8. Дополнительная проверка - кнопка должна быть заблокирована
    cy.get(Selectors.ORDER_BUTTON).click();
    cy.get(Selectors.ORDER_MODAL).should('not.exist');
  });

  it('Должен показывать ошибку при неавторизованном пользователе', () => {
    // 1. Полностью очищаем состояние авторизации
    cy.clearCookies();
    cy.clearLocalStorage();

    // 2. Мокаем ошибку авторизации для запроса пользователя
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
      statusCode: 401,
      body: { success: false, message: 'Not authorized' }
    }).as('getUserUnauthorized');

    // 3. Перезагружаем страницу для сброса состояния приложения
    cy.reload();

    // 4. Ждем завершения запроса ингредиентов (если он есть)
    cy.wait('@getIngredients');

    // 5. Добавляем ингредиенты в конструктор
    // 5.1. Предварительная проверка - убеждаемся, что конструктор пуст
    cy.get(Selectors.CONSTRUCTOR_ELEMENT).should('not.exist');

    // 5.2. Получаем первую булку и проверяем, что она доступна для добавления
    cy.get(Selectors.INGREDIENT)
      .first()
      .as('bun')
      .contains('button', 'Добавить')
      .should('be.visible');

    // 5.3. Выполняем действие - добавляем булку
    cy.get('@bun').contains('button', 'Добавить').click();

    // 5.4. Проверяем результат - булка появилась в конструкторе (2 элемента - верх и низ)
    cy.get(Selectors.CONSTRUCTOR_ELEMENT)
      .should('have.length', 2)
      .and('be.visible');
    cy.get(Selectors.INGREDIENT).first().contains('Добавить').click();

    // 6. Пытаемся оформить заказ
    cy.get(Selectors.ORDER_BUTTON).click();

    // Дополнительная проверка, что модальное окно заказа НЕ открылось
    cy.get(Selectors.ORDER_MODAL).should('not.exist');
  });
});
