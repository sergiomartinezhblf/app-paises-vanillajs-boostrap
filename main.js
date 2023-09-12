const lista = document.getElementById("lista")
const inputRegion = document.getElementById("inputRegion")
const inputSubregion = document.getElementById("inputSubregion")
const inputBuscar = document.getElementById("buscar-pais")
const formBuscar = document.getElementById("form-buscar")
const paginacion = document.getElementById("paginacion")
const next = document.getElementById("next")
const prev = document.getElementById("prev")
let regiones=[]
let subregiones=[]
let paginas=[]
let pagina_activa=1

//FUNCIÓN PARA OBTENER LOS PAISES DE LA API REST CONTRY
const fetchData = async() =>{
    try {
        const res = await fetch("https://restcountries.com/v3.1/all")
        const data = await res.json()
        console.log(data)
        paginas = obtenerPaginas(data)
        console.log(paginas)
        pintarPagina(paginas)
        regiones=obtenerRegiones(data)
        console.log(regiones)
        pintarInputRegiones(regiones)
        subregiones=obtenerSubRegiones(data,regiones)
        console.log(subregiones)
        

        //PINTAR OPTIONS SUBREGIONES
        inputRegion.addEventListener("change",(e)=>{
            subregiones.forEach(el=>{
             if(el.nombre===e.target.value){
             let subregiones ="<option selected>---</option>"
             el.subregiones.forEach(el=>{
                subregiones+=`<option value="${el}">${el}</option>`
             })
            inputSubregion.innerHTML=subregiones
             }})
        })

        //FILTRA LOS PAISES POR REGION
        inputRegion.addEventListener("change",(e)=>{
        inputBuscar.value=""    
        if(e.target.value==="Todas"){ 
        pintarPagina(paginas)
        paginacion.style.visibility="visible"
        inputSubregion.innerHTML="<option selected>---</option>"
        }
        else {let paises = data.filter(el=>el.region===e.target.value)
            pagina_activa=1
            pintarPaises(paises,pagina_activa)
            paginacion.style.visibility="hidden"
        }})

        //FILTRA LOS PAISES POR SUBREGION
        inputSubregion.addEventListener("change",(e)=>{
          console.log(e.target.value)
          let paises = data.filter(el=>el.subregion===e.target.value)
          pagina_activa=1
          pintarPaises(paises,pagina_activa)
        })

        //FILTRA PAIS POR INPUT BUSCAR
        inputBuscar.addEventListener("keyup",(e)=>{
            paginacion.style.visibility="hidden"
            pintarInputRegiones(regiones)
            inputSubregion.innerHTML="<option selected>---</option>"
            let buscar = e.target.value.toLowerCase()
            let paises = data.filter(el=>el.name.common.toLowerCase().includes(buscar))
            pagina_activa=1
            pintarPaises(paises,pagina_activa)
            if (buscar==="")
            {pintarPagina(paginas)
            paginacion.style.visibility="visible"    
            }
            if(paises.length==0) lista.innerHTML="No se encontraron resultados para la busqueda"
        })

        //FILTRAR PAIS POR FORM BUSCAR
        formBuscar.addEventListener("submit",(e)=>{
            e.preventDefault()
            console.log(inputBuscar.value)
            paginacion.style.visibility="visible"
            pintarInputRegiones(regiones)
            inputSubregion.innerHTML="<option selected>---</option>"
            let buscar = inputBuscar.value.toLowerCase()
            let paises = data.filter(el=>el.name.common.toLowerCase().includes(buscar))
            pagina_activa=1
            pintarPaises(paises)
            if (inputBuscar.value===""){pintarPagina(paginas)
                paginacion.style.visibility="visible"    
                }
                if(paises.length==0) lista.innerHTML="No se encontraron resultados para la busqueda"    
        })

        //PAGINACIÓN
        paginacion.addEventListener("click",(e)=>{
            let elementos = document.querySelectorAll(".page-link")
            elementos.forEach(el=>el.classList.remove("active"))
            if(e.target.classList.contains("page-link")){
                if(e.target.textContent<=paginas.length){
                e.target.classList.add("active")
                pintarPagina(paginas,e.target.textContent)}
            }
            
            if(e.target.parentNode.classList.contains("prev")) {
                elementos.forEach(el=>{
                    if(el.textContent<=paginas.length){
                        el.textContent=parseInt(el.textContent)-1
                        if(el.textContent==1){
                          e.target.parentNode.classList.add("disabled")  
                        }
                        if(el.textContent<paginas.length){
                          next.classList.remove("disabled")  
                        }
                    }
                })
            }

            if(e.target.parentNode.classList.contains("next")) {
                elementos.forEach(el=>{
                    if(el.textContent<=paginas.length-1){
                    el.textContent=parseInt(el.textContent)+1
                        if(el.textContent==paginas.length){
                        e.target.parentNode.classList.add("disabled")
                        }
                    }
                    if(el.textContent>1) {
                      prev.classList.remove("disabled")
                    }
                })
            }
          e.target.classList.add("active")
        })

        next.addEventListener("click",()=>{
            if(pagina_activa<paginas.length)
            pintarPagina(paginas,pagina_activa+1)
        })
        prev.addEventListener("click",()=>{
            if(pagina_activa>1)
            pintarPagina(paginas,pagina_activa-1)
        })
       
        lista.addEventListener("click",(e)=>{
            let pais = data.filter(el=>el.name.common === e.target.parentNode.dataset.country)
            let lenguajes = ""
            Object.values((pais[0].languages)).forEach(el=>lenguajes+=`${el}, `)
            lenguajes = lenguajes.slice(0,lenguajes.length-2)
            let monedas = ""
            Object.values(pais[0].currencies).forEach(el=>monedas+= `${el.name}(${el.symbol})`)
            console.log(monedas)
            document.querySelector(".modal-title").innerHTML=`${pais[0].name.common}`
            document.querySelector(".modal-body").innerHTML=
            `<img class="float-start me-2"src="${pais[0].coatOfArms.svg}" style="width:15%;"><p>${pais[0].name.common} es un pais de la region de ${pais[0].region}, cuyo nombre oficial \n
             es ${pais[0].name.official}, la capital es ${pais[0].capital}, tiene una extensión territorial de ${pais[0].area}km<small>2</small> \n
             y esta ubicado en la subregion de ${pais[0].subregion}.</p>
             <p class="mb-3">${pais[0].name.common} ${pais[0].independent?"":"no "}es un pais independiente. Tiene una población de ${pais[0].population} habitantes. La moneda es ${monedas}. Idioma(s): ${lenguajes}</p>
             <img src="${pais[0].flags.svg}" alt="${pais[0].flags.alt}" style="width:100%;"></img<>` 
        })
       
        
    } catch (error) {
        
    }
}
   


