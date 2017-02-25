'use strict';

const handler = require('../handlers/users');
const schema = require('../schemas/user');
const baseurl = '/users';

const Joi = require('joi');

exports.register = (server, options, next) => {
    server.route([
        {
            method : 'POST',
            path   : baseurl,
            config : {
                description : 'Users creation route',
                notes       : 'Permet la création d\'un utilisateur',
                tags        : [ 'api' ],
                handler     : handler.creation,
                validate    : {
                    payload : schema.creation
                }
            }
        },
        {
            method : 'DELETE',
            path   : baseurl + '/{id}',
            config : {
                description : 'Users deletion route',
                notes       : 'Permet la suppression d\'un utilisateur',
                tags        : [ 'api' ],
                handler     : handler.deletion,
                validate: {
                    params: {
                        id: Joi.string().required()
                    }
                }
            }
        },
        {
            method : 'PUT',
            path   : baseurl,
            config : {
                description : 'Users update route',
                notes       : 'Permet de modifier les informations d\'un utilisateur',
                tags        : [ 'api' ],
                handler     : handler.update,
                validate    : {
                    payload : schema.update
                }
            }
        },
        {
            method : 'GET',
            path   : baseurl + '/{id}',
            config : {
                description : 'User display route',
                notes       : 'Permet d\'afficher les informations d\'un utilisateur',
                tags        : [ 'api' ],
                handler     : handler.display,
                validate: {
                    params: {
                        id: Joi.string().required()
                    }
                }
            }
        },
        {
            method : 'GET',
            path   : baseurl,
            config : {
                description : 'Users display all route',
                notes       : 'Permet de lister l\'ensemble des utilisateurs',
                tags        : [ 'api' ],
                handler     : handler.displayAll
            }
        },
        {
            method : 'POST',
            path   : baseurl + '/authent',
            config : {
                description : 'Users authentification route',
                notes       : 'Permet l\'authentification des utilisateurs',
                tags        : [ 'api' ],
                handler     : handler.authentification,
                validate    : {
                    payload : Joi.object({
                        login : Joi.string().alphanum().min(3).max(20).required(),
                        password : Joi.string().required()
                    })
                }
            }
        },
        {
            method : 'GET',
            path   : baseurl + "/reset-password/{login}",
            config : {
                description : 'Users password reset route',
                notes       : 'Permet de lancer une procédure de réinitialisation du mot de passe utilisateur',
                tags        : [ 'api' ],
                handler     : handler.reset,
                validate    : {
                    params: {
                        login: Joi.string().required()
                    }
                }
            }
        },
        {
            method : 'GET',
            path   : baseurl + "/generate",
            config : {
                description : 'Users random generation route',
                notes       : 'Permet de générer un certain nombre d\'utilisateurs de façon aléatoire',
                tags        : [ 'api' ],
                handler     : handler.generation
            }
        },

    ]);
    next();
};

exports.register.attributes = {
    name : 'users-routes'
};