function Basket() {
  Container.call(this, 'basket');

  this.countGoods = 0;
  this.amount = 0;

  this.classBasketCount = 'cart-dropdown';
  this.classBasketDataAmount = 'total-amount';

  this.classBasketItemsList = 'cart-dropdown-list-items';
  this.classBasketItem = 'cart-items';
  this.classBasketItemImage = 'image';
  this.classBasketItemContent = 'item';
  this.classBasketItemName = 'name';
  this.classBasketItemQuantity = 'quantity';
  this.classBasketItemPrice = 'price';

  this.classDeleteBasketItem = 'remove-item';

  this.basketItems = [];
  this.collectBasketItems();
}

Basket.prototype = Object.create(Container.prototype);
Basket.prototype.constructor = Basket;

Basket.prototype.render = function (root) {
  
};

Basket.prototype.error = function () {
  alert("Error cart update! :(");
}

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

Basket.prototype.add = function (idProduct, quantity, price, name, image) {
  var basketItem = {
    "name": name,
    "id": parseInt(idProduct),
    "quantity": parseInt(quantity),
    "price": parseInt(price),
    "image": image
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
  var basketDataAmount = $('.' + this.classBasketDataAmount);
  var basketItemsListDiv = $('.' + this.classBasketItemsList);
  var basketCountDiv = $('.' + this.classBasketCount + ' span');
  var count = 0;
  var amount = 0;

  basketCountDiv.empty();
  basketDataAmount.empty();
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

  basketCountDiv.append(this.countGoods);
  basketDataAmount.append(this.amount);

  console.log(this.basketItems);
};

Basket.prototype.htmlItem = function (item) {
  var html = "";
  html += '<div class="' + this.classBasketItemImage + '">';
    html += '<img src="' + item.image + '" alt="' + item.name + '">';
  html += '</div>';
  html += '<div class="' + this.classBasketItemContent + '">';
    html += '<div class="' + this.classBasketItemName + '">' + item.name + '</div>';
    html += '<div class="' + this.classBasketItemPrice + '">';
      html += '<span class="' + this.classBasketItemQuantity + '">' + item.quantity + '</span> x $<span class="' + this.classBasketItemPrice + '">' + item.price + '</span>';
    html += '</div>';
  html += '</div>';
  html += '<div  class="' + this.classDeleteBasketItem + '">';
    html += '<a href="#" data-id-product="' + item.id + '"></a>';
  html += '</div>';

  return html;
};

Basket.prototype.collectBasketItems = function () {
  $.ajax({
    url: 'ajax/getbasket.json',
    data: {
      user_id: 1
    },
    dataType: 'json',
    success: function (data) {
      if (data.result){
        for (var index in data.items) {
          this.basketItems.push(data.items[index]);
        }
        this.refresh();
      } else {
        this.error();
      }
    },
    context: this
  });
};