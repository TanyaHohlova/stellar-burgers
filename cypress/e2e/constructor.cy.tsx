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
    cy.get('[data-testid="ingredient"]').should('have.length', 15);
  });
});

describe('Добавление ингредиента в конструктор', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000/');
    cy.get('[data-testid="ingredient"]').should('be.visible');
  });

  it('Добавление булки в конструктор', () => {
    // Получаем первую булку
    cy.get('[data-testid="ingredient"]').first().as('bun');

    // Кликаем по кнопке "Добавить"
    cy.get('@bun').contains('button', 'Добавить').click();

    // Проверяем, что в конструкторе появилось 2 элемента булки
    cy.get('.constructor-element').should('have.length', 2);
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
    cy.get('[data-testid="ingredient"]').should('exist');
  });

  describe('Открытие модального окна ингредиента', () => {
    it('Должно открывать модальное окно при клике на ингредиент', () => {
      // Кликаем на первый ингредиент
      cy.get('[data-testid="ingredient"]').first().click();

      // Проверяем, что модальное окно открылось
      cy.get('[data-testid="modal"]').should('exist');
      cy.get('[data-testid="modal"]')
        .contains('Детали ингредиента')
        .should('exist');

      // Проверяем, что данные ингредиента отображаются корректно
      cy.fixture('ingredients.json').then((ingredients) => {
        const firstIngredient = ingredients.data[0];
        cy.get('[data-testid="ingredient-details-name"]').should(
          'contain',
          firstIngredient.name
        );
        cy.get('[data-testid="ingredient-details-calories"]').should(
          'contain',
          firstIngredient.calories
        );
        cy.get('[data-testid="ingredient-details-proteins"]').should(
          'contain',
          firstIngredient.proteins
        );
        cy.get('[data-testid="ingredient-details-fat"]').should(
          'contain',
          firstIngredient.fat
        );
        cy.get('[data-testid="ingredient-details-carbohydrates"]').should(
          'contain',
          firstIngredient.carbohydrates
        );
      });
    });
  });

  describe('Закрытие модального окна ингредиента', () => {
    beforeEach(() => {
      // Открываем модальное окно перед каждым тестом
      cy.get('[data-testid="ingredient"]').first().click();
      cy.get('[data-testid="modal"]').should('exist');
    });

    it('Должно закрывать модальное окно при клике на крестик', () => {
      cy.get('[data-testid="modal-close-button"]').click();
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('Должно закрывать модальное окно при клике на оверлей', () => {
      cy.get('[data-testid="modal-overlay"]').click({ force: true });
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('Должно закрывать модальное окно при нажатии Escape', () => {
      cy.get('body').type('{esc}');
      cy.get('[data-testid="modal"]').should('not.exist');
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
    // Добавляем только начинку
    cy.get('[data-testid="ingredient"]').eq(2).as('main');
    // Кликаем по кнопке "Добавить"
    cy.get('@main').contains('button', 'Добавить').click();
    cy.get('[data-testid="ingredient"]').eq(2).contains('Добавить').click();
    // Пытаемся оформить заказ
    cy.get('[data-testid="order-button"]').click();

    // Дополнительная проверка, что модальное окно заказа НЕ открылось
    cy.get('[data-testid="order-modal"]').should('not.exist');
  });

  it('Полный цикл создания заказа: должен создавать заказ после авторизации и должен очищать конструктор после успешного заказа', () => {
    // 1. Проверка авторизации
    cy.wait('@getUser').then((interception) => {
      expect(interception.response?.body.success).to.be.true;
    });

    // 2. Сборка бургера
    const addIngredient = (index: number) => {
      cy.get('[data-testid="ingredient"]')
        .eq(index)
        .contains('Добавить')
        .click();
    };

    // Добавляем ингредиенты
    addIngredient(0); // Булки (верх/низ)
    addIngredient(2); // Начинка

    // Проверяем конструктор
    cy.get('.constructor-element').should('have.length', 3);

    // 3. Оформление заказа
    cy.get('[data-testid="order-button"]').click();

    // 4. Проверка модального окна
    cy.get('[data-testid="modal"]').should('exist');
    cy.fixture('order.json').then((order) => {
      cy.get('[data-testid="order-number"]').should(
        'contain',
        order.order.number
      );
    });

    // 5. Закрытие модального окна
    cy.get('[data-testid="modal-close-button"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');

    // 6. Проверка очистки конструктора
    cy.get('.constructor-element').should('have.length', 0);

    // // 7. Дополнительная проверка - кнопка должна быть заблокирована
    //Пытаемся оформить заказ
    cy.get('[data-testid="order-button"]').click();

    // Проверка, что модальное окно заказа НЕ открылось
    cy.get('[data-testid="order-modal"]').should('not.exist');
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
    cy.get('[data-testid="ingredient"]').first().contains('Добавить').click();

    // 6. Пытаемся оформить заказ
    cy.get('[data-testid="order-button"]').click();

    // Дополнительная проверка, что модальное окно заказа НЕ открылось
    cy.get('[data-testid="order-modal"]').should('not.exist');
  });
});
