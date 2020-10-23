/* Adivina quien? Version Pokemon */
const P = new Pokedex.Pokedex();

/* Utilidades */
function zeroPad(num, count = 3)
{
  var numZeropad = num + '';
  while(numZeropad.length < count) {
    numZeropad = "0" + numZeropad;
  }
  return numZeropad;
}

let spinner = `<div class="spinner-border" role="status">
<span class="sr-only">Loading...</span>
</div>`

let newPokes = [], resPokes = [], lastPoke;

let play = document.getElementById('play');
let count = 0, countType = 0;

let idColors = [1,2,3,4,5,6,7,8,9,10];
let colors = ['negro', 'azul', 'cafe', 'gris', 'verde', 'rosa', 'morado', 'rojo', 'blanco', 'amarillo'];

let idGeneraciones = [1,2,3,4,5,6,7,8];
let generaciones = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar'];

let idHabitats = [1,2,3,4,6,7,8];
let habitats = ['una cueva', 'el bosque', 'la pradera', 'las montañas', 'el mar', 'la ciudad', 'las orillas del agua'];

let urlImg = ['https://cdn.bulbagarden.net/upload/1/17/Body01.png', 'https://cdn.bulbagarden.net/upload/7/7a/Body02.png',
'https://cdn.bulbagarden.net/upload/d/d3/Body03.png','https://cdn.bulbagarden.net/upload/2/2c/Body04.png',
'https://cdn.bulbagarden.net/upload/d/da/Body05.png','https://cdn.bulbagarden.net/upload/8/88/Body06.png',
'https://cdn.bulbagarden.net/upload/b/bc/Body07.png', 'https://cdn.bulbagarden.net/upload/c/cc/Body08.png',
'https://cdn.bulbagarden.net/upload/9/98/Body09.png','https://cdn.bulbagarden.net/upload/9/97/Body10.png',
'https://cdn.bulbagarden.net/upload/3/36/Body11.png','https://cdn.bulbagarden.net/upload/4/45/Body12.png',
'https://cdn.bulbagarden.net/upload/0/09/Body13.png','https://cdn.bulbagarden.net/upload/4/4b/Body14.png'];

let idFormas = [1,2,3,4,5,6,7,8,9,10,11,12,13,14];
let formas = ['consiste en solamente la cabeza', 'tiene cuerpo como de serpiente', 'tiene aletas', 'consiste en solamente una cabeza y brazos',
              'consiste en solamente una cabeza y una base', 'es un bipedo con cola', 'consiste en solamente una cabeza y piernas', 
              'es cuadrupedo(camina en 4 patas)', 'tiene un par de alas','tiene tentaculos', 'tiene mas de un cuerpo', 'es un bipedo sin cola',
              'tiene dos o mas pares de alas', 'tiene cuerpo de forma de insecto'];

let idTipos = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
let tipos = ['normal', 'pelea', 'volador', 'veneno', 'tierra', 'roca', 'bicho', 'fantasma', 'acero', 'fuego', 'agua', 'planta', 'electrico',
             'psiquico', 'hielo', 'dragon', 'siniestro', 'hada'];

let idSer = [1,2,3,4];
let ser = ['es legendario', 'es mitico', 'tiene pre-evolucion', 'tiene diferentes formas y puede cambiar entre ellas'];

let indexIdPreguntas = [idColors, idGeneraciones, idHabitats, idFormas, idTipos, idSer];
let indexPreguntas = [colors, generaciones, habitats, formas, tipos, ser];
let preguntas = ['es de color predominante ', 'es de la region de ', 'vive en ', '', 'es de tipo ', ''];

