let express = require('express');
let uuid = require('uuid/v4');
let morgan = require('morgan')
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
let app = express();

app.use(express.static('public'));
app.use(morgan('dev'));

let comentarios = [
{
    id: uuid(),
    titulo: "Que buen blog",
    contenido: "Gracias por compartir. Me gustó mucho",
    autor: "Erick",
    fecha: new Date()
},
{
    id: uuid(),
    titulo: "Hola ",
    contenido: "Me embola",
    autor: "Erick",
    fecha: new Date()
},
{
    id: uuid(),
    titulo: "Pésimo blog",
    contenido: "Que asco",
    autor: "Moises",
    fecha: new Date()
}
];

app.get('/blog-api/comentarios', jsonParser, (req, res) => {
    return res.status(200).json(comentarios);
});

app.get('/blog-api/comentarios-por-autor', jsonParser, (req, res) => {
    let autor = req.query.autor;
    if (autor == undefined) {
        res.statusMessage = "No hay autor proporcionado";
        return res.status(406).send();
    }

    let result = [];

    comentarios.forEach((c) => {
        if (c.autor === autor) {
            result.push(c);
        }
    });

    if (result.length < 1) {
        res.statusMessage = "No se encontraron comentarios para el autor";
        return res.status(404).send();
    }

    return res.status(200).json(result);
});

app.post('/blog-api/nuevo-comentario', jsonParser, (req, res) => {
    let titulo, contenido, autor;

    titulo = req.body.titulo;
    contenido = req.body.contenido;
    autor = req.body.autor;

    if (titulo == undefined) {
        res.statusMessage = "Titulo de comentario no proporcionado";
        return res.status(406).send();
    }
    if (contenido == undefined) {
        res.statusMessage = "Contenido de comentario no proporcionado";
        return res.status(406).send();
    }
    if (autor == undefined) {
        res.statusMessage = "Autor de comentario no proporcionado";
        return res.status(406).send();
    }

    let nuevoComentario = {
        id: uuid(),
        titulo: titulo,
        contenido: contenido,
        autor: autor,
        fecha: new Date()
    };

    comentarios.push(nuevoComentario);
    return res.status(201).json(nuevoComentario);
});

app.delete('/blog-api/remover-comentario/:id', jsonParser, (req, res) => {
    let id = req.params.id;

    let idx;
    
    let comentario = comentarios.find((c, i) => {
        if (c.id == id) {
            idx = i;
            return c;
        }
    });

    if (comentario == undefined) {
        res.statusMessage = "Comentario no existe";
        return res.status(404).send();
    }

    comentarios.splice(idx, 1);
    return res.status(200).send();
});

app.put('/blog-api/actualizar-comentario/:id', jsonParser, (req, res) => {
    if (req.params.id != req.body.id) {
        res.statusMessage = "IDs no coinciden";
        return res.status(406).send();
    }

    let titulo, contenido, autor;

    titulo = req.body.titulo;
    contenido = req.body.contenido;
    autor = req.body.autor;

    if (titulo == undefined && contenido == undefined && autor == undefined) {
        res.statusMessage = "No hay parametros a modificar";
        return res.status(409).send();
    }

    let found = false;
    let nuevoComentario;

    comentarios.forEach((c) => {
        if (c.id.toString() === req.params.id) {
            if (titulo != undefined) {
                c.titulo = titulo;
            }
            if (autor != undefined) {
                c.autor = autor;
            }
            if (contenido != undefined) {
                c.contenido = contenido;
            }
            nuevoComentario = c;
            found = true;
        }
    });

    if (!found) {
        res.statusMessage = "Comentario con ID proporcionado no existe";
        return res.status(404).send();
    }

    return res.status(202).json(nuevoComentario);
});

app.listen(8080, () => {
    console.log("Escuchando en el puerto 8080");
});