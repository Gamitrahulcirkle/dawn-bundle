document.addEventListener('DOMContentLoaded', () => {
  wishlistBtnInit();
  if( window.location.href.indexOf("pages/wishlist") !=-1 ){    
    loadWishListProducts()
    checkWishlist()
  }
})

const loadWishListProducts = () => {
  let handles = localStorage.getItem("dawn_wishlist_product_data");
  if( handles ){
    let handleArray = handles.split(",");
    handleArray.forEach( function(handle, index){
      fetchProductCardHTML(handle)
    })
  }
}

const fetchProductCardHTML = (handle) => {
  const productTileTemplateUrl = `/products/${handle}?view=card`;
  return fetch(productTileTemplateUrl)
  .then((res) => res.text())
  .then((res) => {
    const text = res;
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(text, 'text/html');
    const productCard = htmlDocument.documentElement.querySelector(".card-wrapper"); 
    productCard.querySelector(".custom_wishlist").classList.add("active");
    document.querySelector("[wishlistData]").innerHTML += productCard.outerHTML;
    wishlistBtnInit();
    checkWishlist()
  })
  .catch((err) => console.error(`[Shopify Wishlist] Failed to load content for handle: ${handle}`, err));    
}; 

const wishlistBtnInit = () => {
  const wishListBtns = document.querySelectorAll(".custom_wishlist");
  wishListBtns.forEach( (btn,index) => {
    let productHandle = btn.dataset.product_handle;
    if( wishlistContains(productHandle) ) {
      btn.classList.add("active");
    }
    
    btn.addEventListener("click",function(e){
      let productHandle = btn.dataset.product_handle;
      if( btn.classList.contains("active") ){
        removeWishListData(productHandle);  
      }else{
        addWishListData(productHandle)
      }
      btn.classList.toggle("active")
      
      /* Checkwishlist empty or not */
      checkWishlist()
           
    })
  })
}

const checkWishlist = () =>{
  if( document.querySelector("[wishlistempty]") ){
    document.querySelector("[wishlistempty]").style = "display:block";
  }
  if( document.querySelector("[wishlistdata]") && document.querySelector("[wishlistdata]").innerHTML.trim() != "" ){
    document.querySelector("[wishlistempty]").style = "display:none";
  }
}
const removeWishListData = (handle) => {
  let cardWrapper = document.querySelector(`.custom_wishlist[data-product_handle="${handle}"]`);
  if( cardWrapper ){
    cardWrapper.closest(".card-wrapper").remove();
  }
  setWishlistData( handle );
}

const addWishListData = (handle) => {
  setWishlistData( handle )
}

const wishlistContains = (handle) => {
  const wishlist = getWishlist();
  return wishlist.includes(handle);
};

const setWishlistData = (handle) => {
  const wishlist = getWishlist();
  const indexInWishlist = wishlist.indexOf(handle);
  
  if (indexInWishlist === -1){
    wishlist.push(handle);
  }else{
    wishlist.splice(indexInWishlist, 1);
  }
  return setWishlist(wishlist)
}

const setWishlist = (array) => {
  const wishlist = array.join(",");
  if (array.length){
    localStorage.setItem("dawn_wishlist_product_data", wishlist);
  } else{
    localStorage.removeItem("dawn_wishlist_product_data");
  }
}

const getWishlist = () => {
  const wishlist = localStorage.getItem("dawn_wishlist_product_data") || false;
  if (wishlist){
    return wishlist.split(",");
  }
  return [];
};