/* Start */
play.addEventListener('click', () => {
    play.style.display = 'none';
    document.getElementById('img').setAttribute('src', '');
    document.getElementById('title').innerHTML = '';
    document.getElementById('text').innerHTML = '';

    /* Obtener toda la liste de los pokemon */
    P.getPokemonsList()
    .then(function (response) {
        let pokes = response.results
        pokes.forEach(poke => {
            resPokes.push(poke.name);
        });
        next();
    });


    function next() {
        console.log(resPokes);
        count++;
        let imageUrl = undefined;

        if(preguntas.length > 0 && resPokes.length !== 1) {
            //Obtener una pregunta al azar
            askRand = Math.floor(Math.random() * preguntas.length);
            askRand2 = Math.floor(Math.random() * indexPreguntas[askRand].length);

            if(indexIdPreguntas[askRand] === idFormas) {
                imageUrl = urlImg[askRand2];
            }
            //Mostrar la pregunta obtenida
            Swal.fire({
                title: `¿Tu pokemon ${preguntas[askRand]}${indexPreguntas[askRand][askRand2]}?`,
                html: `<span>Pregunta #${count}</span>`,
                allowOutsideClick: false,
                showDenyButton: true,
                showCancelButton: true,
                imageUrl,
                imageWidth: 100,
                imageHeight: 100,
                confirmButtonText: `Si`,
                denyButtonText: `No`,
                cancelButtonText: `No lo se`
            }).then((result) => {
                document.getElementById('title').innerHTML = spinner;
                //La respuesta es SI
                if (result.isConfirmed) {

                    //Descartar pokemon que NO cumplen con la pregunta
                    function findPokes(response) {
                        newPokes = [];
                        let pokes = response.pokemon_species;
                        pokes.forEach(poke => {
                            newPokes.push(poke.name);
                        });

                        if (resPokes.length === 0) {
                            resPokes = newPokes;
                        } else {
                            let pokes = [];
                            resPokes.forEach(poke => {
                                if(newPokes.includes(poke)) {
                                    pokes.push(poke);
                                }
                            });
                            if(pokes.length === 0) {
                                pokes.push(resPokes[0]);
                            }
                            resPokes = pokes;
                        }
                    }
                    //Tipo de pregunta?
                    switch (indexIdPreguntas[askRand]) {
                        //Color
                        case idColors:
                            P.getPokemonColorByName(indexIdPreguntas[askRand][askRand2])
                            .then(function(response) {
                                document.getElementById('title').innerHTML = '';
                                findPokes(response);
                                indexIdPreguntas.splice(askRand, 1);
                                indexPreguntas.splice(askRand, 1);
                                preguntas.splice(askRand, 1);
                                next();
                            });
                            break;
                        //Generacion
                        case idGeneraciones:
                            P.getGenerationByName(indexIdPreguntas[askRand][askRand2])
                            .then(function(response) {
                                document.getElementById('title').innerHTML = '';
                                findPokes(response)
                                indexIdPreguntas.splice(askRand, 1);
                                indexPreguntas.splice(askRand, 1);
                                preguntas.splice(askRand, 1);
                                next();
                            });
                            break;
                        //Habitat
                        case idHabitats:
                            P.getPokemonHabitatByName(indexIdPreguntas[askRand][askRand2])
                            .then(function(response) {
                                document.getElementById('title').innerHTML = '';
                                findPokes(response)
                                indexIdPreguntas.splice(askRand, 1);
                                indexPreguntas.splice(askRand, 1);
                                preguntas.splice(askRand, 1);
                                next();
                            });
                            break;
                        //Forma
                        case idFormas:
                            P.getPokemonShapeByName(indexIdPreguntas[askRand][askRand2])
                            .then(function(response) {
                                document.getElementById('title').innerHTML = '';
                                findPokes(response)
                                indexIdPreguntas.splice(askRand, 1);
                                indexPreguntas.splice(askRand, 1);
                                preguntas.splice(askRand, 1);
                                next();
                            });
                            break;
                        //Tipo
                        case idTipos:
                            P.getTypeByName(indexIdPreguntas[askRand][askRand2])
                            .then(function(response) {
                                document.getElementById('title').innerHTML = '';
                                countType++;
                                newPokes = [];
                                let pokes = response.pokemon;
                                pokes.forEach(poke => {
                                    newPokes.push(poke.pokemon.name);
                                });
                                
                                if (resPokes.length === 0) {
                                    resPokes = newPokes;
                                } else {
                                    let pokes = [];
                                    resPokes.forEach(poke => {
                                        if(newPokes.includes(poke)) {
                                            pokes.push(poke);
                                        }
                                    });
                                    if(pokes.length === 0) {
                                        pokes.push(resPokes[0]);
                                    }
                                    resPokes = pokes;
                                }

                                if(countType < 2) {
                                    indexIdPreguntas[askRand].splice(askRand2, 1);
                                    indexPreguntas[askRand].splice(askRand2, 1);
                                } else {
                                    indexIdPreguntas.splice(askRand, 1);
                                    indexPreguntas.splice(askRand, 1);
                                    preguntas.splice(askRand, 1);
                                }
                                next();
                            });
                            break;
                        //Caracteristica unica
                        case idSer:
                            newPokes = [];
                            let resPokesCopy = resPokes, n = 0;
                            resPokesCopy.forEach(poke => {
                                P.getPokemonSpeciesByName(poke)
                                .then(function(response) {
                                    n++
                                    switch (indexIdPreguntas[askRand][askRand2]) {
                                        case 1:
                                            if(response.is_legendary) { newPokes.push(response.name) }
                                            break;
                                        case 2:
                                            if(response.is_mythical) { newPokes.push(response.name) }
                                            break;
                                        case 3:
                                            if(response.evolves_from_species !== null) { newPokes.push(response.name) }
                                            break;
                                        case 4:
                                            if(response.forms_switchable) { newPokes.push(response.name) }
                                            break;
                                    }

                                    if(n === resPokesCopy.length) {
                                        document.getElementById('title').innerHTML = '';
                                        let pokes = [];
                                        resPokes.forEach(poke => {
                                            if(newPokes.includes(poke)) {
                                                pokes.push(poke);
                                            }
                                        });
                                        if(pokes.length === 0) {
                                            pokes.push(resPokes[0]);
                                        }
                                        resPokes = pokes;

                                        indexIdPreguntas[askRand].splice(askRand2, 1);
                                        indexPreguntas[askRand].splice(askRand2, 1);
                                        
                                        if(indexIdPreguntas[askRand].length === 0) {
                                            indexIdPreguntas.splice(askRand, 1);
                                            indexPreguntas.splice(askRand, 1);
                                            preguntas.splice(askRand, 1);
                                        }

                                        next();
                                    }
                                }); 
                            });
                            break;
                    }
                //Si la respuesta fue un NO
                } else if (result.isDenied) {
                    //Descartar Pokemon que SI cumplen la pregunta
                    function findNoPokes (response) {
                        newPokes = [];
                        let pokes = response.pokemon_species;
                        pokes.forEach(poke => {
                            newPokes.push(poke.name);
                        });

                        newPokes.forEach(poke => {
                            if(resPokes.includes(poke)) {
                                let i = resPokes.indexOf(poke);
                                resPokes.splice(i, 1);
                            }
                        });
                    }

                    switch (indexIdPreguntas[askRand]) {
                        case idColors:
                            P.getPokemonColorByName(indexIdPreguntas[askRand][askRand2])
                            .then(function(response) {
                                document.getElementById('title').innerHTML = '';
                                findNoPokes(response);
                                
                                indexIdPreguntas[askRand].splice(askRand2, 1);
                                indexPreguntas[askRand].splice(askRand2, 1);
                            
                                if(indexIdPreguntas[askRand] === idFormas) {
                                    urlImg.splice(askRand2, 1)
                                }
                                
                                if(indexIdPreguntas[askRand].length === 0) {
                                    indexIdPreguntas.splice(askRand, 1);
                                    indexPreguntas.splice(askRand, 1);
                                    preguntas.splice(askRand, 1);
                                }

                                next();
                            });
                        break;
                        case idGeneraciones:
                            P.getGenerationByName(indexIdPreguntas[askRand][askRand2])
                            .then(function(response) {
                                document.getElementById('title').innerHTML = '';
                                findNoPokes(response);
                                
                                indexIdPreguntas[askRand].splice(askRand2, 1);
                                indexPreguntas[askRand].splice(askRand2, 1);
                            
                                if(indexIdPreguntas[askRand] === idFormas) {
                                    urlImg.splice(askRand2, 1)
                                }
                                
                                if(indexIdPreguntas[askRand].length === 0) {
                                    indexIdPreguntas.splice(askRand, 1);
                                    indexPreguntas.splice(askRand, 1);
                                    preguntas.splice(askRand, 1);
                                }

                                next();
                            });
                        break;
                        case idHabitats:
                            P.getPokemonHabitatByName(indexIdPreguntas[askRand][askRand2])
                            .then(function(response) {
                                document.getElementById('title').innerHTML = '';
                                findNoPokes(response);
                                
                                indexIdPreguntas[askRand].splice(askRand2, 1);
                                indexPreguntas[askRand].splice(askRand2, 1);
                            
                                if(indexIdPreguntas[askRand] === idFormas) {
                                    urlImg.splice(askRand2, 1)
                                }
                                
                                if(indexIdPreguntas[askRand].length === 0) {
                                    indexIdPreguntas.splice(askRand, 1);
                                    indexPreguntas.splice(askRand, 1);
                                    preguntas.splice(askRand, 1);
                                }

                                next();
                            });
                        break;
                        case idFormas:
                            P.getPokemonShapeByName(indexIdPreguntas[askRand][askRand2])
                            .then(function(response) {
                                document.getElementById('title').innerHTML = '';
                                findNoPokes(response);
                                
                                indexIdPreguntas[askRand].splice(askRand2, 1);
                                indexPreguntas[askRand].splice(askRand2, 1);
                            
                                if(indexIdPreguntas[askRand] === idFormas) {
                                    urlImg.splice(askRand2, 1)
                                }
                                
                                if(indexIdPreguntas[askRand].length === 0) {
                                    indexIdPreguntas.splice(askRand, 1);
                                    indexPreguntas.splice(askRand, 1);
                                    preguntas.splice(askRand, 1);
                                }

                                next();
                            });
                        break;
                        case idTipos:
                            P.getTypeByName(indexIdPreguntas[askRand][askRand2])
                            .then(function(response) {
                                document.getElementById('title').innerHTML = '';
                                
                                newPokes = [];
                                let pokes = response.pokemon;
                                pokes.forEach(poke => {
                                    newPokes.push(poke.pokemon.name);
                                });

                                newPokes.forEach(poke => {
                                    if(resPokes.includes(poke)) {
                                        let i = resPokes.indexOf(poke);
                                        resPokes.splice(i, 1);
                                    }
                                });
                                
                                indexIdPreguntas[askRand].splice(askRand2, 1);
                                indexPreguntas[askRand].splice(askRand2, 1);
                            
                                if(indexIdPreguntas[askRand] === idFormas) {
                                    urlImg.splice(askRand2, 1)
                                }
                                
                                if(indexIdPreguntas[askRand].length === 0) {
                                    indexIdPreguntas.splice(askRand, 1);
                                    indexPreguntas.splice(askRand, 1);
                                    preguntas.splice(askRand, 1);
                                }

                                next();
                            });
                        break;
                        case idSer:
                            newPokes = [];
                            let resPokesCopy = resPokes, n = 0;
                            resPokesCopy.forEach(poke => {
                                P.getPokemonSpeciesByName(poke)
                                .then(function(response) {
                                    n++
                                    switch (indexIdPreguntas[askRand][askRand2]) {
                                        case 1:
                                            if(response.is_legendary === false) { newPokes.push(response.name) }
                                            break;
                                        case 2:
                                            if(response.is_mythical === false ) { newPokes.push(response.name) }
                                            break;
                                        case 3:
                                            if(response.evolves_from_species === null) { newPokes.push(response.name) }
                                            break;
                                        case 4:
                                            if(response.forms_switchable === false) { newPokes.push(response.name) }
                                            break;
                                    }

                                    if(n === resPokesCopy.length) {
                                        document.getElementById('title').innerHTML = '';
                                        let pokes = [];
                                        resPokes.forEach(poke => {
                                            if(newPokes.includes(poke)) {
                                                pokes.push(poke);
                                            }
                                        });
                                        if(pokes.length === 0) {
                                            pokes.push(resPokes[0]);
                                        }
                                        resPokes = pokes;

                                        indexIdPreguntas[askRand].splice(askRand2, 1);
                                        indexPreguntas[askRand].splice(askRand2, 1);
                                        
                                        if(indexIdPreguntas[askRand].length === 0) {
                                            indexIdPreguntas.splice(askRand, 1);
                                            indexPreguntas.splice(askRand, 1);
                                            preguntas.splice(askRand, 1);
                                        }

                                        next();
                                    }
                                }); 
                            });
                        break;
                        
                    }
                //Si el resultado fue un No lo se
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    //Descartar la pregunta de la lista de preguntas por hacer
                    indexIdPreguntas[askRand].splice(askRand2, 1);
                    indexPreguntas[askRand].splice(askRand2, 1);

                    if(indexIdPreguntas[askRand] === idFormas) {
                        urlImg.splice(askRand2, 1)
                    }
                    
                    if(indexIdPreguntas[askRand].length === 0) {
                        indexIdPreguntas.splice(askRand, 1);
                        indexPreguntas.splice(askRand, 1);
                        preguntas.splice(askRand, 1);
                    }
    
                    next();
                }
            });
        //Si se acabaron las preguntas, o solo queda un pokemon en el array
        } else if(resPokes.length === 1 || preguntas.length === 0) {
            P.getPokemonSpeciesByName(resPokes[0])
            .then(function(response) {
                document.getElementById('title').innerHTML = '';
                let pokeImg = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${zeroPad(response.id)}.png`;
                let imgElement = document.getElementById('img');
                imgElement.setAttribute('src', pokeImg);
    
                let mensaje = `Tu pokemon es ${response.name}`;
                let titleElement = document.getElementById('title');
                let textElement = document.getElementById('text');
                titleElement.innerHTML = mensaje;
                textElement.innerHTML = '';
            });
        }
    }
});