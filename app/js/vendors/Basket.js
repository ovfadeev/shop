function Basket() {
    Container.call(this, 'basket');

    this.countGoods = 0;
    this.amount = 0;

    this.classBasketItems = 'basket-items';
    this.classBasketData = 'basket-data';
    this.classBasketItemsList = 'items-list';
    this.classBasketItem = 'item';
    this.classDeleteBasketItem = 'remove-item';

    this.basketItems = [];
    this.collectBasketItems();
}

Basket.prototype = Object.create(Container.prototype);
Basket.prototype.constructor = Basket;

Basket.prototype.render = function (root) {
    var basketDiv = $('<div />', {
        id: this.id,
        text: 'Корзина:'
    });

    var basketItemsDiv = $('<div />', {
        class: this.classBasketItems
    });

    basketItemsDiv.appendTo(basketDiv);
    basketDiv.appendTo(root);
};

Basket.prototype.update = function (item) {
  var update = false;
  for (var index in this.basketItems) {
    if (this.basketItems[index].id == item.id){
      this.basketItems[index].quantity += item.quantity;
      update = true;
      break;
    }
  }
  return update;
};

Basket.prototype.add = function (idProduct, quantity, price, name) {
    var basketItem = {
      "name": name,
      "id": parseInt(idProduct),
      "quantity": parseInt(quantity),
      "price": parseInt(price)
    };
    if (this.update(basketItem) === false){
      this.basketItems.push(basketItem);
    }
    this.refresh();
};

Basket.prototype.delete = function (idProduct) {
  for (var index in this.basketItems) {
    if (this.basketItems[index].id == idProduct){
      this.basketItems.splice(index, 1);
      break;
    }
  }

  this.refresh();
};

Basket.prototype.refresh = function () {
  var basketDataDiv = $('<div />', {
          class: this.classBasketData
      });
  var basketItemsListDiv = $('<div />', {
          class: this.classBasketItemsList
      });
  var basketItemsDiv = $('.' + this.classBasketItems);
  var count = 0;
  var amount = 0;

  basketItemsDiv.empty();
  basketDataDiv.empty();
  basketItemsListDiv.empty();

  for (var index in this.basketItems) {
      var htmlItem = "";
      var itemDiv = $('<div />', {
        class: this.classBasketItem
      });

      htmlItem += this.htmlItem(this.basketItems[index]);

      itemDiv.append(htmlItem);
      basketItemsListDiv.append(itemDiv);

      count += +this.basketItems[index].quantity;
      amount += +this.basketItems[index].price * +this.basketItems[index].quantity;
  }

  this.countGoods = count;
  this.amount = amount;

  basketDataDiv.append('<p>Всего товаров: ' + this.countGoods + '</p>');
  basketDataDiv.append('<p>Сумма: ' + this.amount + '</p>');

  basketItemsDiv.append(basketItemsListDiv);
  basketItemsDiv.append(basketDataDiv);

  console.log(this.basketItems);
};

Basket.prototype.htmlItem = function (item) {
  var html = "";
  html += '<p>' + item.name + '</p>';
  html += '<p>' + item.price + ' руб.</p>';
  html += '<p>Количество: ' + item.quantity + '</p>';
  html += '<a href="#" data-id-product="' + item.id + '" class="' + this.classDeleteBasketItem + '">Удалить</a>';
  return html;
};

Basket.prototype.collectBasketItems = function () {
  $.ajax({
      url: 'ajax/getbasket.json',
      dataType: 'json',
      success: function (data) {
          for (var index in data.basket) {
              this.basketItems.push(data.basket[index]);
          }
          this.refresh();
      },
      context: this
  });
};