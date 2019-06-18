let model = require("../models/vip.js");
let async = require("async");

module.exports.Repertoire = function (request, response) {
    response.title = 'Répertoire des stars';

    model.getAlphabet(function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
        response.lettres = result;

        response.render('repertoireVips', response);
    });
};


module.exports.DetailleLettre = function (request, response) {
    response.title = 'Détail lettre';
    let lettre = request.params.lettre;

    async.parallel(
        [
            function (callback) {
                model.getStarsCorrespondingToALetter(lettre, function (err, result) {
                    callback(null, result)
                });
            },
            function (callback) {
                model.getAlphabet(function (err, result) {
                    callback(null, result)
                });
            }
        ],
        function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            response.personne = result[0];
            response.lettres = result[1];
            response.render('lettre', response);
        }
    );
};


module.exports.DetailleVip = function (request, response) {
    response.title = 'Détail Vip';
    let idVip = request.params.idVip;
    async.parallel(
        [
            function (callback) {
                model.getDetailsStars(idVip, function (err, result) {
                    callback(null, result)
                });
            },
            function (callback) {
                model.getPhotoPrincipale(idVip, function (err, result) {
                    callback(null, result)
                });
            },
            function (callback) {
                model.getAlphabet(function (err, result) {
                    callback(null, result)
                });
            },
            function (callback) {
                model.getNationalite(idVip, function (err, result) {
                    callback(null, result)
                });
            },
            function (callback) {
                model.getPrincipauxFilmsActeur(idVip, function (err, result) {
                    callback(null, result)
                });
            },
            function (callback) {
                model.getPrincipauxFilmsRealisateur(idVip, function (err, result) {
                    callback(null, result)
                });
            },
            function (callback) {
                model.getPrincipauxDefile(idVip, function (err, result) {
                    callback(null, result)
                });
            },
            function (callback) {
                model.getPrincipauxAlbum(idVip, function (err, result) {
                    callback(null, result)
                });
            },
            function (callback) {
                model.isRealisateur(idVip, function (err, result) {
                    callback(null, result)
                });
            },
            function (callback) {
                model.isActeur(idVip, function (err, result) {
                    callback(null, result)
                });
            },
            function (callback) {
                model.isMannequin(idVip, function (err, result) {
                    callback(null, result)
                });
            },
            function (callback) {
                model.isCouturier(idVip, function (err, result) {
                    callback(null, result)
                });
            },
            function (callback) {
                model.isChanteur(idVip, function (err, result) {
                    callback(null, result)
                });
            },
            function (callback) {
                model.getMariage(idVip, function (err, result) {
                    callback(null, result)
                });
            },
            function (callback) {
                model.getLiaison(idVip, function (err, result) {
                    callback(null, result)
                });
            },
            function (callback) {
                model.getPhotosVIP(idVip, function (err, result) {
                    callback(null, result)
                });
            }
        ],
        function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            response.personne = result[0];
            response.photo = result[1];
            response.lettres = result[2];
            response.nationalite = result[3];
            response.filmsActeur = result[4];
            response.filmsRealisateur = result[5];
            response.defile = result[6];
            response.album = result[7];
            response.isRealisateur = result[8];
            response.isActeur = result[9];
            response.isMannequin = result[10];
            response.isCouturier = result[11];
            response.isChanteur = result[12];
            response.mariage = result[13];
            response.liaison = result[14];
            response.photosVIP = result[15];
            response.nbPhoto = result[15].length;
            response.render('infos', response);
        }
    );
};



