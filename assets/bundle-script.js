document.addEventListener("DOMContentLoaded", () => {
  var index = 0;
  var productbundleData = [];
  var bundleTotalPrice =0;
  
  /* 
  * Add bundle products
  */
  const plusBtns = document.querySelectorAll(".plus_btn");
  plusBtns.forEach( btn=> {
    btn.addEventListener('click',(e) => {
      btn.closest(".col-md-4").querySelector(".product-btn").classList.remove("no-quantity");
      btn.classList.add('qty_increased');
      
      /* Bundle product QTY update */
      let qty = e.target.closest(".product-btn").querySelector("input[type='number']").value;
      e.target.closest(".product-btn").querySelector("input[type='number']").value=parseInt(qty)+1;
      
      addBundleProduct(e, index)
      progressBar();
      index += 1;
    })
  });
  
  /*
  * Remove bundle products on click remove button
  */
  const removeBundle = document.querySelectorAll(".remove_bundle");
  removeBundle.forEach( remove => {
    remove.addEventListener("click", (e) => {
      let closestElement = remove.closest(".bundle-builder__selected-product");
      let Index = closestElement.dataset.index;
      let productId = closestElement.dataset.bundleBuilderSelectedProductId;
      let productPrice = closestElement.dataset.bundleBuilderSelectedProductPrice
      
      updateQty(productId, Index)
      updateBundlePrice(productPrice,'minus')
      progressBar()
    })
  })

  /*
  * Remove bundle products on click minus button
  */
  const minusBundle = document.querySelectorAll(".minus_btn");
  minusBundle.forEach( remove => {
    remove.addEventListener("click", (e) => {
      let closestElement = remove.closest(".product-btn");
      let productId = closestElement.dataset.product_id;
      let index = document.querySelector(`[data-bundle-builder-selected-product-id="${productId}"]`).dataset.index;
      let productPrice = document.querySelector(`.bundle-builder__selected-product[data-bundle-builder-selected-product-id="${productId}"]`).dataset.bundleBuilderSelectedProductPrice;
      updateQty(productId, index)
      updateBundlePrice(productPrice,'minus')
      progressBar()
    })
  })
  
  /*
  * Bundle product total price manage
  */
  const updateBundlePrice = (productPrice=0, operator) => {
    if( operator =="plus" ){
      bundleTotalPrice = parseInt( bundleTotalPrice ) + parseInt( productPrice );
      let totalprice = Shopify.formatMoney(bundleTotalPrice, window.MoneyFormat)
      
      document.querySelector(".bundle_total_price").setAttribute("data-totale_price",bundleTotalPrice)
      document.querySelector(".bundle_total_price").innerHTML = totalprice;
        return;
    }
    
    bundleTotalPrice = parseInt( bundleTotalPrice ) - parseInt( productPrice );
    let totalprice = Shopify.formatMoney(bundleTotalPrice, window.MoneyFormat)
    document.querySelector(".bundle_total_price").setAttribute("data-totale_price",bundleTotalPrice)
    document.querySelector(".bundle_total_price").innerHTML = totalprice;
  }
  /*
  * Progress bar
  */
  const progressBar = () =>{    
    document.querySelector(".progress_bar").style.display="none";
    document.querySelector(".bundle_total").style.display="none";
    document.querySelector(".lsg-bundle-submit-button").setAttribute("disabled", "disabled");
    
    if( productbundleData.length > 0 ){
      document.querySelector(".progress_bar").style.display="block";
      document.querySelector(".bundle_total").style.display="block";
      document.querySelector(".lsg-bundle-submit-button").removeAttribute("disabled");
    }
    /* Progressbar */
    let totalBlock = document.querySelector(".bundle-product-list").dataset.total_block;
    let partOf = ( 1/totalBlock)*100;
    console.log( partOf );
    let progressBarWidth = parseInt(productbundleData.length - 1) * partOf + partOf;
    progressBarWidth = Math.min(progressBarWidth, 100);
    
    document.querySelector(".current_progress").style.width = progressBarWidth+'%';
    //attr("style","background-color: #222f51;transition: width 0.5s ease; width:"+progressBarWidth+'%');
  }
  /*
  * updated bundle products list
  */
  const updateQty = (productId, index)=> {
    let inputFind = document.querySelector(`.product-btn[data-product_id="${productId}"]`);
    let qty = inputFind.querySelector("input[type='number']").value;
    
    if( qty <= 1 ){
      inputFind.classList.add("no-quantity");
      inputFind.querySelector(".plus_btn").classList.remove("qty_increased");
    }
    inputFind.querySelector("input[type='number']").value= parseInt(qty)-1;
    
    productbundleData.splice(index,1)
    addProductAsBundle( productbundleData );
  }
  
  const addBundleProduct = (e, index) => {
    let findElement = e.target.closest(".col-md-4");
    let productImgSrc = findElement.querySelector(".product-img img").src;
    let productTitle = findElement.querySelector(".product-title").innerText;
    let productPrice = findElement.querySelector(".product-price").dataset.product_price;
    let productId = findElement.querySelector(".product-price").dataset.product_id;

    let productdata = []
      productdata.push(index)
      productdata.push(productImgSrc);
      productdata.push(productTitle);
      productdata.push(productPrice);
      productdata.push(productId);
      productbundleData.push(productdata)
    
      updateBundlePrice( productPrice, "plus" );
      addProductAsBundle(productbundleData);
  }

  /*
   * @ parameter data
   * @ type array()
   */
    const addProductAsBundle = (data) => {
      let productData = data;
      const removeBtnClass = document.querySelectorAll(".plus_btn")
        removeBtnClass.forEach( btn => {
         btn.classList.remove("disabled")
        })

      let totalBlock = document.querySelector(".bundle-product-list").dataset.total_block;
      
      if( productData.length >=totalBlock ){
        removeBtnClass.forEach( btn => {
          btn.classList.add("disabled")
        })
      }
      
      let bundleElement = document.querySelectorAll(".bundle-builder__selected-product");
      bundleElement.forEach( element => {
        element.classList.remove("active"); 
        element.querySelector("img[data-bundle-builder-selected-product-image]").src ="";
        element.querySelector("[data-bundle-builder-selected-product-title]").innerText ="";
        element.dataset.bundleBuilderSelectedProductId ="";
        element.dataset.bundleBuilderSelectedProductPrice ="";
      })

       if( productData.length > 0 ){
         productData.forEach(function(item, inx){
           let getElement = document.querySelector(".bundle-builder-product-"+inx);
           if( getElement ){
             getElement.classList.add("active");
             getElement.querySelector("img[data-bundle-builder-selected-product-image]").src=item[1];
             getElement.querySelector("[data-bundle-builder-selected-product-title]").innerText = item[2];
             getElement.dataset.bundleBuilderSelectedProductId =item[4];
             getElement.dataset.bundleBuilderSelectedProductPrice =item[3];
           }
         })
       }
    }

  /*
  * Bundle product add to cart
  */
  const bundleAddToCard = document.querySelector(".bundleProductAdd");
  
  bundleAddToCard.addEventListener("click", (e)=> {
    e.preventDefault();
    let BundleProductItems = {
      items:[]
    }
    let bundleLists = document.querySelectorAll(".bundle-builder__selected-product");
    var ranNum = Math.floor(1000 + Math.random() * 9000);
    
    bundleLists.forEach( (bundleList) => {
      let vId = bundleList.dataset.bundleBuilderSelectedProductId;
      
      if( vId ){
        let properties = {
          "_bundle_product" : ranNum
        }
        BundleProductItems.items.push( { "id":vId, "quantity":1,"properties":properties  });
      }
    })    
    //This only for format code for appned data insite product BundleformData object
    /*const items = [
      {
        "id": "44663157948660",
        "quantity": 1
      },
      {
        "id": "44663157883124",
        "quantity": 1,
        "properties": {
          "first prop key": "First prop value",
          "second prop key": "Second prop value"
        }
      }
    ]*/
    const config = fetchConfig('javascript');
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    delete config.headers['Content-Type'];
    
    const BundleformData = new FormData(e.target.closest("form"));
    BundleformData.append(`items[0][properties][_bundle_product]`, ranNum)
    buildFormData(BundleformData, 'items', BundleProductItems.items);
    
    function buildFormData(BundleformData, key, data) {
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          let inx = index+1
          for (const prop in item) {
            console.log( prop );
            console.log( item[prop] );
            if (prop === 'properties' && typeof item[prop] === 'object') {
              for (const subKey in item[prop]) {
                const subValue = item[prop][subKey];
                BundleformData.append(`${key}[${inx}][${prop}][${subKey}]`, subValue);
              }
            }else {
              const value = item[prop];
              BundleformData.append(`${key}[${inx}][${prop}]`, value);
            }
          }
        });
      }
    }
    
    BundleformData.append(
      'sections',
      getSectionsToRender().map((section) => section.id )
    );

    config.body = BundleformData;
    
    fetch(`${routes.cart_add_url}`, config)
      .then((response) => response.json())
      .then((response) => {
        renderContents( response )
      }).catch((e) => {
        console.error(e);
      })      
  });
  
  const renderContents = (parsedState) => {
    getSectionsToRender().forEach((section) => {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section.id);
      sectionElement.innerHTML = getSectionInnerHTML(parsedState.sections[section.id], section.selector);
    });
    
    setTimeout(() => {
      document.body.classList.add('overflow-hidden');
      document.querySelector('#CartDrawer-Overlay').addEventListener('click', function(){ 
        document.querySelector(".drawer").classList.remove('animate', 'active');
        document.body.classList.remove('overflow-hidden');
      });
      document.querySelector(".drawer").classList.remove('animate', 'is-empty');
      document.querySelector(".drawer").classList.add('animate', 'active');
    });
  }
  const getSectionInnerHTML = (html, selector = '.shopify-section') => {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerH TML;
  }
  const getSectionsToRender = () => {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer',
      },
      {
        id: 'cart-icon-bubble',
      },
    ];
  }
})