const pintarPagina =(paginas,pag=1)=>{
  let paises=""
  let pagina = paginas[pag-1]
  pagina_activa=parseInt(pagina.pagina)
  console.log(pagina_activa)
  pintarPaises(pagina.paises,pagina_activa)
   pag==1? document.querySelectorAll(".page-link")[1].classList.add("active")
   :document.querySelectorAll(".page-link")[1].classList.remove("active")
}

const pintarPaises = (data,pag_activa)=>{
    let paises=""
    data.forEach((el,index) => {
        paises+=`
    <div class="row my-1 pais py-1" data-bs-toggle="modal" data-bs-target="#staticBackdrop" data-country="${el.name.common}">
    <div class="col-3 d-flex justify-content-around align-items-center">${index+1+((pag_activa-1)*40)} <img src="${el.flags.svg}" style="width:50px;"></img></div>
    <div class="col-5 d-flex align-items-center">${el.name.common}</div>
    <div class="col-4 d-flex align-items-center">${el.capital}</div>
    </div>` 
    })
    lista.innerHTML=paises
}

//FUNCIÓN PARA OBTENER LAS REGIONES
const obtenerRegiones = (data)=>{
     let region=data.map(el=>el.region)
     let regiones=[...new Set(region)]
     return regiones
     }

 //FUNCIÓN PARA OBTENER LAS SUBREGIONES    
 const obtenerSubRegiones = (data,regiones) => {
    let subregiones = []
    regiones.forEach(el=>{
        let subregion = data.filter(elem=>elem.region===el)
        let paises = subregion.map(el=>el.subregion)
        let soloregiones = [...new Set (paises)]
        let region= {nombre:el,
                     subregiones: soloregiones
        }
        subregiones.push(region)
    })
    return subregiones
 }    
    
//PINTAR OPTIONS REGIONES 
const pintarInputRegiones = (regiones) =>{
    let options ="<option selected>Todas</option>"
    for (const region of regiones) {
        options+=`<option value="${region}">${region}</option>`
    }
    inputRegion.innerHTML=options 
    
}

//FUNCIÓN PARA OBTENER LOS ELEMENTOS DE CADA PAGINA
const obtenerPaginas = (data) => {
    let paginas = []
    let num_paises = data.length
    let paises_x_pagina = 40
    let num_de_paginas = Math.floor(num_paises/paises_x_pagina)
    console.log(num_paises,paises_x_pagina,num_de_paginas)
    for (let i = 0; i < num_de_paginas; i++) {
        let pag = data.slice(paises_x_pagina*i,(paises_x_pagina*i)+paises_x_pagina)
        let pagina = {pagina:i+1,
                      paises:pag
                      }
        paginas.push(pagina)              
    }
    let resto = num_paises%paises_x_pagina
    if (resto>0) {
        let pag = data.slice(paises_x_pagina*num_de_paginas,paises_x_pagina*num_de_paginas+resto)
        let pagina = { pagina: num_de_paginas+1,
                       paises:pag
        }
        paginas.push(pagina)
    }
    return paginas
}    


document.addEventListener("DOMContentLoaded",fetchData)



