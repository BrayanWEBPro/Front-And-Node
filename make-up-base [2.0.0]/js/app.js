let inputName = document.querySelector('#filter-name');
let selectFilterType = document.querySelector('#filter-type');
let selectFilterBrand = document.querySelector('#filter-brand');
let selectSortType = document.querySelector('#sort-type');
let sectionProducts = document.querySelector('.catalog');

let produtosAll = [];

async function load(){
    
    const promiseData = await fetch('http://localhost:3000/products');
    const data = await promiseData.json();

    const brands = [... new Set(data.map(p => p.brand)) ];
    const product_types = [... new Set(data.map(p => p.product_type)) ];

    buildForm(brands, product_types);
    produtosAll = data;
    buildCatalog(data);
    
}

load();

function buildCatalog(listProducts){
    sectionProducts = document.querySelector('.catalog');
    let productAll = '';
    listProducts.forEach(p => {
        const productHtml = productItem(p);
        productAll += productHtml;
        
    });

    sectionProducts.innerHTML = productAll;

}

function buildForm(arrayBrands, arrayTypes){
    inputName = document.querySelector('#filter-name');
    selectSortType = document.querySelector('#sort-type')
    document.querySelectorAll('.input-filter').forEach(item => {

        const eventFilter = (event) => {
            const name = inputName.value;
            const brand = selectFilterBrand.options[selectFilterBrand.selectedIndex].value;
            const type = selectFilterType.options[selectFilterType.selectedIndex].value;
            const sortbY = selectSortType.options[selectSortType.selectedIndex].text;
            
            let result = produtosAll;
            
            if(name){
                result = result.filter(p => p.name.toUpperCase().includes(name.toUpperCase()));
            }
            if(brand){
                result = result.filter(p => p.brand == brand);
            }
            if(type){
                result = result.filter(p => p.product_type == type);
            }
            if(sortbY){
                switch (sortbY){
                    case 'Melhor Avaliados':
                        result.sort( (p1, p2) => 
                            (p2.rating | 0) - (p1.rating | 0)
                        );
                        break;
                    case 'Menores Preços':
                        result.sort( (p1, p2) => 
                            parseFloat(p1.price) - parseFloat(p2.price)
                            );
                        break;
                    case 'Maiores Preços':
                        result.sort( (p1, p2) => parseFloat(p2.price) - parseFloat(p1.price));
                        break;
                    case 'A-Z':
                        result.sort( (p1, p2) => {
                            if (p2.name > p1.name) 
                                return -1;
                        
                            if (p1.name > p2.name) 
                                return 1;
                        
                            return 0;
                        });
                        break;
                    case 'Z-A':
                        result.sort( (p1, p2) => {
                            if (p1.name > p2.name) 
                                return -1;
                        
                            if (p2.name > p1.name) 
                                return 1;
                        
                            return 0;
                        });
                        
                    break;
                } 
            }
            buildCatalog(result);
        } 

        item.addEventListener('change', eventFilter);
      });
    
    selectFilterType = document.querySelector('#filter-type');
    selectFilterBrand = document.querySelector('#filter-brand');

    arrayBrands.forEach( b => {
        option = document.createElement( 'option' );
        option.value = b;
        option.text = b;
        selectFilterBrand.add( option );
    });

    arrayTypes.forEach( b => {
        option = document.createElement( 'option' );
        option.value = b;
        option.text = b;
        selectFilterType.add( option );
    });
}


//EXEMPLO DO CÓDIGO PARA UM PRODUTO
function productItem(product) {
  const item = `<div class="product" data-name="${product.name}" data-brand="${product.brand}" data-type="${product.category}" tabindex="508">
    <figure class="product-figure">
        <img src="${product.image_link}" 
            width="215" height="215" 
            alt="${product.image_link}" 
            onerror="javascript:this.src='img/unavailable.png'">
    </figure>
    <section class="product-description">
        <h1 class="product-name">${product.name}</h1>
        <div class="product-brands"><span class="product-brand background-brand">${product.brand}</span>
    <span class="product-brand background-price">${product.price * 5.5}</span></div>
    </section>
    ${loadDetails(product)}
    </div>`;

    return item;
}

//EXEMPLO DO CÓDIGO PARA OS DETALHES DE UM PRODUTO
function loadDetails(product) {
  let details = `<section class="product-details"><div class="details-row">
        <div>Brand</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.brand}</div>
        </div>
      </div><div class="details-row">
        <div>Price</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${(product.price * 5.5) | 0 }</div>
        </div>
      </div><div class="details-row">
        <div>Rating</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${parseFloat(product.rating) | 0}</div>
        </div>
      </div><div class="details-row">
        <div>Category</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.category || ''}</div>
        </div>
      </div><div class="details-row">
        <div>Product_type</div>
        <div class="details-bar">
          <div class="details-bar-bg" style="width= 250">${product.product_type || ''}</div>
        </div>
      </div></section>`;

    return details;
}
